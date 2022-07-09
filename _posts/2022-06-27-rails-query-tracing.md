---
layout: posttail
title: "Fun with Rails Query Tracing"
image: /assets/img/code_detective.png
category: Ruby
tags: [Ruby, Rails, ActiveRecord, LogSubscriber, Tips]
---
{% include JB/setup %}

# Finding the Origins of Database Queries

There are a number of reasons and times when trying to find the specific origin of a DB query comes up. Most often in legacy systems which have spiraled into extremely complex systems. A common cause is a shared database and trying to figure out which application is causing some specific query. Even in a single application, trying to tease out DB queries that have embedded themselves deep within a shared library. Whatever the cause, trying to find the source of a DB query comes up as a fairly common code detective task from time to time. Let's look at a few approaches to tracking down the query.

# Adding Query Comments

A really helpful tool for Rails is [Marginalia](https://github.com/basecamp/marginalia), which can append comments about the source of a query to the query itself as a comment. This lets one leverage traditional DB tools like slow query logs, etc, and cross-reference from the query back to the code source. The output would look something like the below, depending on the tool you used to look at the queries.

NOTE: A new Ruby query commenter has recently come up as an option. Implementing an open standard that integrates with open tracing and can join with trace-ids to other observability data. It is an implementation of [Google's SqlCommenter standard](https://google.github.io/sqlcommenter/), which has a [Rails Implementation](https://google.github.io/sqlcommenter/ruby/rails/) which extends Marginalia with additional information.

```sql
my-service 	SELECT COUNT(*) FROM some_table WHERE some_table.some_reference_id = ??? /*application:my-service,controller:endpoint_a,action:show*/ 	1,181
my-service 	SELECT some_table.* FROM some_table WHERE some_table.id = ??? LIMIT ??? /*application:my-service,controller:endpoint_b,action:create*/ 	3,227
```

Some tools strip the comments or need to be configured to keep them. You can also set up your Rails logs to output this as well, but it can be really verbose. I leave it off by default but can toggle it on when debugging something specific.

```ruby
# add in config/initializers/marginalia.rb
Marginalia.application_name = "my-service"

if ENV["ENABLE_AR_LOGGING"]
  ActiveRecord::Base.logger = config.logger
  ActiveRecord::Base.logger.level = Logger::DEBUG
end
```

# DD Database APM

If you are already using an observability tool, many offer rich support for databases these days. For example, Datadog now offers [database monitoring](https://docs.datadoghq.com/database_monitoring/). This can be a really powerful tool, and help to understand and drive the deprecation of tables over time. A few quick notes

* If you have multiple applications connecting to a shared DB, ensure a unique DB Username so that datadog can attribute queries to specific applications
* DD, unfortunately, strips query comments, it would be really nice if they kept the query comment in the DB Monitoring both for query metrics and samples.
* [query_metrics](https://docs.datadoghq.com/database_monitoring/query_metrics/) - understand query load, speed, etc especially a historical view
* [query_samples](https://docs.datadoghq.com/database_monitoring/query_samples/) - all the details around specific queries
* The APM application traces can help pinpoint where the code initiates the database span.

# Fun with Rails LogSubscriber

While the others are great general tooling, what if you need something more specific, or you just want to try to find specific queries by running tests and seeing the call stack? Well, this being Ruby of course we can hack together something for development.

## Finding the Query Needle In the Haystack

Looking for call chains causing specific active record queries? Why not log out the call stack info or drop a debugger to inspect the code whenever a particular query is executed. Combining this with a robust test suite should help track down all the offending callers in no time.

Rails or more specifically `ActiveRecord/ActiveSupport` have all sorts of cool tools. A really useful one is [LogSubscriber](https://api.rubyonrails.org/classes/ActiveSupport/LogSubscriber.html), it is a part of the [Active Support Instrumentation / Notifications ecosystem](https://edgeguides.rubyonrails.org/active_support_instrumentation.html), which overall is really cool. It can be used to hook into many of the common abstractions in Rails, for example [adding custom action controller logging](https://stackoverflow.com/questions/6377190/modify-log-format-and-content-from-default-actioncontroller-logsubscriber-in-rai).

In our case, let's listen to all active record queries, with a log subscriber, and capture any of interest. This is some throw-away code I add when needed, I track down whatever I am looking for and remove it when my work is complete.

```ruby
# add in spec_helper.rb, or other test setup files
module ActiveRecord
  class LogSubscriber < ActiveSupport::LogSubscriber
    def sql(event)
      # NOTE: I add a global $ignore_query == false && if I need to say ignore all the factories or before/after spec specific queries to help
      # only find callers in application code.
      if /FROM "some_table" WHERE "some_condition"/.match?(event.payload[:sql])
        Rails.logger.info "SQL FOUND #{caller_locations[15...150]}" 
        binding.irb if ENV["QUERY_BINDING"]
      end
    end
  end
end

ActiveRecord::LogSubscriber.attach_to :active_record
```

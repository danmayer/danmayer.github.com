---
layout: posttail
authors: ["Dan Mayer"]
title: "Managing DB Schema & Data Changes"
category: Programming 
tags: [Database, Ruby, Database]
---
{% include JB/setup %}

As you work with a growing team and codebase, occasionally database changes will cause some surprises and issues during deploys. This seems to be especially true in the Rails world, but isn't exclusively a Rails app problem. Rails has a simple way to handle schema changes, which works well for small additive changes, but struggles on larger changes to an existing DB.

As I have worked with a few teams, it is worth calling out some issues and learnings about how to help avoid some issues.

* deleting tables
* changing columns
* slow and missing indexes
* long running migrations
* data migration vs schema changes
* communication issues between data and software teams

## Team Policies

At [Offgrid Electric](http://offgrid-electric.com), we have shared github wikis with documentation, process, and policies. Over time the team has built up processes related to making database changes to our application. These policies help us avoid some off the pitfalls, while encouraging good communication. We adjust them over time, but it might be helpful for other organizations as they begin to run into any issues around database change process. Below is a partial scrubbed version of our documentation. 

---

## Schema Changes Process

Changes to the data model (adding/removing tables/columns) should involve active communication with the data team to ensure:

1. New structures (tables/columns) include all of the information we might need for future analysis in a format that is conducive to performing that analysis
2. Structural changes/removals (tables/columns) do not break existing data pipeline processes or reports

The following processes should help us ensure these points.


### Process for Adding New Tables / Columns

1. If a new process is being modeled in the database the Business Intelligence (BI) and Data Infrastructure (DI) teams should be actively involved in the data modeling process to ensure all of the information needed for analysis is being collected.
2. Migration PR's should have a :thumbsup: from someone on the data-infrastructure team prior to merging.
3. The DB migration to should be merged and run on staging prior to production. If there is any possible impact to dataware house it should remain on staging for a day (so the nightly data tasks run against staging) prior to being merged and deployed to production.

### Process for Modification or Removal of Tables / Columns

1. A ticket should be created in the Data Warehouse Jira project backlog. The ticket should list the proposed modifications and ask that someone confirm there are no ETL or BI processes that utilize the column/table that is being changed. Completion of this ticket should be a prerequisite for a PR.
2. Migration PR's should have a :thumbsup: from someone on the `data-infrastructure` team prior to merging.

## Database General Guidelines

Avoid adding columns with a `json` data type.  Our data warehouse uses [AWS Redshift](https://aws.amazon.com/documentation/redshift/), which does not have robust support for JSON column types.  Which means that any data that starts off as `json` in our DB becomes, incredibly hard to query. Since it's hard to know what we will want to query in the data warehouse, it's safest to assume "all of it."  If that's the case, then we should strongly avoid `json` column types in Surge.

## Adding large indexes

Creating an index on a large table can be slow, if you follow the process recommended here, it won't lock the tables during the indexing process.

* avoid locking
* if you indexing will take more than 10 minutes do it outside of a deploy, following the `Modifying Large Tables` process.

[postgres concurrent indexing in Rails](https://robots.thoughtbot.com/how-to-create-postgres-indexes-concurrently-in)

## Modifying Large Tables

Why we need a process to modify large tables. This isn't handled well by automatically running Rails migrations on deploy.

1. Migration happen on deploy, any migration longer than 10 min will time out
2. If we take down old workers during the deploy we will have an outage while the migration finishes (this used to occur on old deploy process, but no longer should be a problem)
3. Large DB changes can be a bit risky and effect performance it is good to schedule them.

__Solution:__

To avoid this we commit the migration but run it manually from a console.

1. Make a PR with the migration only, no code changes
2. Commit the migration with a leading underscore `_` to it won't run automatically
   * for example `db/migrate/_20160817125700_add_transaction_date.rb` vs `db/migrate/20160817125700_add_transaction_date.rb`
3. Have data team review and approve migration as recommended for all schema changes as mentioned above
4. After approved, schedule a time to run migration during low site traffic volume (after 10pm EAT)
  * after data team approval and schedule is set make sure to do the below process on staging at least a day before the scheduled production run
5. merge the PR to master
6. deploy to master, MIGRATION SHOULD NOT RUN ON DEPLOY
7. connect to production console, and manually execute the migration
  * rename migration and remove the `_`
  * in this example: `mv db/migrate/_20160817125700_add_transaction_date.rb db/migrate/20160817125700_add_transaction_date.rb`
  * execute the migration: `bundle exec rake db:migrate`

  
__Alternate Complex Solution:__

Rarely there is a reason to bypass migrations entirely and make a change manually against the DB. In these special cases which normally means a DBA is going to perform some magic to migrate something without locking, the process is slightly different.

Basically the same as above __BUT__:

1. migration file should never run in production, we still want it for dev, testing, and likely staging though. In this case skip the `_` naming part of the process mentioned above.  


```ruby
class AddTransactionDate < ActiveRecord::Migration
  def up
    unless Rails.env.production?
      add_column :account_transactions, :transaction_date, :datetime
      execute "UPDATE account_transactions SET transaction_date = created_at"
      ...
    end
  end
```   
2. In all non production environments, deploy and let the migration run
3. In production have the DBA do their magic and then insert the migration into the schema table the migration should never even execute on production
   * `ActiveRecord::Base.connection.execute("INSERT INTO schema_migrations (version) VALUES('20130817125700')")`
4. At this point merge to master and deploy. The migration should be skipped, if anything went wrong the `unless Rails.env.production?` should also protect against the migration accidentally running. 


## Data Migrations vs. Schema Migrations

Data migrations often can take far over 10 minutes, if you are iterating through and modifying a large table we have had some that take hours. This isn't a good first for the standard Rails migration or standard deployment processes. So we looked for some other options

We previously ran release tasks, kind of following the [thoughtbot process](https://robots.thoughtbot.com/data-migrations-in-rails). These are basically managed rake tasks, but occasionally folks weren't sure what had been run by whom and when. While this worked OK, we thought we could do better.

Our team ended up creating [rails-data-migrations](https://github.com/OffgridElectric/rails-data-migrations) which is a lightweight wrapper around standard Rails migrations to create data migrations. These use the same mechanism to store the timestamp into the `schema_migrations` as a standard migration, but they don't run on default `db:migrate`. The data migrations are included in their own `db/data_migrations` and include a generator to create new migrations (`rails generate data_migration migration_name`). 

* data migrations don't run by default on deploy
* we can kick them off in console
* they will only run once and it is easy to check if anyone has run them
* you can run all missing data migrations against a environment with a single command.
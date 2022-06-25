---
layout: post
title: "Fun with Rails LogSubscriber"
image: /assets/img/ladybugs.jpg
category: Ruby
tags: [Ruby, Rails, ActiveRecord, LogSubscriber, Tips]
---
{% include JB/setup %}

## Finding the Query Needle In the Haystack

Looking for call chains causing specific active record queries?


## LogSubscriber

```ruby
module ActiveRecord
  class LogSubscriber < ActiveSupport::LogSubscriber
    def sql(event)
      puts "SQL FOUND #{caller_locations[15...150]}" if $ignore_query == false && /FROM "core_client" WHERE "core_client"/.match?(event.payload[:sql])
    end
  end
end

ActiveRecord::LogSubscriber.attach_to :active_record
```

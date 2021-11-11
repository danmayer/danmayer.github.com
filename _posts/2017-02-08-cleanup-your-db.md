---
layout: posttail
authors: ["Dan Mayer"]
title: "Cleanup your DB, find unused tables"
category: Programming
tags: [Programming, Ruby, Tips]
---
{% include JB/setup %}

As systems grow sometimes tables and models come and go. Often things don't get fully cleaned up or removed from the system. As time goes on it is often harder and harder to know what is safe to remove, as people involved with the code may have moved on. I have used lots of little tricks to clean up dead code. I even maintain [Coverband](https://github.com/danmayer/coverband) to find code usage in production. One trick [Tom Copeland](https://twitter.com/tcopeland) pointed out to me was checking the max created at on a given table to see when it was last used. It was so simple and helpful I ended up wanting to do that across all tables not just individual models.

# Rake DB cleanup

I first tried to do this in pure SQL with a subquery, but when I was having trouble making it work, I found a post basically saying don't do that. It's point was if you are going to run a subquery over a collection of all your tables us code not SQL. In the end I made a simple Rake task to output the data I wanted.  You should be able to drop it into your own project and get a good idea of tables that might not be needed and get to drop the related code as well. In my case it brought about 14 tables to our attention to schedule for cleanup.

```ruby
namespace :database do
  desc 'List all tables in surge DB and last usage, help find tables to remove'
  task :list_recent => :environment do
    table_data = {}
    skip_large_slow_tables = ['some_table', 'versions']

    sql = "select * from information_schema.tables where table_schema='public' and table_type='BASE TABLE';"
    tables_array = ActiveRecord::Base.connection.execute(sql)
    tables_array.each do |table|
      table_name = table['table_name']
      next if skip_large_slow_tables.include?(table_name)
      puts "running: #{table_name}"
      begin
        sql = "select max(created_at) from #{table_name};"
        max_result = ActiveRecord::Base.connection.execute(sql).first['max']
      rescue
        max_result = 'N/A'
      end
      table_data[table_name] = max_result
    end
    table_data.sort_by{|k,v| v.to_s }.each do |pair|
      table = pair.first
      max = pair.last
      puts "#{table}:#{max}"
    end
  end
end
```

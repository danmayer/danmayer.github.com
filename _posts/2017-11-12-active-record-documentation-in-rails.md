---
layout: posttail
authors: ["Dan Mayer"]
title: "Active Record Database Documentation"
image: /assets/img/ring-binders.jpg
category: Ruby
tags: [Ruby, Rails, Database, AWS, Postgres]
---
{% include JB/setup %}


{% unless page.image %}
![Database Documentation](/assets/img/ring-binders.jpg)
{% endunless %}
> Documentation Folders [CC image from Pixabay](https://pixabay.com/en/ring-binders-aligned-organization-2654130/)

# Active Record Database Documentation

This post will cover how to use the Active Record feature to add comments to your tables, columns, and indexes. This feature makes it easy to keep your database documentation up to date as you can add descriptions at the same time as you add or update tables and columns.

* The best documentation about the feature is contained in the original Pull Request [support comments in database](https://github.com/rails/rails/pull/22911)
* The feature was also well covered in [Rails 5 supports adding comments in migrations](https://blog.bigbinary.com/2016/06/21/rails-5-supports-adding-comments-migrations.html) by Prajakta Tambe


# Documentation Embedded with Change Process

Why would we want to use Rails to build our database documentation? 

> I believe documentation close to code and embedded in the code change process has a better chance of staying up to date and relevant.

I also think we want to add human context to our information in same tools we build our database. We want to do this in source code that is trackable for the same reason we run database migrations in Rails opposed to just having a DBA make schema changes outside of our application code change process.

When we embed our database documentation in our standard code change process we easily get many advantages.

* See <!--more--> DB comments change over time because they are part of Git
* Search in code editor tools (and github)
* Documentation can be reviewed as part of PRs by a data team, analysts, or other folks who might be the target documentation audience

By having the documentation embedded in the database directly, other values can be unlocked.

* The documentation is embedded in most DB explorer tools (SQL workbench, Postico, etc).
* Single source of truth documentation. It is easy to generate and push to documentation repositories (markdown, html, confluence). Either from Rails, CI, or any other tool in your workflow (see examples below). 

![Database Documentation in Postico](/assets/img/postico_coments.png)
> Postico OSX Postgres client showing comments as you explore DB structure
 
# Code Samples

Below are some code samples to help you get started with a workflow around database documentation.

### Migration

A migration adding comments to a previously existing table. You can add descriptions to call out deprecated fields, gotchas, planned refactorings, or add historical context that may be helpful to the next developer trying to understand what the field means.

```ruby
class AddContactComments < ActiveRecord::Migration[5.1]
  def change
    msg = 'Contacts table holds individual details about our contacts, it is associated with leads and customers'
    change_table_comment(:contacts, msg)

    change_column_comment(:contacts, :first_name, 'the contacts first name')
    change_column_comment(:contacts, :last_name, 'the contacts last name')
    change_column_comment(:contacts, :house_latitude, 'the house_latitude the contact lives at')
    change_column_comment(:contacts, :house_longitude, 'the house_longitude the contact lives at')
    change_column_comment(:contacts, :house_location_accuracy, 'the accuracy range we captured the GPS with')
    change_column_comment(:contacts, :deleted_at, "the date the contact was 'hidden' from our DB")
    
    # call out gotchas
    # tasks have assignee_id while contacts still use agent_id in the DB, this is a recommended refactoring
    msg = 'the agent_id field is for who the contact is currently assigned to, various places in the code and API it is referenced by assignee_id'
    change_column_comment(:leads, :agent_id, msg)
  end
end
```

### Ruby DB Docs Access

To generate documentation which could be pushed to a wiki, html, confluence, or elsewhere you can iterate through a tables columns and fetch the comments.

```ruby
> ActiveRecord::Base.connection.table_comment('leads')
=> "Leads table holds individual details about leads, related associations, event timestamps, and joins to contact"	
> Contact.columns_hash['literacy'].comment
=> reading level: {"-1"=>"none", "0"=>"no_read", "1"=>"limited_read", "2"=>"read_fluent", "none"=>"none", "no_read"=>"no_read", "limited_read"=>"limited_read", "read_fluent"=>"read_fluent"}

# iterate through all the columns on a table and output them to your documentation file or API
Contact.columns.each do |c|
  puts c.comment 
end
```

### SQL DB Docs Access

Obviously you don't need Rails to get at this information, you can pull it out with raw SQL as well. Covered in this post: [Querying table, view, column and function descriptions](http://www.postgresonline.com/journal/archives/215-Querying-table,-view,-column-and-function-descriptions.html)

```sql
# get the all the table comments in your DB
SELECT c.relname As tname, CASE WHEN c.relkind = 'v' THEN 'view' ELSE 'table' END As type, 
    pg_get_userbyid(c.relowner) AS towner, t.spcname AS tspace, 
    n.nspname AS sname,  d.description
   FROM pg_class As c
   LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
   LEFT JOIN pg_tablespace t ON t.oid = c.reltablespace
   LEFT JOIN pg_description As d ON (d.objoid = c.oid AND d.objsubid = 0)
   WHERE c.relkind IN('r', 'v') AND d.description > ''
   ORDER BY n.nspname, c.relname ;

# get all the comments for the contacts table
SELECT a.attname As column_name,  d.description
   FROM pg_class As c
    INNER JOIN pg_attribute As a ON c.oid = a.attrelid
   LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
   LEFT JOIN pg_tablespace t ON t.oid = c.reltablespace
   LEFT JOIN pg_description As d ON (d.objoid = c.oid AND d.objsubid = a.attnum)
   WHERE  c.relkind IN('r', 'v') AND  n.nspname = 'public' AND c.relname = 'contacts'
   ORDER BY n.nspname, c.relname, a.attname ;
```
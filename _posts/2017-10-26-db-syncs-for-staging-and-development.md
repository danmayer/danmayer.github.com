---
layout: posttail
authors: ["Dan Mayer"]
title: "Databases Across Environments"
image: /assets/img/database-sync.jpg
category: Ruby
tags: [Ruby, Rails, Database, AWS, Postgres]
---
{% include JB/setup %}


{% unless page.image %}
![Random Links](/assets/img/database-sync.jpg)
{% endunless %}
> DB Syncs [CC image from Pixabay](https://pixabay.com/p-1954920/?no_redirect)

# Syncing Databases Across Environments

It seems that often when a business grows, at some point it is hard to create useful QA, development, and staging data to cover all the cases that can occur on production. Eventually, there is a need to try to replicate certain cases or debug various issues that is much easier when you can pull the production data to another system to experiment and debug safely. Nearly, everywhere I have worked eventually we need to clone large portions of the production DB to staging... Quickly followed by wanting to pull staging data to local development. While sometimes various privacy and security concerns must be taken into account, in general we are just talking about replicating a database or tables from one place to another. I will cover some approaches to moving DBs.

# DB Rotation on AWS

If you are in a cloud environment use the tools they provide when you can and avoid building a custom solution. We use AWS, and we run our Postgres DB via the RDS service. We have backup and retention rules and the ability to restore snapshots to different names. We leverage snapshots to move the DBs from one environment to another. If you are using Google cloud or Heroku there are similar options. I am not going to layout the code, but you can also do it easily via the AWS GUI. Our basic setup when in the cloud is detailed below.

* Production: has a nightly snapshot taken
* Staging:
  * about once every other month we restore the staging DB from a production snapshot
  * after the snapshot is restored some scripts run (clean up, sanitize, and truncate large un-needed tables) so it will run better on a smaller DB instance
  * Careful about various test data that is expected by managers and your QA team. You might have destroyed a lot of work
  * We handle that by QA regression suite will detect our QA team data is missing and recreate example QA data for the team
  * staging has nightly snapshots taken
* Dev Stacks: deployed development environments
  * these are created dynamically by developers from git branches
  * they restore a new DB from the latest staging snapshot
  * then run migrations and whatnot on the branch to get it to the correct state
  * we don't take any back ups of these stacks which are traditionally destroyed after a few days of use 

# Full DB to local Development

While the AWS toolchain is great you can't restore an AWS snapshot to your local Postgres DB. For that we just created a simple script that will dump Postgres and upload it to S3 in a compressed format. We have some options to exclude some extra large tables that we generally don't care about for development, you could always pull those later using the method for individual tables mentioned later.

### Full Postgres to S3 Dump Rake Task

```ruby
  def db_to_dump
    ActiveRecord::Base.connection_config[:database]
  end

  def db_host
    ActiveRecord::Base.connection_config[:host]
  end

  def db_port
    ActiveRecord::Base.connection_config[:port]
  end

  def db_user
    ActiveRecord::Base.connection_config[:username]
  end

  def db_pass
    ActiveRecord::Base.connection_config[:password]
  end

  ###
  # Run this on the target environment you wish to dump (staging dev stack)
  # bundle exec rake data:dump_full_db
  #
  # The DB files should get uploaded to S3 ready 
  # to be pulled into another environment
  ###
  desc 'dump full DB to S3'
  task dump_full_db: :environment do
    tables_to_exclude = %w[really_big_tables papertrail_versions]
    exclude_lines = tables_to_exclude.map { |table| "--exclude-table-data=#{table}" }.join(' ')
    full_db_file = '/tmp/full_dev_dump_data.sql'

    begin
      s3 = AWS::S3.new(access_key_id: env['S3_ACCESS_KEY_ID'],
                     secret_access_key: env['S3_SECRET_ACCESS_KEY'])
      bucket = s3.buckets['dev-db-bucket']
    
      # HACK this is needed so you don't pass the password
      File.open(pg_pass_file, 'w') { |f|
        f.write("#{db_host}:#{db_port}:#{db_to_dump}:#{db_user}:#{db_pass}")
      }
      `chmod 600 #{pg_pass_file}`
      
      `pg_dump #{exclude_lines} -O -v -x -F c -f #{full_db_file} -h #{db_host} -p #{db_port} -U #{db_user} #{db_to_dump}`

      [full_db_file].each do |file|
        if File.exists?(file)
          puts "uploading #{file}"
          path = Pathname.new(file)
          obj = bucket.objects[path.basename.to_s]
          obj.write(path)
        end
      end
    ensure
      `rm #{pg_pass_file} &> /dev/null`
    end
  end
  
  ###
  # Run this on the environment you wish to create or restore
  # the most recent dump.
  #
  # bundle exec rake reload_full_from_s3
  ###
  desc 'reload dev DB from S3'
  task reload_full_from_s3: :environment do
    unless ENV['SKIP_DOWNLOAD']
      s3, bucket = s3_and_bucket
      full_db_file = '/tmp/full_dev_dump_data.sql'

      [full_db_file].each do |file|
        puts "downloading #{file}"
        path = Pathname.new(file)
        obj = bucket.objects[path.basename.to_s]

        File.open(path.to_s, 'wb') do |s3_file|
          obj.read do |chunk|
            s3_file.write(chunk)
          end
        end
      end
    end

    db_to_dump = ActiveRecord::Base.connection_config[:database]
    ActiveRecord::Base.remove_connection

    puts `psql -c "drop database #{db_to_dump};"`
    if $? != 0
      puts 'drop DB failed (you likely need to close console or app)'
      exit 1
    end
    puts `psql -c "create database #{db_to_dump};"`
    puts `pg_restore  --verbose --dbname #{db_to_dump} -F c #{full_db_file}`
  end
```

# Single table to Staging or Development

OK that makes it easy for a new dev to get a copy of the latest full DB, what if you just want to pull the most recent payments, customers, or products... A much faster way it to load a table or two.

### Postgres Single table S3 Dump & Load Rake Task

```ruby
  ###
  # Run on target environment to dump a table
  # TABLE_NAME=phone_block_lists bundle exec rake db:dump_db_table
  ###
  desc 'dump single DB table to S3'
  task dump_db_table: :environment do
    table = ENV['TABLE_NAME'] || 'users'
    table_file = "/tmp/#{table}.sql"

    begin
      s3, bucket = s3_and_bucket
      write_pg_pass
      `pg_dump --no-owner --no-acl -v -F c -h #{db_host} -p #{db_port} -U #{db_user} --table public.#{table} #{db_to_dump} > #{table_file}`

      [table_file].each do |file|
        if File.exists?(file)
          puts "uploading #{file}"
          path = Pathname.new(file)
          obj = bucket.objects[path.basename.to_s]
          obj.write(path)
        end
      end
    ensure
      `rm #{pg_pass_file} &> /dev/null`
    end
  end
  
  ###
  # Run on environment where you want to load the table
  # TABLE_NAME=phone_block_lists bundle exec rake db:reload_table_from_s3
  ###
  desc 'reload dev DB table from S3'
  task reload_table_from_s3: :environment do
    table = ENV['TABLE_NAME'] || 'administrative_areas'
    table_file = "/tmp/#{table}.sql"
    db_to_dump = ActiveRecord::Base.connection_config[:database]

    unless ENV['SKIP_DOWNLOAD']
      s3, bucket = s3_and_bucket

      [table_file].each do |file|
        puts "downloading #{file}"
        path = Pathname.new(file)
        obj = bucket.objects[path.basename.to_s]

        File.open(path.to_s, 'wb') do |s3_file|
          # this is slow perhaps move to AWS CLI download
          obj.read do |chunk|
            s3_file.write(chunk)
          end
        end
      end
    end

    puts `psql --dbname #{db_to_dump} -c "truncate table #{table}"`
    puts `pg_restore  --verbose --data-only --dbname #{db_to_dump}  -F c #{table_file}`
  end
```

# Database Helper Scripts

These are small examples extracted out from our database helper rake task. We have a number of other little helpers as well. It can be useful to build up some small simple tools to help you team move data around environments. It can also really simplify the process of bring on new developers to the team. Hope the simple examples above will be helpful to some folks.
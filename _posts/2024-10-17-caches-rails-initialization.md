---
layout: posttail
title: "Ruby Caches - Rails Cache Initialization"
image: /assets/img/computer-cache.webp
category: Ruby
tags: Ruby, Rails, ActiveSupport, Cache, Memcached, Redis, Tips]
---
{% include JB/setup %}

# Rails Cache Initialization

A series of posts will explore and detail some of the current Rails caching code. A good place to start is how the Rails cache is configured and loaded.

This attempts to explain in a bit more details, but please do read the official [Rails Caching Guide](https://guides.rubyonrails.org/caching_with_rails.html#cache-stores) docs, which are also very good.

# The Rails Cache Configuration

Often, folks use different Rails cache configurations in different environments. It isn't uncommon for folks to have a NullCacheStore in a test or a memory-only cache-store. Then, in development, they have a Memcache or Redis cache with short-lived TTLs, and then a production cluster of cache servers. Let's see how Rails accomplishes letting folks load different caching configurations.

The Rails cache configuration code by default lives in `project/config/environments/<ENV>.rb`:

```
project
│   README.md
│   ...    
│
└───config
│   │   ...
│   │
│   └───environments
│       │   test.rb
│       │   development.rb
│       │   production.rb
```

A basic development configuration might look something like:

```ruby
  # Enable/disable caching. By default, caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join("tmp/caching-dev.txt").exist?
    config.action_controller.perform_caching = true
    config.action_controller.enable_fragment_cache_logging = true

    config.cache_store = :redis_cache_store, {
          connect_timeout: 3,  # Defaults to 1 second
          read_timeout: 0.4, # Defaults to 1 second
          write_timeout: 0.4, # Defaults to 1 second
          reconnect_attempts: 2,   # Defaults to 1
          expires_in: 1.day,

          error_handler: ->(method:, returning:, exception:) {
            Rails.logger.error "Redis error: #{exception}, method: #{method}, returning: #{returning}"
    }
    }

    config.public_file_server.headers = {
          "Cache-Control" => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end
```

## Cache Initialization

The configuration sets up all the basic options and tells the application the type of cache to build for a given environment. During Application startup, Rails will build the cache, so that you get your [active support cache store](https://api.rubyonrails.org/v7.1/classes/ActiveSupport/Cache/Store.html) when you call `Rails.cache`.

How does it build that cache store? 

* The [application bootstrap railtie, initialize_cache](https://github.com/rails/rails/blob/6e284f339bb123575a61852e25dff278a764d9b3/railties/lib/rails/application/bootstrap.rb#L82)
* This bootstrap will read the cache config, then feed it into [ActiveSupport::Cache.lookup_store](https://apidock.com/rails/v7.1.3.4/ActiveSupport/Cache/lookup_store/class)
* Which will load any Rails cache, including custom ones, so long as the symbol you pass can be required like so `require "active_support/cache/#{store}"`
    * the pattern should be a symbol of `:redis_cache_store` will look for `active_support/cache/redis_cache_store.rb`
    * it will then call new on your cache store, passing in all the additional options you provided in your config

## Make Your Own

Given all this, you should be able to create your own [custom Active Support Cache Store](https://www.mobomo.com/2012/03/writing-a-custom-rails-cache-store/). Or you can configure the standard stores and set up multiple caches beyond just `Rails.cache`. If you have different caching needs, you can make a new cache the same way Rails does.

```ruby
AnotherCache = ActiveSupport::Cache::RedisCacheStore.new(
  connect_timeout: 3, read_timeout: 0.4, write_timeout: 0.4, reconnect_attempts: 2,  expires_in: 1.day
)
```

## What happens when a Cache Store Initializes

It can depend on the implementation, but let's take a closer look at [MemCacheStore#new](https://github.com/rails/rails/blob/6e284f339bb123575a61852e25dff278a764d9b3/activesupport/lib/active_support/cache/mem_cache_store.rb#L77)

It will:  

* creates Dalli client(s)
  * either a pool with the option `pool: true` or with specific pool configuration options
  * or a single client
* It can handle a single cache host or a collection of hosts to be treated as a load-balanced cluster
* It initializes most of the objects in memory

It does not immediately create connections to Memcached; something in the code will need to call a cache method that requires an active connection, and it will lazily initialize the connection. Some folks do this purposefully to warm the connection, while others prefer a lazy connection. Either way, when you have a custom cache store, be aware of this and how it relates to forking web servers; if you lazily connect, that can happen after fork. If you eagerly connect, you likely need to ensure your cache store is fork-safe (memcache and redis are fork-safe).

After this initialization is complete, you are ready to call `Rails.cache.method` wherever you need it in your code.
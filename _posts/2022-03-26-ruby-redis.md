---
layout: posttail
authors: ["Dan Mayer"]
title: "Ruby & Redis"
image: /assets/img/redis-logo.png?cache=1
category: Ruby
tags: [Ruby, Redis, Notes, Tips]
---

{% include JB/setup %}

# Ruby & Redis

A collection of notes and some tips about using Redis.

# Redis Setup

Redis is super easy to setup, and in dev mode often just works right out of the box, but as you leverage and scale it inproduction, you might want to think more about it's setup beyond just setting a default `REDIS_URL` ENV var. Often a basic Redis for simple product is just setup like so...

```ruby
Redis.current = Redis.new(url: ENV['REDIS_URL'])
```

This has some issues:

* The usage of [`Redis.current` is deprecated](https://makandracards.com/makandra/510011-version-5-of-the-ruby-redis-gem-removes-redis-current)
* Above is using all default options like timeout
* A [shared redis is blocking across threads](https://github.com/redis/redis-rb/issues/826) and can be much slower for highly threaded server configurations, for example Puma.

A better setup adding in configurable options:

```ruby
Redis.new(
  url: ENV['REDIS_URL'],
  timeout: ENV.fetch("REDIS_TIMEOUT", 1),
  reconnect_attempts: ENV.fetch("REDIS_RECONNECT_ATTEMPTS", 3),
  reconnect_delay: ENV.fetch("REDIS_RECONNECT_DELAY", 0.5),
  reconnect_delay_max: ENV.fetch("REDIS_RECONNECT_DELAY_MAX", 5)
)
```

If you are wanting to configure a Redis and use it across threads, [using a Redis connection pool is recommended](https://tejasbubane.github.io/posts/2020-04-22-redis-connection-pool-in-rails/).


```ruby
pool_size = ENV.fetch("RAILS_MAX_THREADS", 10)
redis_pool = ConnectionPool.new(size: pool_size) do
  Redis.new(
    url: ENV['REDIS_URL'],
    timeout: ENV.fetch("REDIS_TIMEOUT", 1),
    reconnect_attempts: ENV.fetch("REDIS_RECONNECT_ATTEMPTS", 3),
    reconnect_delay: ENV.fetch("REDIS_RECONNECT_DELAY", 0.5),
    reconnect_delay_max: ENV.fetch("REDIS_RECONNECT_DELAY_MAX", 5)
  )
end
```

Although this means when using it you need to grab a pool connection first

```ruby
# original style, which is deprecated and would block across threads
Redis.current.get("some_key")

# utilizing a pool
redis_pool.with do |conn|
  conn.get("some_key")
end
```

thx [@ericactripp](https://twitter.com/ericactripp), for sharing the link about connection pools

# Redis in Common Libraries

All the above helps when you are working with Redis directly, but often we are configuring common libraries with Redis, how many of them are able to leverage the same kinds of benifits like a connection pool?

* __sidekiq:__ If you use sidekiq it already has a [connection pool under the hood](https://github.com/mperham/sidekiq/blob/cf7b067c89ae3b1303e35d29408099cf40991f6d/lib/sidekiq/redis_connection.rb#L34).
* __resque:__ Currently, resque doesn't support a connection pool... It does have away to avoid re-connecting for each worker by using [`inherit_socket: true`](https://github.com/redis/redis-rb#expert-mode-options) as described as [one option to avoid needing a connection pool](https://github.com/resque/resque/issues/1254).
* __flipper:__ The current [flipper redis](https://github.com/jnunemaker/flipper/blob/master/lib/flipper/adapters/redis.rb#L184), is a single Redis connection, but creating a redis adapter that used a pool, looks like it would be pretty easy.
* __Rails.cache:__ Rails redis cache you are likely using a single Redis instance, a shared redis connection, [support for connection pools was added](https://api.rubyonrails.org/classes/ActiveSupport/Cache/ConnectionPoolLike.html), but folks [need to opt into it](https://github.com/rails/rails/issues/39479) with some additional options, see the example configuration below.

```ruby
# common config that won't leverage a redis connection pool
config.cache_store = :redis_cache_store, {
  url: ENV["REDIS_URL"],
}

# by setting the pool side and timeout, you can leverage a connection pool with your Redis
config.cache_store = :redis_cache_store, {
  url: ENV["REDIS_URL"],
  pool_size: 8,
  pool_timeout: 6
}
```

# Investigate Combining Redis Calls

If you have an app that is making many sequential Redis calls, there is a good chance you could make a significant improvement by leveraging [Redis pipelining](https://redis.io/docs/manual/pipelining/) or Mget. I think that that the Flipper codebase is a great way to learn and see various Ruby techniques. It is high quality and has a wide adoption so you can trust it has been put through the paces. If you want to dig into combinging calls, [read about the differences between pipeline and mget in terms of code and latency.](https://medium.com/@jychen7/redis-get-pipeline-vs-mget-6e41aeaecef)

* [Flipper PR adding in pipelining](https://github.com/jnunemaker/flipper/commit/033bb20e288436d357f81002de7b2aa1d5bd7c18)
* [Flipper usage of Mget](https://github.com/jnunemaker/flipper/blob/master/lib/flipper/adapters/redis_cache.rb#L147)
* [Leverage read_multi & write_multi though the Rails Cache Redis Adapter](https://api.rubyonrails.org/classes/ActiveSupport/Cache/RedisCacheStore.html#method-i-read_multi)

# Exciting Things Are Happening with Ruby Redis

A move to simplify the [redis-rb codebase and drop a mutex looks like it will roll out redis-client](https://github.com/redis/redis-rb/issues/1070#issuecomment-1074094773), which can significantly speed up some use cases. It looks like sidekiq for example with move to this in the near future.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">New prototype Redis driver cuts Sidekiq job processing time from 61 sec to 39 sec. Incredible improvement! <a href="https://t.co/ZzIw7koMiq">https://t.co/ZzIw7koMiq</a></p>&mdash; Mike Perham 🇺🇦 (@getajobmike) <a href="https://twitter.com/getajobmike/status/1506709040952356865?ref_src=twsrc%5Etfw">March 23, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


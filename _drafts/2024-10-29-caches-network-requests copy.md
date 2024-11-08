---
layout: posttail
title: "Ruby Caches - Rails Cache Workflows"
image: /assets/img/cloud-data.webp
category: Ruby
tags: Ruby, Rails, ActiveSupport, Cache, Memcached, Redis, Tips]
---
{% include JB/setup %}

A series of posts will explore and detail some of the current Rails caching code. A good place to start is how the Rails cache is configured and loaded.

These posts attempts to explain in a bit more details, but please do read the official [Rails Caching Guide](https://guides.rubyonrails.org/caching_with_rails.html#cache-stores) docs, which are also very good.

Rails Cache Posts:

1. [Rails Cache Initialization](/ruby/2024/10/17/caches-rails-initialization)
2. [Rails Cache Comparisons](/ruby/2024/10/20/caches-rails-comparisons)
3. Rails Cache Workflows
4. Network Requests

# Rails Cache Network Requests

Most of the larger Rails applications end up using a cache server that is accessed over the network. This is because many of the simpler caches like filestore and memory do not work for a horizontally scaling Rails deployment. While you can setup a localhost Redis or Memcached server, that is generally just for development or small scale applications. Let's look at what happens with a typical Rails cache configured with a memcached server.

__DIAGRAM__

Not looking at serialization or compression let's take a look at what is going on to get data over the network.

## Rails Cache Network Calls

In the previous post, [Rails cache workflows](/ruby/2024/10/24/caches-rails-workflows), we covered how a `Rails.cache.get` call will use the Dalli Ruby client to request the data from a memcached server. What does that look like?

We can skip the Rails part of things and use Dalli directly to better understand. As the Rails.cache when configured with memcache just helps initialize, and provide helpers for working with Dalli.

```ruby
dalli_key = "dalli_key"
dalli = Dalli::Client.new('localhost:11211')
dalli.set(dalli_key, "my cached value")
result = dalli.get(dalli_key)
puts result
=> "my cached value
```

Simple enough, but as with anything over the network, what happens if the network goes down?

`No server available (Dalli::RingError)`

That isn't good we can't have trying to use a cache raise exceptions on misses. Well Rails, actually doesn't, while it uses Dalli under the hood it has a nicer API to use that helps avoid things like that.

```ruby
Rails.cache.get("some_non_existing_key")
=> nil
```

A miss for a key not found in the cache and a miss because the cache was down will be both return `nil`. So the `Rails.cache` API makes it a little simpler to work with network errors. It is still worth considering how your code handles these errors, you often don't want a nil, but instead want to get the data from a different source.

## Testing Network Errors with Toxiproxy

OK, we don't want errors how do we test what our code will do, and how to handle it properly.

## Simulating Slow Network Requests

## Benchmarks with Network Requests

you might be tempted to use toxiproxy which is useful to try to benchmark while simulating various network failures, flakiness, or longer latency network situations. I wanted to warn folks against this, as I have run into this gotcha a couple times. If you are benchmarking or profiling, Toxiproxy adds a small but significant overhead to be able to simulate various network conditions. This is enough in benchmarks to often obscure the differences you are trying to narrow in on. Toxiproxy also ends up adding additional variance and noise into the benchmarks. Making it hard to find and fix very large and significant changes that can impact the performance of your application, outside of the network latency that might be out of your control.




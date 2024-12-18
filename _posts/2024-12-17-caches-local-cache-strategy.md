---
layout: posttail
title: "Ruby Caches - Rails Local Cache Strategy"
image: /assets/img/cache_local_strategy.webp
category: Ruby
tags: Ruby, Rails, ActiveSupport, Cache, Memcached, Redis, Tips]
---
{% include JB/setup %}

A series of posts will explore and detail some of the current Rails caching code. This post takes a deeper look at the network requests involved in caching.

These posts attempt to explain in more detail, but please do read the official [Rails Caching Guide](https://guides.rubyonrails.org/caching_with_rails.html#cache-stores) docs, which are also very good.

Rails Cache Posts:

1. [Rails Cache Initialization](/ruby/2024/10/17/caches-rails-initialization)
2. [Rails Cache Comparisons](/ruby/2024/10/20/caches-rails-comparisons)
3. [Rails Cache Workflows](/ruby/2024/10/24/caches-rails-workflows)
4. [Rails Cache Network Requests](/ruby/2024/11/07/caches-network-requests)
5. Rails Cache Local Cache Strategy

# Rails Cache Local Cache Strategy

A semi hidden feature of Rails is the ability to use a local cache strategy along with rails cache. You might already be using it in your app without realizing it.

Let's take a look at how it works. When you want to use it and when you might want to avoid it.

## What is Active Support Local Cache Strategy?

There are some abstractions to support cache strategies in Rails, but sadly the only one actually in Rails is the `ActiveSupport::Cache::LocalCacheStore`. Although, I am aware of code that leverages cache strategies in private code repositories to many various layered cache strategies.

> Local Cache Strategy
>      
> Caches that implement LocalCache will be backed by an in-memory cache for the
> duration of a block. Repeated calls to the cache for the same key will hit the
> in-memory cache for faster access.
--[Local Cache Strategy](https://github.com/rails/rails/blob/main/activesupport/lib/active_support/cache/strategy/local_cache.rb)

Basically, this is fancy memoization that tries to avoid making repeated network calls to a remote cache store. It is a bit fancier because it tries to handle some of the complexities for you. For example, in a Rails web app, it has Rack middleware to clear the memoized cache when the request is finished. Also, it is implemented in a way that is thread safe.

It isn't used in all of the Rails cache stores as it doesn't make sense for the local `MemoryStore` to use it as they are both in memory stores. It was also removed from [Rails FileStore](https://github.com/rails/rails/pull/42626) when it had to use serialization to avoid mutation related bugs, which we will describe more a bit later.

## How Strategy::LocalCache works

You will see it used in both the Redis and Memcached cache stores. It is included in those classes like so:

`prepend Strategy::LocalCache`

This will mean that every time you write to the cache, it will also write to the memory local cache. And every time you read from the cache, it will first check the local cache.  It will try to serialize the value to the local cache and deserialize it when you read from the local cache, this avoids an issue where you can modify a value and possibly not get what you expected from the cache, due to runtime modifications of the original object stored in the cache.

It clears the local cache when the request is finished, this is done by the Rack middleware. which is included like so:

```ruby
module Strategy
  autoload :LocalCache, "active_support/cache/strategy/local_cache"
end
```

While the idea is simple, the local cache has evolved over time to handle some of the complexities around mutation, memory usage, and serialization.

__TODO: update my mermaid diagram to include flow with local cache strategy__

## Local Cache History

Originally, it was just a hash of the in memory objects being used in the cache. This was simple, but it had issues with mutations. First there was an [issue with mutation on the value read from the cache](https://github.com/rails/rails/pull/36656).

```ruby
data = cache.read('key') # => "foobar"
data << "bar"
cache.read('key') # => "foobarbar"
```

After that was fixed, there was a similar [issue with modifiying the value written to the cache](https://github.com/rails/rails/pull/37587) as seen in this example.

```ruby
my_string = "foo"
cache.write('key', my_string)
my_string << "bar"
cache.read('key') # => "foobar"
```

The various fixes were introduced using `dup_value!` which was a deep dup of the value. These fixes did solved the mutation issue, but it had a larger performance hit, as it was effectively calling Marshal on every cache write and read `@value = Marshal.load(Marshal.dump(@value))`

The performance problems ended up being reported as a Rails issue, [large performance regression](https://github.com/rails/rails/issues/42611) of the local cache strategy. It had a decent reproducible benchmark, and investigation resulted in a number of changes for the local store and a good explanation of the challenges. the

A few fixes such as [avoiding as much of the performance hit and avoiding use of Marshal](https://github.com/rails/rails/pull/42014) as possible were put into Rails. The cache moved away from the duplicate serialization and added some hot path optimizations for dupable entries, but still requires some serialization overhead to protect against mutation. The improvements helped significantly especially for simpler cache objects, but for large serialized object the overhead was still significantly worse, like 300X slower


> the local cache will only save the network round trip (and internal Redis/memcached latency).

After the bug fixes and performance fixes were in, the [local cache no longer made sense for the file store](https://github.com/rails/rails/pull/42626) as it wasn't just a memoized value in a hash, but required serialization to avoid mutation bugs.

In the discussion it was pointed out that there are some reasons to side step the local cache strategy and just use request local memoization. Especially for larger cache objects where the serialization overhead is more significant.

## When to not use local cache?

If you are going to read the value multiple times in the same request, you can wrap the value from the cache and memoize it in a local variable. This can be done around either the `fetch` or `read` method. This is often valuable if many different parts of the codebase are trying to get from the cache through different call paths.

Depending on your needs you can have a simple memoized method that is an accessor or a memoized hash accepting cache keys to handle related caches. Something like below if your class has the correct lifecycle. If you need kepe the cache tied to the request lifecycle, you can use `ActiveSupport::CurrentAttributes` to keep the memoized value in the request local scope.

```ruby
class SomeCacheableClass
    def memoized_cache_fetch(key)
        @memoized_hash[key] ||= Rails.cache.fetch(key) { yield }
    end
end
```

If you are using memoization you are back to extremely fast performance because it skips the serialization penalty and hash lookups are very fast, but you need to be careful to not modify the value you are memoizing, or at least be aware that it can be mutated. As you can see, returning a memoized value will be orders of magnitude faster than anything that requires serialization or network calls.

```
Comparison:
cache memcached 1x memoized_cache_fetch: 11633145.8 i/s
cache memcached 1x fetch:     4209.4 i/s - 2763.63x  slower
cache memcached 1x fetch bypass local store:     2023.2 i/s - 5749.82x  slower
```

So if you see significant slowdown when repeatly getting the same data out of the cache don't be afraid to memoize it, if you look at profiling data or a flame graph you will see duplicate deserialization is slowing you down and can be avoided.

## Other Rails Cache Strategies?

Since the current local cache strategy is the only one in Rails, maybe we could show how to build a not mutation safe but faster hash lookup strategy. Basically re-introducing the original hash strategy. Sometimes the trade offs are worth it, when it is clear what the pain and cost would be. We can look at how to build that in a future post.
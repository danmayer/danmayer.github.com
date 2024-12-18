---
layout: posttail
title: "Ruby Caches - Rails Cache Workflows"
image: /assets/img/cloud-data.webp
category: Ruby
tags: Ruby, Rails, ActiveSupport, Cache, Memcached, Redis, Tips]
---
{% include JB/setup %}

A series of posts will explore and detail some of the current Rails caching code. This post explores the steps and type of work involved in caching.

These posts attempts to explain in a bit more details, but please do read the official [Rails Caching Guide](https://guides.rubyonrails.org/caching_with_rails.html#cache-stores) docs, which are also very good.

Rails Cache Posts:

1. [Rails Cache Initialization](/ruby/2024/10/17/caches-rails-initialization)
2. [Rails Cache Comparisons](/ruby/2024/10/20/caches-rails-comparisons)
3. Rails Cache Workflows

# Rails Cache Workflows

What happens as part of caching... Like most software, it isn't magic. This post will break things down a bit so we can talk about and dig in deeper on some of the specifics. I mostly work with and cache about low-level usage of `Rails.cache` while much of the [Rails Caching Guide](https://guides.rubyonrails.org/caching_with_rails.html#low-level-caching) focuses on view layer caching. My experience has always required more complex caching at the data layer, not just a lazily deferred view layer. Rails view layer caching is built on these same primitives, so when we talk about low-level caching, we mean the Active Support Cache API for interacting with the cache directly. While it supports many things, we are going to dig in on the most commonly used features:

* __`Rails.cache.read`:__ this method gets data from the cache
* __`Rails.cache.write`:__ this method puts data in the cache
* __`Rails.cache.fetch`:__ this method either get from the cache or from the backing data store and then sets it in the cache for the next time

Let's look at what is happening with these methods so we can see how they help abstract away and handle many shared operations. We will see common patterns like:

* serialization (and deserialization)
* compression (and decompression)
* cache store API specifics

## Rails.cache.read

When calling `Rails.cache.read,` the application code is trying to find some piece of data in the cache.

```ruby
result = Rails.cache.read(key)
```

What does this do? It depends, but let's assume we have the Rails MemCache Store configured as our cache store and a valid Memcached server, which does contain the data stored for the cache `key.`

* [ActiveSupport::Cache::Store.read](https://github.com/rails/rails/blob/7750d64a65e5b2641d87ef45e6e65ace193d9a27/activesupport/lib/active_support/cache.rb#L498)
  * normalize the key
  * normalize cache key versions (supports recycling keys)
  * instruments the cache call (for tracing, logging, testing, stats)
  * set `entry` equal to the response from the configured [ActiveSupport::Cache::MemCacheStore.read_entry](https://github.com/rails/rails/blob/7750d64a65e5b2641d87ef45e6e65ace193d9a27/activesupport/lib/active_support/cache.rb#L498) call
    * this method does two things `deserialize_entry(read_serialized_entry(key, **options), **options)`
        * `read_serialized_entry`: this will use the Cache store-specific way to get the serialized data out of the cache
            * for the MemCacheStore this means it will use the [Dalli Memcached Client gem](https://github.com/petergoldstein/dalli) to request the data over a socket
        * `deserialize_entry`: is back in the base class and uses the coder to get the cache entry and metadata
            * `@coder.load(payload)`: this will first have the coder decompress the raw cache data if needed, then it will deserialize it
    * checks meta data on the entry to handle things like cleaning up and not returning expired entries
    * returns the cache `entry.value` back to the caller of `cache.read`

All the above can occur in __less than 1ms__ for a remote network cache call when on a fast cloud regional deployment. It is a lot to take in, let's [diagram it](https://mermaid.live/edit#pako:eNp9Us1ugzAMfpUo1wEPkAMTguukae0RqfKCaREJYfmZxKq--wx0G2OwXOI434-d-MqlqZAL7vAtYCexaOBsQZcdo5X1PYvT9OEFGuUSCfKCiUWoBGtxEEwPJ9pn6Boy0p5Q52Pi4I2dsyfsvB026HvQUaYApZrkjP435Tt9t5q8qbRj_syckS16RpfsdfDoWG3s2m_Grwwm9Lb-TisLxn9N5PTMNlFmfLwKpdG9Reciih3aBlTzgUupH3gcp_G--9TEfNjqcbscqif--6UUydY9LiWTd1ABdz54VKEBEazIjhmPuEaroalolq4jo-T-ghpLLiissIagfMnL7kZQCN4chk5y4W3AiFsTzhcualCOTqGvwH8N4j17-wSb-unY).

[![Rails.cache.read](/assets/img/cache_read.webp)](/assets/img/cache_read.webp)

## Rails.cache.write

When calling `Rails.cache.write` the application code is trying to store some piece of data in the cache.

```ruby
book = Book.first # some active record book object
Rails.cache.write(key, book, ttl: 3600)
```

What does this do? It depends, but let's assume we have the Rails MemCache Store configured as our cache store and a valid Memcached server.

* [ActiveSupport::Cache::Store.write](https://github.com/rails/rails/blob/7750d64a65e5b2641d87ef45e6e65ace193d9a27/activesupport/lib/active_support/cache.rb#L660)
    * normalize the key
    * normalize cache key versions (supports recycling keys)
    * instruments the cache call (for tracing, logging, testing, stats)
    * builds the CacheEntry object (meta data and value wrapper)
    * calls [ActiveSupport::Cache::MemCacheStore.write_entry](https://github.com/rails/rails/blob/7750d64a65e5b2641d87ef45e6e65ace193d9a27/activesupport/lib/active_support/cache/mem_cache_store.rb#L193) to set the value
        * this method does two things ` write_serialized_entry(key, serialize_entry(entry, **options), **options)`
        * `serialize_entry`: is back in the base class and uses the coder to serialize the data
            * `@coder.dump_compressed(payload)`: (or just dump if no compression needed) This will have coder serialize and then compress the data
        * `write_serialized_entry`: this will use the Cache store-specific way to set the serialized data to the cache
            * for the MemCacheStore this means it will use the [Dalli Memcached Client gem](https://github.com/petergoldstein/dalli) to send the data over a socket
    * returns true if set successfully

All the above can occur in __less than 1ms__ for a remote network cache call when on a fast cloud regional deployment. It is a lot to take in, let's [diagram it](https://mermaid.live/edit#pako:eNqNkk1uwyAQha-C2NbxAVhEqpxdVbVqurQUTWEco_DjwqDKjXL3Qu0mUuOoZQMM73szMBy59Aq54BHfEzqJGw37ALZ1LI_7YWCr9fruBbSJtQTZY_0RNKFgBxwFs-MuzxVTQDARV8qCP6JtSmRLPszhHToKiw43xcWpycWGWiU7CBYxaDD6Exk4xaS3Q8AY_-u0AWN0HZEuNbyNhHFCz6dz-d8XUoK9Ns8senlAyulpIljnw-xxzjvpf-V5elg2v_U2FBL-dZNssVrozgW9bkhBcmMnEa-4xWBBq_wHjgVpOfVoseUiLxV2kAy1vHWnLIVEfjs6yUVhKx582vdcdGBi3qUhv_3PB5qjpy8eWNGO).

[![Rails.cache.write](/assets/img/cache_write.webp)](/assets/img/cache_write.webp)

# Rails.cache.fetch

A very common pattern with caching is to try to get a piece of data from the cache, and if you can't find it, get the data from another data store and save it to the cache so you will get it next time. Rails has the `Rails.cache.fetch` helper to simplify this.

```ruby
Rails.cache.fetch(key, ttl: 3600) {
  Book.first # some active record book object
}
```
It is easiest to think of fetch in terms of both the previous read and write. While it duplicates some of the underlying code, it does not always directly differ from those methods. Let's break this down for the Memcache store in the case where there is a miss on the cache read.

* [Rails.cache.fetch](https://github.com/rails/rails/blob/7750d64a65e5b2641d87ef45e6e65ace193d9a27/activesupport/lib/active_support/cache.rb#L444)
    * `entry = read_entry`: this does most of the same as read, and we will in this case, assume it was a miss and return nil
    * `save_block_result_to_cache(name, key, options, &block)`
    * call the block, which in this case is `Book.first`
    * then it is like cache.write with that value

While I very briefly covered fetch, it can do many other interesting things that help with the complexity and edge cases when using a cache, such as race conditions, nil handling, forcing updates, etc.

The most common cache call in most of the Rails apps I work in is `Rails.cache.fetch` it is extremely powerful for very basic caching.

# Notes on Using Rails Cache

The purpose of this post was to get a bit deeper into the foundational concepts and steps related to caching with the active support cache store API. So, we can further explore some of the important concepts like serialization, compression, and specific cache store implementations. It is important to realize that for each different store type, Rails relies on a client; in this case, we talked about Dalli being the Memcached client, but if you use the Redis store, Rails will end up using the Redis gem. While Rails will default to using compression and serialization built into Ruby, other options (often better options) also rely on the gem ecosystem outside of Rails. 

* In my example, I cached an active record object. The Rails caching guide rightly warns against this, as we get into serialization and versioning, we can cover solutions to problems with caching Active Record objects
* These examples should also make it clear that much is happening behind the scenes for such a simple API (can't get much easier than `read('key")`), it is important to understand the different pieces when wanting to optimize performance further when working on caching
    * for complex data structures, serialization can take longer than network calls
    * for certain size data and data formats, avoiding compression can make sense
    * knowing how caching breaks down into these steps can help when benchmarking and profiling caching approaches that work best for your data

We will dig in a bit more in a future post.
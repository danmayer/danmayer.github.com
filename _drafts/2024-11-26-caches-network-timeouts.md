---
layout: posttail
title: "Ruby Caches - Rails Cache Network Timeouts"
image: /assets/img/data_cache_cloud.webp
category: Ruby
tags: Ruby, Rails, ActiveSupport, Cache, Memcached, Redis, Tips]
---
{% include JB/setup %}

A series of posts will explore and detail some of the current Rails caching code. A deeper look at timeouts and how they relate to caching.

These posts attempt to explain in more detail, but please do read the official [Rails Caching Guide](https://guides.rubyonrails.org/caching_with_rails.html#cache-stores) docs, which are also very good.

Rails Cache Posts:

1. [Rails Cache Initialization](/ruby/2024/10/17/caches-rails-initialization)
2. [Rails Cache Comparisons](/ruby/2024/10/20/caches-rails-comparisons)
3. [Rails Cache Workflows](/ruby/2024/10/24/caches-rails-workflows)
4. [Rails Cache Network Requests](/ruby/2024/11/07/caches-network-requests)

# Rails Cache Network Timeouts

In the last post we covered the network calls related to cache reads, we talked about how Rails handles errors as cache misses, how the Dalli memcache gem uses sockets under the hood to make network calls, we even looked a bit at raw socket calls. We showed how we can use toxi-proxy to better test and understand connection errors.

[![Rails.cache.read](/assets/img/cache_read.webp)](/assets/img/cache_read.webp)

Let's take a closer look at timeouts and how those are handled.

## Rails Memcached Timeout Configuration

When configuring memcached as the Rails Cache the default timeout is 1s, which is often fairly long for cache operations.

You can adjust this to something more reasonable like `0.2` when configuring your cache store in your `development.rb` or production configs.

```ruby
config.cache_store = :mem_cache_store, {
  socket_timeout: 0.2,   # Defaults to 1
  expires_in: 1.hour,
  error_handler: ->(method:, returning:, exception:) {
    Rails.logger.error "Memcached error: #{exception}, method: #{method}, returning: #{returning}"
  }
}
```

This will pass down the `socket_timeout` settings to the `dalli` gem that Rails uses under the hood when `Rails.cache` is setup for memcached.

So this would be similar to to making a new dalli client like so:

```ruby
Dalli::Client.new("localhost:11211", socket_timeout: 0.2)
```

---

## Caches and Network Failures

Simple enough, but as with anything over the network, what happens if the network goes down?

```ruby
dalli.get("dalli_key")
=> No server available (Dalli::RingError)
```

That isn't good; we can't have trying to use a cache raise exceptions on misses. Well, Rails actually doesn't. While it uses Dalli under the hood, it has a nicer API that helps avoid things like that.

```ruby
Rails.cache.read("some_non_existing_key")
=> nil
```

A miss for a key not found in the cache and a miss because the cache was down will both return `nil`. So, the `Rails.cache` API makes it a little simpler to work with network errors. It is still worth considering how your code handles these errors. You often don't want a nil but instead want to get the data from a different source.

## Testing Network Errors with Toxiproxy

OK, we don't want errors. How do we test what our code will do and how to handle it properly? There are several ways to test network error conditions, but one I like to use is [toxiproxy](https://github.com/Shopify/toxiproxy). It can simulate network and system conditions for chaos and resiliency testing, making it easy to test things like the endpoint has gone down.

You can read the [toxiproxy ruby docs](https://github.com/Shopify/toxiproxy-ruby) for instructions on how to get started, but the example code below should provide the basics.

```ruby
# add to Gemfile
gem "toxiproxy"
```

Also, update your `test_helper.rb`

```ruby
Toxiproxy.populate([{
  name: "memcached",
  listen: "localhost:11222",
  upstream: "localhost:11211",
}])
```

Then you can add toxiproxy code to any of your tests, in this case, to target what happens when memcached isn't available.

```ruby
# in book.rb
def save_to_cache
  Rails.cache.write(Book.key_for_id(id), self, ttl: 600)
end

def self.get_from_cache(id)
  Rails.cache.read(key_for_id(id))
end

def self.key_for_id(id)
  "Model.book.#{id}"
end

# in book_test.rb
test "uses cache get" do
  @book.save!
  @book.save_to_cache
  assert_equal(@book, Book.get_from_cache(@book.id))
  # Note: toxi proxy is not parallel test safe
  Toxiproxy[/memcached/].down do
    assert_equal(nil, Book.get_from_cache(@book.id))
  end
end
```

The test above makes it easy to see that the Rails cache won't raise and will just return `nil`

The example above also shows why you don't often see a `Rails.cache.read` in isolation. I often use `Rails.cache.fetch`. Let's add some code and write a test to see how that works.

```ruby
# in book.rb
def self.fetch_from_cache(id)
  Rails.cache.fetch(key_for_id(id)) { Book.find(id) }
end

# in book_test.rb
test "uses db on cache fetch failure" do
  @book.save!
  @book.save_to_cache
  assert_equal(@book, Book.get_from_cache(@book.id))
  # toxi proxy is not parallel test safe
  Toxiproxy[/memcached/].down do
    assert_equal(@book, Book.fetch_from_cache(@book.id))
  end
end
```

In this case, you can see that using `Rails.cache.fetch` will more cleanly handle any network issues to your cache server. It also makes it easy to implement read-through caching on any query.

## Cache Request Details

While I have some other details I want to get into with Toxiproxy, and how to optimize caching code. This post has gotten long enough, in this post we dug through all the layers and exposed some of the details, and also showed some tooling that can help test and verify network failure conditions. We can build on this further in the next time.

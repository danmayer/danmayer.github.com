---
layout: posttail
authors: ["Dan Mayer"]
title: "Ruby: Understanding create_or_find_by vs find_or_create_by"
image: /assets/img/find-or-create.jpg
category: Ruby
tags: [Ruby, Rails, Activerecord]
---

{% include JB/setup %}

{% unless page.image %}
![Bugs](/assets/img/find-or-create.jpg)
{% endunless %}

> photo credit [geralt: @pixabay](https://pixabay.com/photos/alzheimer-s-dementia-words-3068938/)

# Performance Benchmarks & Considerations between `create_or_find_by` & `find_or_create_by`

I was recently optimizing an endpoint and got to think through some interesting differences between two Active Record methods that help you either find an existing record or create a new one. At first glance, it seems either is fine with some notable differences around their race conditions.

## `find_or_create_by`

The [`find_or_create_by`](https://apidock.com/rails/v4.0.2/ActiveRecord/Relation/find_or_create_by) method has been around longer and is more familiar to many Rubyists. The race condition is called out in the linked docs, excerpt below.

> Please note _this method is not atomic_, it runs first a SELECT, and if there are no results an INSERT is attempted. If there are other threads or processes there is a race condition between both calls and it could be the case that you end up with two similar records.

This lead to Rails 6 adding the newer methods...

## `create_or_find_by`

The new [`create_or_find_by`](https://apidock.com/rails/v6.0.0/ActiveRecord/Relation/create_or_find_by) methods have a more rare race condition (on deleted ids), but can prevent a more common insert race condition on duplicates... It is well described in this post, [Rails 6 adds `create_or_find_by`](https://blog.bigbinary.com/2019/03/25/rails-6-adds-create_or_find_by.html), along with some downsides. For example without a unique DB constraint it will create duplicates (ex: `add_index :posts, :title, unique: true`). These issues are also called out in the docs <!--more--> linked above, excerpt below.

- The underlying table must have the relevant columns defined with unique constraints.

- While we avoid the race condition between SELECT -> INSERT from `#find_or_create_by`, we actually have another race condition between INSERT -> SELECT, which can be triggered if a DELETE between those two statements is run by another client. But for most applications, that’s a significantly less likely condition to hit.

- It relies on exception handling to handle control flow, which may be marginally slower.

- The primary key may auto-increment on each create, even if it fails. This can accelerate the problem of running out of integers, if the underlying table is still stuck on a primary key of type int (note: All Rails apps since 5.1+ have defaulted to bigint, which is not liable to this problem).

# Benchmarking the methods

While the docs are good at calling out the race conditions, they are not as clear about the performance implications... In fact, they could lead one to believe that `create_or_find_by` is always slower from this line, "may be marginally slower"... The reality is you need to know the usage characteristics of where you will be calling these methods to pick the one with the best performance characteristics.

Both of the methods will either find or create a record, and they try those in different orders... If you expect to most often find the record vs most often create a record that has a big impact on the performance. Let's see how much by breaking out my favorite Ruby benchmarking gem [benchmark-ips](https://github.com/evanphx/benchmark-ips), which gives a bit more readable reports than the standard `benchmark` lib. These are just quick micro-benchmarks, with all the issues that come with them, but the performance has also been validated by deploying to production systems at scale.

## Benchmarking All Finds

In this case, we are going to benchmark a case that simulates a code path that is all finds, and no creates... If you have an endpoint that creates once in a user's lifecycle and then forever is hitting the find, you likely will have a much higher find vs create ratio close to this benchmark.

```ruby
require 'benchmark/ips'
ActiveRecord::Base.logger = nil
Post.destroy_all

Benchmark.ips do |x|
  x.config(:time => 10, :warmup => 3)
  x.report 'create_or_find_by' do
    Post.create_or_find_by!(title: "create_or_find_by")
  end
  x.report 'find_or_create_by' do
    Post.find_or_create_by!(title: "find_or_create_by")
  end
  x.compare!
end
```

**results:**

As expected, when you would find an existing record all the time `find_or_create_by` is much faster, approximately 4X faster!

```
Warming up --------------------------------------
  create_or_find_by     49.000  i/100ms
  find_or_create_by    204.000  i/100ms
Calculating -------------------------------------
   create_or_find_by     450.791  (± 7.8%) i/s -      4.508k in  10.063664s
   find_or_create_by     2.078k (± 6.9%) i/s -     20.808k in  10.061016s

Comparison:
  find_or_create_by:     2078.1 i/s
  create_or_find_by:     450.8 i/s - 4.61x  (± 0.00) slower
```

## Benchmarking All Creates

In this case, we will benchmark where nearly all the calls are creating new records... This would simulate an endpoint that is generally creating brand new records and very rarely should find an existing record.

```ruby
require 'benchmark/ips'
ActiveRecord::Base.logger = nil
Post.destroy_all

Benchmark.ips do |x|
  x.config(:time => 10, :warmup => 3)
  x.report 'create_or_find_by' do
    Post.create_or_find_by!(title: "create_or_find_by #{rand}")
  end
  x.report 'find_or_create_by' do
    Post.find_or_create_by!(title: "find_or_create_by #{rand}")
  end
  x.compare!
end
```

**results:**

In a case where you are always creating it is faster to `create_or_find_by` but the overall difference is less dramatic.

```
Warming up --------------------------------------
  create_or_find_by     73.000  i/100ms
  find_or_create_by     44.000  i/100ms
Calculating -------------------------------------
  create_or_find_by     722.939  (± 8.3%) i/s -      7.227k in  10.069582s
  find_or_create_by     522.615  (± 9.6%) i/s -      5.192k in  10.028946s

Comparison:
  create_or_find_by:      722.9 i/s
  find_or_create_by:      522.6 i/s - 1.38x  (± 0.00) slower
```

# Conclusion

When you are working with `create_or_find_by` or `find_or_create_by` ensure you are considering how and which race conditions might affect your code. If it is easier to just have your app handle DB constraint errors and retry directly, most of the time using `find_or_create_by` is going to be simpler and more performant... If you reach for `create_or_find_by` ensure you understand the additional complexity and performance impacts depending on the expected hit and miss ratio for your use case.

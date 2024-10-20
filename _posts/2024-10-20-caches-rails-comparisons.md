---
layout: posttail
title: "Ruby Caches - Rails Cache Comparisons"
image: /assets/img/cache_comparison.webp
category: Ruby
tags: Ruby, Rails, ActiveSupport, Cache, Memcached, Redis, Tips]
---
{% include JB/setup %}

A series of posts will explore and detail some of the current Rails caching code. A good place to start is how the Rails cache is configured and loaded.

These posts attempts to explain in a bit more details, but please do read the official [Rails Caching Guide](https://guides.rubyonrails.org/caching_with_rails.html#cache-stores) docs, which are also very good.

Rails Cache Posts:

1. [Rails Cache Initialization](/ruby/2024/10/17/caches-rails-initialization)
2. Rails Cache Comparisons

# Rails Caching Comparisons

Rails offers many caching options, most of the difference will matter more  as you scale your system architecture. The performance difference of the various options for small scale systems and single box deployments is not that significant. For example, using the Rails in-memory cache works very well for single process applications, it however doesn't scale to the most common Rails deployments which is Puma with a few workers and threads. At that point you will often see much higher performance with a cache like Memcached or Redis, at that point to maintain extremely low latency you might choose an on box Memcached, which removes the network latency of a remote cache. That will work well until you need to horizontally scale your web workers (or background jobs). At that point you will likely consider remote cache solutions like Memcached, Redis, or the latest SolidCache.

## Rails Cache Stores

We can cover a quick overview of the various cache stores and their trade offs. Also, note you can make a custom store that builds off any of these or offers interesting options like layered caching combining both a machine local cache and a remote cache.


| Store | Serializes  | Compression | Local Store | Cross Proccess | Node Local | Remote | Cluster |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [memory store](https://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-memorystore) | ✓ | No | No | No | No | No | No |
| [file store](https://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-filestore) | ✓ | ✓  | No  | ✓ | ✓ | No | No |
| [memcached store](https://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-memcachestore) | ✓ | ✓ | ✓ | ✓  | ✓  | ✓  | ✓  |
| [redis store](https://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-rediscachestore) |✓ | ✓ | ✓ | ✓ | ✓  | ✓  | ✓  | ✓  |
| [solid cache store](https://github.com/rails/solid_cache) |✓ | ✓ | ✓ | ✓ | Kinda  | ✓ | ✓  | ✓  |


Another point that is harder to list in the table is what is memory limited vs disk space limited. The majority of the cache systems are memory limited, but the file store and solid cache (which is backed by a database) is disk space limited.

If there are other considerations or trade offs that should be added to the table let me know.

## Compression

The Rails cache for a long time has supported gzip compression, but recently added support passing in your own compression library. This makes it easier to use faster compression libraries like zstd, snappy, and l4z_flex. In general, so long as you are maintaining another dependency already, using a more modern compression library will yield better performance. Compression is even more valuable when you consider the network overhead of transmitting the cache value bytes over the network.

* the compression was done against an active record object including a large number of associations with some random string data
* the data was serialized using the default Marshal serializer
* then we just compressed the serialized bytes

```
original_value = Book.all.to_a
cache_value =  Marshal.dump(original_value)

rows << ["No Compression", cache_value.bytesize]
rows << ["BrotliCompressor", Compressors::BrotliCompressor.deflate_byte_size(cache_value)]
rows << ["SnappyCompressor", Compressors::SnappyCompressor.deflate_byte_size(cache_value)]
rows << ["ZstdCompressor", Compressors::ZstdCompressor.deflate_byte_size(cache_value)]
rows << ["L4zCompressor", Compressors::L4zCompressor.deflate_byte_size(cache_value)]
rows << ["LZ4FlexCompressor", Compressors::LZ4FlexCompressor.deflate_byte_size(cache_value)]

puts "benchmarking Rails #{@cache} cache compression..."
table = Terminal::Table.new :headings => ['Compressor', 'Bytesize'], :rows => rows
puts table
```

This shows the byte size of the cache value after compression using each of the various compression libraries.

```
+-------------------+----------+
| Compressor        | Bytesize |
+-------------------+----------+
| No Compression    | 1023931  |
| BrotliCompressor  | 577629   |
| SnappyCompressor  | 895496   |
| ZstdCompressor    | 587085   |
| L4zCompressor     | 879179   |
| LZ4FlexCompressor | 878160   |
+-------------------+----------+
```

Obviously, the final bytesize isn't the only consideration, you also have to consider the CPU overhead of compressing and decompressing the data. The tradeoff on final size also matters less if you aren't making cache calls over the network. So let's also benchmark the speed of the compressors, in this case we are just taking the serialized bytes and compressing them, and measuring the speed of the compression (we aren't decompressing them).

Below is the output of the benchmark, you can see that snappy is the fastest compression library, followed by lz4_flex (a rust based compression library).
```
Warming up --------------------------------------
                Gzip     3.000 i/100ms
              Brotli     3.000 i/100ms
                Zstd    26.000 i/100ms
              Snappy   316.000 i/100ms
                 LZ4   111.000 i/100ms
             LZ4Flex   196.000 i/100ms
Calculating -------------------------------------
                Gzip     35.028 (± 2.9%) i/s -    177.000 in   5.054752s
              Brotli     35.899 (± 2.8%) i/s -    180.000 in   5.015287s
                Zstd    278.536 (± 1.8%) i/s -      1.404k in   5.042192s
              Snappy      3.087k (± 2.9%) i/s -     15.484k in   5.020421s
                 LZ4      1.101k (± 2.5%) i/s -      5.550k in   5.042399s
             LZ4Flex      1.959k (± 3.5%) i/s -      9.800k in   5.008819s

Comparison:
              Snappy:     3086.8 i/s
             LZ4Flex:     1959.3 i/s - 1.58x  slower
                 LZ4:     1101.4 i/s - 2.80x  slower
                Zstd:      278.5 i/s - 11.08x  slower
              Brotli:       35.9 i/s - 85.98x  slower
                Gzip:       35.0 i/s - 88.12x  slower
```

I honestly recommend benchmarking this on the system you deploy on as I have seen some variability in performance between different systems.

## Serialization

While Marshal has been the default serializer for Rails for a long time, it is not the fastest serializer. The fastest serializer is MessagePack, which has been recently supported in Rails for serialization in a number of places, not just the cache.

I recommend using MessagePack for serialization, not only is it faster it avoids a lot fo the downsizes of Marshal and is far less verbose than JSON. There is not really any good reason to not use MessagePack for serialization.

```
benchmarking serializers (serialize + deserialize)...
ruby 3.3.4 (2024-07-09 revision be1089c8ec) [arm64-darwin23]
Warming up --------------------------------------
             Marshal     6.000 i/100ms
                JSON     6.000 i/100ms
            AS::JSON     6.000 i/100ms
         MessagePack     7.000 i/100ms
Calculating -------------------------------------
             Marshal     62.984 (± 4.8%) i/s -    318.000 in   5.067421s
                JSON     61.427 (± 3.3%) i/s -    312.000 in   5.082445s
            AS::JSON     61.546 (± 3.2%) i/s -    312.000 in   5.075183s
         MessagePack     78.024 (± 2.6%) i/s -    392.000 in   5.028982s

Comparison:
         MessagePack:       78.0 i/s
             Marshal:       63.0 i/s - 1.24x  slower
            AS::JSON:       61.5 i/s - 1.27x  slower
                JSON:       61.4 i/s - 1.27x  slower

Just serialization:
Warming up --------------------------------------
             Marshal    11.000 i/100ms
                JSON     7.000 i/100ms
            AS::JSON     7.000 i/100ms
         MessagePack    15.000 i/100ms
Calculating -------------------------------------
             Marshal    114.629 (± 3.5%) i/s -    583.000 in   5.090881s
                JSON     74.783 (± 2.7%) i/s -    378.000 in   5.058664s
            AS::JSON     76.329 (± 2.6%) i/s -    385.000 in   5.047530s
         MessagePack    155.636 (± 3.2%) i/s -    780.000 in   5.017039s

Comparison:
         MessagePack:      155.6 i/s
             Marshal:      114.6 i/s - 1.36x  slower
            AS::JSON:       76.3 i/s - 2.04x  slower
                JSON:       74.8 i/s - 2.08x  slower
```

There are a few objects that are harder to serialize with MsgPack, but generally it is easy to add a custom helper to support them, there are a few odd cases where you can technically find Message Pack is slower than Marshal, but I have not seen this in real world data.

Read more on moving to message pack:

* [Caching without Marshal, Part One](https://shopify.engineering/caching-without-marshal-part-one)
* [Caching without Marshal, Part Two](https://shopify.engineering/caching-without-marshal-part-two)
* [Moving to MessagePack](https://blog.saeloun.com/2023/11/15/rails-7-1-message-pack-as-message-serializer/)
* [MessagePack Serializer](https://github.com/rails/rails/tree/a1f6a13f691e0929d40b7e1b1e0d31aa69778128/activesupport/lib/active_support/message_pack)
* [Caching with MsgPack talk](https://rubykaigi.org/2022/presentations/shioyama.html)


## How to optimize and benchmark for network architecture and latency

I will make another post soon that gets more into how to optimize and benchmark for network architecture and latency. I originally tried some techniques that were not the best and wanted to share what worked and what didn't. If you are just adding caching to a small application, hopefully you can avoid needing to be highly optimized at this level. When starting to look at remote caching, it will be important to consider things like the latency between app servers and the cache server, for example if you have regionally distributed app servers you may want co-located caches in each region, vs a global cache across regions. As this topic opens up many more questions, we can devote a full post to the topic.

## Conclusion

We can combine all of the benchmarks to benchmark end to end with any given serializer, compression library, and cache store. The end to end benchmarks make it a bit harder to see the impact of the various changes and most of the time ends up disappearing into the call to the cache store, so the data normalizes the results.

I would recommend starting new applications (or new caching setups) with:

* __Serialization:__ Message Pack
* __Compression:__ one of the modern compression libraries (Snappy or LZ4Flex)
* __Cache Store:__ I would then recommend using the memcached store as it works well even on a local machine installation, and scales across load balanced clusters for extremely large deployments with very simple deployment hassle.

A note on why not Redis, it can be a great choice, but the api for redis is more complex than memcached. The large scale deployments can be a bit more complex. The real issue is that if you make a redis available for caching, you will likely find folks starting to use it for other things. For example trying to share it across background jobs, or using it for other parts of the system architecture. The configuration you want for a caching redis is different than for a background jobs redis, then folks make compromises like having high availability redis as it is needed for jobs, and then using it for caching, which is a far more expensive and not needed configuration for caching. Redis also supports Lua scripts and more complex data types, which can all be great solutions when properly discussed and considered, but you don't want to find them becoming hidden complexity that folks build on top of what was supposed to be a simple caching solution. Memcached avoids most of these problems by offering a very robust, but more restrictive API.
---
layout: post
title: "benchmarking JSON Parsers (OJ, SimdJson, FastJsonParser)"
image: /assets/img/compare.png
category: Ruby
tags: [Ruby, Rails, Performance, JSON, API]
---

{% include JB/setup %}

![Bugs](/assets/img/compare.png)

> photo credit [Tumisu lt: @pixabay](https://pixabay.com/illustrations/compare-comparison-scale-balance-643305/)

## UPDATE: Added FastJsonParser

After some feedback on [reddit (thx @f9ae8221b)](https://www.reddit.com/r/ruby/comments/jvv6fa/benchmarking_json_parsers_oj_vs_simdjson_2x/gco1khd/?utm_source=reddit&utm_medium=web2x&context=3), pointing out a JSON gem I wasn't aware of, I updated the benchmarks to also support `FastJSONparser` and cover symbolize_keys, which is important for my companies use cases (which a co-worker pointed out) and can cause significant performance issues if you have to do that independently of JSON parsing.

# Performance Benchmarks between OJ, SimdJSON, FastJsonparser, and StdLib

I was recently looking at the performance of some endpoints that process large amounts of JSON, and I wondered if we could do even better than we do in terms of performance for that processing. Across our company we have recently switch most of our apps from the Ruby StdLib JSON to [OJ](https://github.com/ohler55/oj), but I had read about [SimdJSON](https://github.com/saka1/simdjson_ruby) and was curious if we should look further into it as well. In this article I will tell you a bit about each of the Ruby JSON options and why you might want to consider them.

FastJsonparser

## OJ

[OJ](https://github.com/ohler55/oj) is a Ruby library for both parsing and generating JSON with a ton of options. I would basically say if you don't want to think too much but care about JSON performance just set up the OJ gem, and it should be the best option for most folks. It is well known, tested, and trusted in the community with a ton of support.

- A drop in replacement, set it forget it, it is faster and better
- Has built in Rails support, for some Rails JSON quirks
- Supports both generation and parsing

## SimdJSON

The [SimdJSON](https://github.com/saka1/simdjson_ruby) Ruby library doesn't have a lot of talks, documentation, or attention... but it is binding to [the fastest JSON parser out there](https://github.com/simdjson/simdjson)... It offers parsing speeds that nothing else can touch, and if you are trying to parse extremely large and dynamic JSON, it might just be the best option for you.

- Only supports parsing
- Doesn't support `symbolize_keys`
- The fastest option out there (uses simdjson C libs)
- Not a lot of community activity

## FastJsonparser

While `simdJSON` is a fast gem, it doesn't have much support and the way it handles rescuing errors could leak memory. While I didn't see such issues in my limited production rollout that is worth noting. The user [@f9ae8221b
](https://www.reddit.com/user/f9ae8221b/) pointed out the memory issue and that the gem `FastJsonparser` also wraps `simdjson` and has wider community support. I had never heard of the gem, and was already trying to [patch SimdJSON](https://github.com/saka1/simdjson_ruby/issues/22) to support `symbolize_keys`. Luckily `FastJsonparser` already supports that option. It still is faster than OJ, and requires a bit more work to intgrate, but looks like a better option than `SimdJSON` when you are looking for improved parsing speed. The user still mentions it could have some production issues, so I will have to report back as I roll it out to various systems.

- Only supports parsing
- Does support `symbolize_keys`
- The fastest option out there (uses simdjson C libs)
- Larger community support

## StdLib Ruby JSON

It is built in, seriously if you do much with JSON in a production system, just use OJ, unless you want to dig in deeper or find some specific reason it won't work for you. The Ruby library is fine and will work for any quick check, but if you have any reason to care about performance, OJ is a easy to use drop in replacement... A note of when you shouldn't use it? If you are authoring a gem, reduce your hard dependencies as much as possible, if you call `JSON.parse` and a hosting app is using `OJ`, your gem will use `OJ` and be faster... You shouldn't force users of your gem to require `OJ`.

# Benchmarking the methods

Let's see the difference with favorite Ruby benchmarking gem [benchmark-ips](https://github.com/evanphx/benchmark-ips), which gives a bit more readable reports than the standard `benchmark` lib. These are just quick micro-benchmarks, with all the issues that come with them, but the performance impact has been further validated by deploying to production systems with measurable impacts on the response time. The product use case included far larger JSON payloads and with much higher variability to the data, making me think the results would apply to most web service like systems.

## Benchmarking JSON Parsing (without symbolize_keys, added FastJsonparser)

We will load up the various libraries, and some weird fake HASH/JSON data. Then benchmark parsing it for a number of seconds...

```ruby
require 'benchmark/ips'
require 'json'
require 'oj'
require 'simdjson'
require 'fast_jsonparser'
require 'memory_profiler'
require 'rails'

json = {
  "one":1,
  "two":2,
  "three": "3",
  "nested": {
    "I": "go",
    "deep": "when",
    "i": "need",
    a: 2
  },
  "array":[
    true,
    false,
    "mixed",
    "types",
    2,
    4,
    6
  ]
}.as_json.to_json.freeze

puts "ensure these match"
puts  Oj.load(json, symbol_keys: false) == Simdjson.parse(json) &&
        Simdjson.parse(json) == JSON.parse(json, symbolize_names: false) &&
        FastJsonparser.parse(json, symbolize_keys: false) == Simdjson.parse(json)

Benchmark.ips do |x|
  x.config(:time => 15, :warmup => 3)

  x.report("oj parse") { Oj.load(json, symbol_keys: false) }
  x.report("simdjson parse") { Simdjson.parse(json) }
  x.report("FastJsonparser parse") { FastJsonparser.parse(json, symbolize_keys: false) }
  x.report("stdlib JSON parse") { JSON.parse(json, symbolize_names: false) }

  x.compare!
end

# Let's check memory as well...
report = MemoryProfiler.report do
  100.times { Simdjson.parse(json.dup) }
end
puts "simpdjson memory"
report.pretty_print

report = MemoryProfiler.report do
  100.times { Oj.load(json.dup) }
end

puts "OJ memory"
report.pretty_print
```

## Benchmark Results (without symbolize_keys)

This shows as claimed that SimdJSON and FastJsonparser outperform OJ even on pretty small and contrived JSON examples. The Performance gap holds up or sometimes looks more significant when looking at more realistic production payloads seen in some of the product systems I work with. Note if you need `symbolize_keys` or want a bit more community support I would go with `FastJsonparser`.

```
require 'benchmark/ips'
require 'json'
require 'oj'
require 'simdjson'
require 'fast_jsonparser'
require 'memory_profiler'
require 'rails'

json = {
  "one":1,
  "two":2,
  "three": "3",
  "nested": {
    "I": "go",
    "deep": "when",
    "i": "need",
    a: 2
  },
  "array":[
    true,
    false,
    "mixed",
    "types",
    2,
    4,
    6
  ]
}.as_json.to_json.freeze

puts "ensure these match"
puts  Oj.load(json, symbol_keys: true) == Simdjson.parse(json).deep_symbolize_keys! &&
        Simdjson.parse(json).deep_symbolize_keys! == JSON.parse(json, symbolize_names: true) &&
        FastJsonparser.parse(json) == Simdjson.parse(json).deep_symbolize_keys!


Benchmark.ips do |x|
  x.config(:time => 15, :warmup => 3)

  x.report("oj parse") { Oj.load(json, symbol_keys: true) }
  x.report("simdjson parse") { Simdjson.parse(json).deep_symbolize_keys! }
  x.report("FastJsonparser parse") { FastJsonparser.parse(json) }
  x.report("stdlib JSON parse") { JSON.parse(json, symbolize_names: true) }

  x.compare!
end
```

## Benchmarking JSON Parsing (with symbolize_keys)

```ruby
require 'benchmark/ips'
require 'json'
require 'oj'
require 'simdjson'
require 'fast_jsonparser'
require 'memory_profiler'
require 'rails'

json = {
  "one":1,
  "two":2,
  "three": "3",
  "nested": {
    "I": "go",
    "deep": "when",
    "i": "need",
    a: 2
  },
  "array":[
    true,
    false,
    "mixed",
    "types",
    2,
    4,
    6
  ]
}.as_json.to_json

puts "ensure these match"
puts  Oj.load(json.dup, symbol_keys: true) == Simdjson.parse(json.dup).deep_symbolize_keys! &&
        Simdjson.parse(json.dup).deep_symbolize_keys! == JSON.parse(json.dup, symbolize_names: true) &&
        FastJsonparser.parse(json.dup) == Simdjson.parse(json.dup).deep_symbolize_keys!


Benchmark.ips do |x|
  x.config(:time => 15, :warmup => 3)

  x.report("oj parse") { Oj.load(json.dup, symbol_keys: true) }
  x.report("simdjson parse") { Simdjson.parse(json.dup).deep_symbolize_keys! }
  x.report("FastJsonparser parse") { FastJsonparser.parse(json.dup) }
  x.report("stdlib JSON parse") { JSON.parse(json.dup, symbolize_names: true) }

  x.compare!
end
```

## Benchmark Results (with symbolize_keys)

This is the other main reason to use `FastJsonparser` depending on the integrations in your apps you might rely on symbolized_keys... We had added that at a very low level in our shared ApiClient, and the performance implications of having to symbolize_keys as a second pass make a big difference. This shows how the `simdjson` performance win doesn't hold up when you need `symbolized_keys`.

```
ensure these match
true
Warming up --------------------------------------
            oj parse    13.455k i/100ms
      simdjson parse     7.752k i/100ms
FastJsonparser parse    19.458k i/100ms
   stdlib JSON parse     8.546k i/100ms
Calculating -------------------------------------
            oj parse    134.285k (± 4.5%) i/s -      2.018M in  15.060313s
      simdjson parse     75.825k (± 7.2%) i/s -      1.132M in  15.022033s
FastJsonparser parse    208.199k (± 3.1%) i/s -      3.133M in  15.061737s
   stdlib JSON parse     86.504k (± 3.5%) i/s -      1.299M in  15.035736s

Comparison:
FastJsonparser parse:   208199.1 i/s
            oj parse:   134285.4 i/s - 1.55x  (± 0.00) slower
   stdlib JSON parse:    86503.7 i/s - 2.41x  (± 0.00) slower
      simdjson parse:    75825.4 i/s - 2.75x  (± 0.00) slower
```

## Using Large JSON Data

The results are very similar for a much larger production 120K JSON payload, pulled for a live system. (NOTE: these benchmarks were run on a different machine)... In this case we are showing nearly a 2X performance boost.

**without symbolize_keys:**

```
Warming up --------------------------------------
            oj parse    62.000  i/100ms
      simdjson parse    79.000  i/100ms
   stdlib JSON parse    42.000  i/100ms
Calculating -------------------------------------
            oj parse    622.377  (± 3.9%) i/s -      9.362k in  15.066907s
      simdjson parse    815.699  (± 4.5%) i/s -     12.245k in  15.045902s
   stdlib JSON parse    426.656  (± 3.5%) i/s -      6.426k in  15.083428s

Comparison:
      simdjson parse:      815.7 i/s
            oj parse:      622.4 i/s - 1.31x  (± 0.00) slower
   stdlib JSON parse:      426.7 i/s - 1.91x  (± 0.00) slower
```

**with symbol_keys:**

```
ensure these match
true
Warming up --------------------------------------
            oj parse    71.000  i/100ms
      simdjson parse    29.000  i/100ms
FastJsonparser parse    82.000  i/100ms
   stdlib JSON parse    41.000  i/100ms
Calculating -------------------------------------
            oj parse    726.191  (± 1.5%) i/s -     10.934k in  15.059977s
      simdjson parse    294.947  (± 2.4%) i/s -      4.437k in  15.052250s
FastJsonparser parse    909.828  (±10.2%) i/s -     13.530k in  15.026051s
   stdlib JSON parse    497.749  (± 3.6%) i/s -      7.462k in  15.011659s

Comparison:
FastJsonparser parse:      909.8 i/s
            oj parse:      726.2 i/s - 1.25x  (± 0.00) slower
   stdlib JSON parse:      497.7 i/s - 1.83x  (± 0.00) slower
      simdjson parse:      294.9 i/s - 3.08x  (± 0.00) slower
```

The `MemoryProfiler` (nor production deployments, server metrics) on either small or large JSON objects didn't really show any substantial difference, so I wouldn't be too concerned with memory when picking these libraries.

# Conclusion

If you have a Ruby service that is parsing large quantities of JSON, it might be worth taking a look at the newer and less known [FastJsonparser](https://github.com/anilmaurya/fast_jsonparser). While the gem is less documented and takes a bit more work to integrate into your app than [OJ](https://github.com/ohler55/oj). If you are looking for a drop in replacement OJ is still the way to go, but for some use cases `SimpdJSON` or `FastJsonparser` will be worth the extra effort. If you are using Rails with a production deployment I can't really see any reason to not use `OJ` for the significant performance benefits that come with it. The `OJ` library made it as easy as possible to use as a drop in replacement and if you rely on nearly any particular JSON quick of the past they have options to help you stay fully compatible. I know as we look towards Ruby 3 we are also hoping to move away from some of the native extension C libraries, but when it comes to very low level repetitive application tasks vs application logic, sometimes it is hard to beat and worth the integration and dependency cost.

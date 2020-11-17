---
layout: post
title: "benchmarking JSON Parsers (OJ vs SimdJson)"
image: /assets/img/find-or-create.jpg
category: Ruby
tags: [Ruby, Rails, Performance, JSON, API]
---

{% include JB/setup %}

![Bugs](/assets/img/compare.png)

> photo credit [Tumisu lt: @pixabay](https://pixabay.com/illustrations/compare-comparison-scale-balance-643305/)

# Performance Benchmarks between `OJ` & `SimdJSON`

I was recently looking at the performance of some endpoints that process large amounts of JSON, and I wondered if we could do even better than we do in terms of performance for that processing. Across our company we have recently switch most of our apps from the Ruby StdLib JSON to [OJ](https://github.com/ohler55/oj), but I had read about [SimdJSON](https://github.com/saka1/simdjson_ruby) and was curious if we should look further into it as well. In this article I will tell you a bit about each of the Ruby JSON options and why you might want to consider them.

## OJ

[OJ](https://github.com/ohler55/oj) is a Ruby library for both parsing and generating JSON with a ton of options. I would basically say if you don't want to think too much but care about JSON performance just set up the OJ gem, and it should be the best option for most folks. It is well know, tested, and trusted in the community with a ton of support.

* A drop in replacement, set it forget it, it is faster and better
* Has built in Rails support, for some Rails JSON quirks
* Supports both generation and parsing

## SimdJSON

The [SimdJSON](https://github.com/saka1/simdjson_ruby) Ruby library doesn't have a lot of talks, documentation, or attention... but it is binding to [the fastest JSON parser out there](https://github.com/simdjson/simdjson)... It offers parsing speeds that nothing else can touch, and if you are trying to parse extremely large and dynamic JSON, it might just be the best option for you. 

* Only supports parsing
* The fastest option out there.
* Not a lot of community activity

## StdLib Ruby JSON

It is built in, seriously if you do much with JSON in a production system, just use OJ, unless you want to dig in deeper or find some specific reason it won't work for you. The Ruby library is fine and will work for any quick check, but if you have any reason to care about performance, OJ is a easy to use drop in replacement... A note of when you shouldn't use it? If you are authoring a gem, reduce your hard dependencies as much as possible, if you call `JSON.parse` and a hosting app is using `OJ`, your gem will use `OJ` and be faster... You shouldn't force users of your gem to require `OJ`.

# Benchmarking the methods

Let's see the difference with favorite Ruby benchmarking gem [benchmark-ips](https://github.com/evanphx/benchmark-ips), which gives a bit more readable reports than the standard `benchmark` lib. These are just quick micro-benchmarks, with all the issues that come with them, but the performance impact has been further validated by deploying to production systems with measurable impacts on the response time. The product use case included far larger JSON payloads and with much higher variability to the data, making me think the results would apply to most web service like systems.

## Benchmarking JSON Parsing

We will load up the two gems, and some weird fake HASH/JSON data. Then benchmark parsing it for a number of seconds...

```ruby
require 'benchmark/ips'
require 'json'
require 'oj'
require 'simdjson'
require 'memory_profiler'

data = {
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
}
json = Oj.dump(data)

puts "show everything ends up the same"
puts Oj.load(json.dup) == Simdjson.parse(json.dup) && Simdjson.parse(json.dup) == JSON.parse(json.dup)

Benchmark.ips do |x|
  x.config(:time => 15, :warmup => 3)

  x.report("oj parse") { Oj.load(json.dup) }
  x.report("simdjson parse") { Simdjson.parse(json.dup) }
  x.report("srdlib JSON parse") { JSON.parse(json.dup) }

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

# Benchmark Results

This shows as claimed that SimdJSON does outperform OJ even on pretty small and contrived JSON examples. The Performance gap holds up or sometimes looks more significant when looking at more realistic production payloads seen in some of the product systems I work with. 

```
show everything ends up the same
true
Warming up --------------------------------------
            oj parse    24.149k i/100ms
      simdjson parse    30.806k i/100ms
   srdlib JSON parse    19.944k i/100ms
Calculating -------------------------------------
            oj parse    249.293k (± 5.8%) i/s -      3.743M in  15.073518s
      simdjson parse    324.782k (± 3.6%) i/s -      4.867M in  15.008594s
   srdlib JSON parse    169.193k (± 9.2%) i/s -      2.533M in  15.107553s

Comparison:
      simdjson parse:   324781.6 i/s
            oj parse:   249293.3 i/s - 1.30x  (± 0.00) slower
   srdlib JSON parse:   169192.5 i/s - 1.92x  (± 0.00) slower
```

The results are very similar for a much larger production 120K JSON payload, pulled for a live system. (NOTE: these benchmarks were run on a different machine)... In this case we are showing nearly a 2X performance boost.

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

The `MemoryProfiler` (nor production deployments, server metrics) on either small or large JSON objects really show any substantial difference, so I wouldn't be too concerned with memory when picking these libraries.

# Conclusion

If you have a Ruby service that is parsing large quantities of JSON, it might be worth taking a look at the newer and less known [SimpdJSON](https://github.com/saka1/simdjson_ruby). While the gem is less documented and takes a bit more work to integrate into your app than [OJ](https://github.com/ohler55/oj). If you are looking for a drop in replacement OJ is still the way to go, but for some use cases `SimpdJSON` will be worth the extra effort. If you are using Rails with a production deployment I can't really see any reason to not use `OJ` for the significant performance benefits that come with it. The `OJ` library made it as easy as possible to use as a drop in replacement and if you rely on nearly any particular JSON quick of the past they have options to help you stay fully compatible. I know as we look towards Ruby 3 we are also hoping to move away from some of the native extension C libraries, but when it comes to very low level repetitive application tasks vs application logic, sometimes it is hard to beat and worth the integration and dependency cost.

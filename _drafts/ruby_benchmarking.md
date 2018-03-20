---
layout: post
title: "Ruby Benchmarking"
image: /assets/img/stopwatch-3206383_1280.jpg
category: Ruby
tags: [Ruby, Rails, Rack, Proxy, CORs]
---
{% include JB/setup %}

# Ruby Benchmarking

If you work on a large app, publish, gems, or are interested in the Ruby community at some point you will likely want to dig into benchmarking. It can be hard and take a lot of time. Often what you think will help performance isn't actually as much of an impact as you would guess... Which is why being able to setup quick checks to verify the impact can be important. Benchmarking is great as it can help prove, your change had the impact you want. I think there is more discussiona round benchmarking at the moment, because [Ruby 3X3](https://blog.heroku.com/ruby-3-by-3) set out a goal to make [Ruby 3 three times faster than Ruby 2](http://engineering.appfolio.com/appfolio-engineering/2017/12/4/hows-progress-on-ruby-3x3). Want to more see this talk [Ruby3x3: How are we going to measure 3x?](https://www.youtube.com/watch?v=kJDOpucaUR4)

![Stopwatch](assets/img/stopwatch-3206383_1280.jpg)
> image from [pixabay](https://pixabay.com/en/stopwatch-time-stop-time-training-3206383/)

# Benchmarking Projects

A number of projects have been proposed and have support from the community for benchmarking Ruby... If you are interested in contributing to Ruby or helping the community with better benchmarking I encourage you to check out these projects. 

* [OptCarrot (Ruby NES Emulator)](http://engineering.appfolio.com/appfolio-engineering/2017/9/22/optcarrot-an-excellent-cpu-benchmark-for-ruby-3x3)
* [Rails Ruby Bench](https://github.com/noahgibbs/rails_ruby_bench)
* [Ruby Bench](https://rubybench.org/)
* [Ruby HexaPDF Gem Benchmark](https://gettalong.org/blog/2017/benchmarking-ruby-2-5.html), and [the benchmark source](https://github.com/gettalong/hexapdf/tree/master/benchmark)
* [Derailed Benchmarks, a tool to benchmark full Rails apps](https://github.com/schneems/derailed_benchmarks)

# Ruby Benchmarking Basics

Whenever I need to quickly benchmark something, I look no further than Ruby's simple [Benchmark Module](https://ruby-doc.org/stdlib-2.5.0/libdoc/benchmark/rdoc/Benchmark.html). I don't have all the usage memorized off the top of my head, but have ended up at this great blog post, [timing Ruby code is easy with Benchmark](https://www.skorks.com/2010/03/timing-ruby-code-it-is-easy-with-benchmark/), a number of times over the years. It is a great and simple post that will help you get the basics up and running in no time at all. 

* [How to use Benchmark on Ruby code](http://rubylearning.com/blog/2013/06/19/how-do-i-benchmark-ruby-code/)
* [Small project to benchmark Ruby web frameworks](https://github.com/luislavena/bench-micro)
* [Alternative to Benchmark Module, ReadyGo](https://github.com/garybernhardt/readygo)
* [Docs on previous Rails applications Performance Testing](http://guides.rubyonrails.org/v3.2.13/performance_testing.html)
   * Oddly I can't find anything that seems to work with modern Ruby and Rails libraries  

# Benchmarking A Gem

If you maintain a Gem, that could have large performance impacts. It can make sense to try to build performance testings into the Gem, helping to ensure that changes and new features don't impact the performance in unexpected ways overtime.

For example I maintaince a Gem, [Coverband](https://github.com/danmayer/coverband), which records production code coverage. Obviously, this can have a major impact on performance as it tracks every line executed on production. Nearly every decision about features and release of the Gem involved some form of Benchmarking. The code has gone through several strategies to mitigate the performance impact. Let's take a look a quick timeline. As coverband is changed, we can check and compair the perfomance impacts to the [Coverband perfomance tests](https://github.com/danmayer/coverband/tree/master/test/benchmarks).

* 2013: initial release 
   * performance cost of 100% coverage, around 8X slower Rails requests
   * initial release performance costs weren't well explained with no released benchmarks
   * Performance costs were mitigated by sampling a percentage of requests
   * As well as safelist & blocklisting files to track
* 2014: released coverband_ext (C extension for fast access to tracepoint API) in
   * [benchmarks for 100% coverage](https://github.com/danmayer/coverband_ext#perf-improvements) showed this 1.25X slower Rails requests
   * This was the first time I released solid benchmarks on coverband
     * benchmarks were done on a sample Rails app & a large production app at my current place of employment 
     * benchmarks were done by hand in a non repeatable process
* 2015: Various performance improvements introduced
   * Redis pipelining
   * Redis zadd
   * no benchmarking to confirm actual performance impacts
* 2016: performance tests introduced into Coverband repository by [@kbaum8](https://twitter.com/kbaum8)
   * The new performance tests were used to propose that with various improvements between Ruby 1.9.x and Ruby 2.1.x that we could drop support for [Coverband_ext](https://github.com/danmayer/coverband_ext)
   * Moved from `set_trace_func` to Ruby `trace_point`
   * The micro benchmarking showed that Ruby `trace_point` was more than good enough an the C extension no longer provided significant performance improvements
   * See the [source for integrated microbenchmark performance tests](https://github.com/danmayer/coverband/tree/master/test/benchmarks)
   * At these point most features and changes were checked with the performance tests to ensure the project was always getting faster
   * improved file filtering
   * Adding support for line usage count vs just boolean used or unused for example didn't incure additional overhead
* 2017: 
   * Multiple backend stores added
   * The benchmark performance tests were refactored, so performance could be compared across multiple stores
* 2018:
   * Attempt to patch the `Coverage` [reentrant Ruby bug](https://bugs.ruby-lang.org/issues/9572)
      * in this quest I propose `Coverage.pause` and `Coverage.resume`
      * and in response [@tenderlove](https://twitter.com/tenderlove) says my goals are supported by `peek_results` which was added about 3 years ago, and that the performance impacts I had been assuming were not likely correct.
      * I attempt to prove that the performance impact would be significant, and end up proving @tenderlove is correct, which is what started the Benchmarking quest that I have been embarking on the last few weeks.

### Additional Resources on Performance Testing Gems

* [hexapdf benchmark tests](https://github.com/gettalong/hexapdf/tree/master/benchmark)
* [rspec-benchmark gem](https://github.com/piotrmurach/rspec-benchmark)

# What I learned trying to do better benchmarking on Coverage.

* for some things micro-benchmarks aren't helpful
* the number of files instrumented with coverage has the biggest impact on performance
* calling covarge to collect the reports is the biggest cost of coverage, much larger than collecting it.
* coverage since it instruments when a file is loaded is far faster than tracepoint line usage


---

Three points:

* if you want to contribute to Ruby how to Benchmakr larger projects for Riuby changes in 3x3
  * failing to send a patch to Ruby as benchmarks prove it is unnessary 
* benchmarking and maintaining gem performance
* making coverband like 3x faster using benchmarking to prove a different approach is much faster
---
layout: post
title: "Ruby Benchmarking"
image: /assets/img/stopwatch-3206383_1280.jpg
category: Ruby
tags: [Ruby, Rails, Performance, Benchmarking, Coverband]
---
{% include JB/setup %}

# Ruby Benchmarking

If you work on a large app, publish, gems, or are interested in the Ruby community at some point you will likely want to dig into performance and benchmarking. Often what you think will help performance doesn't have as much of an impact as you would guess. Which is why being able to set up quick experiments to verify the impact of code changes on performance and memory can be important. Benchmarking is great as it can help prove, your change had the impact you want. Ruby performance and the measurement of it is getting more discussion at the moment because [Ruby 3X3](https://blog.heroku.com/ruby-3-by-3) set out a goal to make [Ruby 3 three times faster than Ruby 2](http://engineering.appfolio.com/appfolio-engineering/2017/12/4/hows-progress-on-ruby-3x3). Learn more in this talk, [Ruby3x3: How are we going to measure 3x?](https://www.youtube.com/watch?v=kJDOpucaUR4)

This post will talk about measuring the performance of Ruby and benchmarking your own code and applications. In a future post, I will dig more into good practices around benchmarking Ruby gems.

![Stopwatch](/assets/img/stopwatch-3206383_1280.jpg)
> image from [pixabay](https://pixabay.com/en/stopwatch-time-stop-time-training-3206383/)

# Ruby Benchmarking Projects

A number of projects have been proposed and have support from the community for benchmarking Ruby... These project all will help the community improve the performance of Ruby, and can be used to help you measure the impact or Ruby or Gem changes you would like to try. If you are interested in contributing to Ruby or helping the community with improved performance or better benchmarking I encourage you to check out these projects. A great way to learn more about benchmarking is to dig into projects that are already out available and looking for more contributors.

* [OptCarrot (Ruby NES Emulator)](http://engineering.appfolio.com/appfolio-engineering/2017/9/22/optcarrot-an-excellent-cpu-benchmark-for-ruby-3x3)
* [Rails Ruby Bench](https://github.com/noahgibbs/rails_ruby_bench)
* [Ruby Bench](https://rubybench.org/)
* [Ruby HexaPDF Gem Benchmark](https://gettalong.org/blog/2017/benchmarking-ruby-2-5.html), and [the benchmark source](https://github.com/gettalong/hexapdf/tree/master/benchmark)
* [Derailed Benchmarks, a tool to benchmark full Rails apps](https://github.com/schneems/derailed_benchmarks)

# Ruby Benchmarking Basics

When I need to quickly benchmark something, I look no further than Ruby's simple [Benchmark Module](https://ruby-doc.org/stdlib-2.5.0/libdoc/benchmark/rdoc/Benchmark.html). I don't have all the usage memorized off the top of my head, but have ended up at this great blog post, [timing Ruby code is easy with Benchmark](https://www.skorks.com/2010/03/timing-ruby-code-it-is-easy-with-benchmark/), a number of times over the years. It is a quick and simple post that will help get basics up and running in no time at all. For some additional Ruby benchmarking support also see the resources below.

* [How to use Benchmark on Ruby code](http://rubylearning.com/blog/2013/06/19/how-do-i-benchmark-ruby-code/)
* [a Small project to benchmark Ruby web frameworks](https://github.com/luislavena/bench-micro)
* [Alternative to Benchmark Module, ReadyGo](https://github.com/garybernhardt/readygo)

# Learning by Benchmarking A Proposed Ruby Change

I previously covered how to [build Ruby from scratch on OS X](https://www.mayerdan.com/ruby/2018/02/17/building-custom-ruby-from-scratch-on-OSX). I posted that as I was working on a feature, I was hoping to get into Ruby. I proposed a change to Ruby's Coverage that I hoped would lead to large performance improvements adding [Coverage Pause & Resume](https://bugs.ruby-lang.org/issues/9572#note-4) support. A little discussion with [@tenderlove](https://twitter.com/tenderlove), lead me to try to prove the value of the feature in terms of performance. In the end, I actually proved my feature idea was unnecessary and that Ruby's Coverage was significantly faster than [Ruby's Tracepoint](https://ruby-doc.org/core-2.0.0/TracePoint.html). Below, I will walk through some of the steps and code, I used while driving towards better benchmarks and understanding of what was really impacting performance while trying to collect the line of code runtime.

### First Attempt: A Micro Benchmark

For some specific changes a micro benchmark, that focuses in very narrowly on the specific changes under test can be all that is needed and make for faster and easier iteration while testing changes. Often these are the easiest to setup and be more easily repeatable with various versions and settings to compare a number of changes.

My first attempt was to use a small repository, that I had used to show an issue with Ruby's coverage, see my [Benchmarking Coverage Example](https://github.com/danmayer/coverage-bug/blob/master/example.rb). The code was extended it so it could be run in 3 modes:

* Ruby without Coverage loaded: `ruby example.rb`
* Ruby with Coverage as it exists in the current release: `COVERAGE=true ruby example.rb`
* Ruby with my suggested Coverage feature put to use: `ENHANCED_COVERAGE=true ruby example.rb`

```ruby
require 'benchmark'
require 'coverage'

WITH_COVERAGE = !!ENV['COVERAGE']
WITH_ENHANCED_COVERAGE = !!ENV['ENHANCED_COVERAGE']

Coverage.start if WITH_COVERAGE || WITH_ENHANCED_COVERAGE
require 'bigdecimal/math'
require './app'
require './app_proxy'
Coverage.pause if WITH_ENHANCED_COVERAGE

ITERATIONS = 2_000
UPTO = 1_000
coverage_data = nil

# warm up
AppProxy.process(App, {iterations: 1, up_to: UPTO})

Benchmark.bm do |bm|
  if WITH_ENHANCED_COVERAGE
    bm.report { coverage_data = AppProxy.process(App, {iterations: ITERATIONS, up_to: UPTO, coverage: false, enhanced_coverage: false}) }
  end
  bm.report { coverage_data = AppProxy.process(App, {iterations: ITERATIONS, up_to: UPTO, coverage: WITH_COVERAGE, enhanced_coverage: WITH_ENHANCED_COVERAGE}) }
end

puts "coverage"
puts coverage_data
puts "done"
```

The initial results, even with a high number of iterations basically couldn't show a real difference. In the case, I was trying to show, since it wasn't a dramatic improvement and wasn't obviously measurable like the number of objects allocated to memory, proved to not be a good case for a microbenchmark.

### Second Attempt: Build On Rails Ruby Bench

As I abandoned the idea of a microbenchmark being able to show the differences of the performance impact when using Ruby's code coverage. I sought a more realistic example of how Ruby code is frequently used in production. I found [@codefolio](https://twitter.com/codefolio)'s project, [rails_ruby_bench](https://github.com/noahgibbs/rails_ruby_bench), which I mentioned previously intends to help measure performance impacts for Ruby 3X3. Unfortunately, I ran into some issues getting this benchmark to run locally and I would need to do a good deal of work to embed the code I wanted under test into this project and Discourse which the project uses as the Rails app under performance testing.

While I didn't end up pursuing this route, it did help push me towards a good direction to more realistically measure the performance impacts I wanted to see. By setting up a sample Rails application and testing full request cycles, I would have a much more realistic measure of my changes. I plan to follow up on this project more in the future and think it is an ideal way to test many Ruby or Gem changes that would have performance or memory impacts on standard Rails applications.

### Third Attempt: Sample Rails App

Combining the learnings from the microbenchmark and the ideas in Rails Ruby Bench, I wanted to be able to quickly test a number of different scenarios by just setting a few environment variables, and then pull meaningful results on exercising the full Rails app with the changes. To measure the impact on the full Rails stack I turned to [Apache's AB](https://httpd.apache.org/docs/2.4/programs/ab.html), a simple HTTP benchmarking tool I have used many times over the years. 

For each test, the Rails application would be run in a different mode, then benchmarked via AB. I created a new repository [coverage_rails_benchmark](https://github.com/danmayer/coverage_rails_benchmark). The project README covers all the steps for anyone to run their own set of benchmarks and records all the results of my performance tests.

The benchmarking script itself is extremely simple, the script below will make 2000 requests making 5 concurrent requests at a time to the endpoint listed. The code can be found in `bin/benchmark.rb`

```ruby
puts `ab -n 2000 -c 5 "http://127.0.0.1:3000/posts"`
```



For example to get the most basic results of Ruby without Coverage loaded, one would follow the two steps below in two different terminals.

* start the Rails server in basic mode: `IGNORED_COVERAGE=true RAILS_ENV=production bin/rails server`
* execute the benchmark: `ruby ./bin/benchmark.rb`

This would output a bunch of data about the benchmark results.

```shell
Benchmarking 127.0.0.1 (be patient)

Server Software:
Server Hostname:        127.0.0.1
Server Port:            3000

Document Path:          /posts
Document Length:        3631 bytes

Concurrency Level:      5
Time taken for tests:   8.391 seconds
Complete requests:      2000
Failed requests:        0
Total transferred:      8572000 bytes
HTML transferred:       7262000 bytes
Requests per second:    238.34 [#/sec] (mean)
Time per request:       20.978 [ms] (mean)
Time per request:       4.196 [ms] (mean, across all concurrent requests)
Transfer rate:          997.58 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0      11
Processing:     6   21  10.8     19     192
Waiting:        6   20  10.7     19     190
Total:          6   21  10.8     19     192

Percentage of the requests served within a certain time (ms)
  50%     19
  66%     23
  75%     25
  80%     26
  90%     30
  95%     33
  98%     38
  99%     42
 100%    192 (longest request)
```

For my various comparisons, I ended up caring the most for the mean time per request in the above example `20.978 [ms] (mean)` was the starting point baseline I comparing with all other results. My final sample benchmark support 7 distinct modes that could be run in two different distinct settings. Unlike with my microbenchmark performance differences were extremely obvious with a full spread of fasted benchmarking mode running at `17.735 [ms] (mean)` vs the slowest mode taking `85.069 [ms] (mean)`. Showing the worst mode was nearly 5X slower in a simple benchmark.

# Benchmarking Conclusions

The various modes and options made it clear that I had initially been optimizing for the wrong thing, and that while there was significant performance improvements that could be made, it wouldn't be related to my suggested Coverage feature proposal to support pause and resume. Instead, it showed that collecting coverage data was always very fast, but pulling and processing that data could be very slow. Opposed to trying to sample data collection the goal should be to reduce as much as possible the frequency one processes the results and to filter it down to the smallest set of results needed. Let's take a look at a high-level summary below, or see the [full benchmark details](https://github.com/danmayer/coverage_rails_benchmark#benchmark-conclusions).

* No Coverage Support: `17.735`
* Coverage Running (Ignore Coverage): `18.131`
* Coverage Stopped (Ignore Coverage): `18.268`
* Coverage Paused (Ignore Coverage): `18.717`
* Coverband Coverage (Ignore Coverage): `18.759`
* __New Pilot Version__ Coveraband Coverage (Collect Coverage): `19.227`
* Coverage Running (Collect Coverage, but only into memory): `21.141`
* Coverage Resume (Ignore Coverage): `23.930`
* Coverage Resume (Collect Coverage, but only into memory): `26.720`
* Coverband Coverage (Collect Coverage): `39.421`
* Coverband Tracepoint (Collect Coverage): `46.979`
* Coverband Tracepoint (Ignore Coverage): `47.500`
* Coverage (Collect Coverage, send to Rails.logger): `85.069`

In the end, my goal of changing Ruby's Coverage was to be able to significantly reduce the performance overhead of my gem [Coverband](https://github.com/danmayer/coverband)'s ability to collect runtime data. The results from the benchmark gave me all the data I needed to see that a different approach, where I dropped TracePoint in favor of Coverage but worked to reduce the frequency of checking the results would lead to far better performance improvements than my initially suggested feature. In the end, I pursued that approach, and was able to reduce the overhead with a sample rate of 100% from __2.5X slower to only being 1.08X slower!__ The details on that, I will cover in another post with some specifics on how to build performance benchmark testing into a Gem.

# Ruby Benchmarking Learnings

I came away with a deeper understanding of Ruby performance benchmarking, and a much faster Gem that I will be able to release shortly. Beyond that some additional thoughts on Ruby benchmarking,

* For some changes microbenchmarks aren't helpful
* There are some existing great projects to help folks benchmark changes to the Ruby language
* Ruby's Coverage is significantly Faster than collecting line usage via Ruby's TracePoint functionality
* Specific to Ruby's Coverage library
   * The number of files instrumented with coverage has a big impact on performance, making micro benchmarks useless for that library
   * Calling `coverage.peek_results` to access the data is the biggest cost, much larger than collecting it.
   * Simply logging, processing, or trying to do anything with data is often slower than collecting it
   * Performance wins will come in reducing processing the data vs collecting it
* Writing an maintaining good benchmarks can be challenging, I didn't touch on the issues of running benchmarks with "background noise" and running multiple times to tease that out
* Without measuring performance, guessing what will have a large impact is often wrong

# Let's Go Faster

<iframe src="https://giphy.com/embed/q6U4fbreC4Neo" width="480" height="339" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/q6U4fbreC4Neo">via GIPHY</a></p>

In a follow-up post, I will dig into the details of benchmarking a Gem over time, and the specific changes that helped to reduce the performance overhead of Coverband making it an order of magnitude faster. While there are code changes and using different features of Ruby, large performance wins also can come from a fundamentally different approach to solving the problem, which is the case with the changes needed to improve Coverband.

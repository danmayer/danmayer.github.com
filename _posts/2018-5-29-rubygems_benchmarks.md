---
layout: posttail
authors: ["Dan Mayer"]
title: "Ruby Gems Benchmarks"
image: /assets/img/stopwatch-3206383_1280.jpg
category: Ruby
tags: [Ruby, Rails, Performance, Benchmarking, Coverband]
---

{% include JB/setup %}

# RubyGems Benchmarks

This follows up on my previous post focused on [Ruby Benchmarking](https://www.mayerdan.com/ruby/2018/03/25/ruby-benchmarking). This post will focus on benchmarking a gem as part of it's long term maintenance. Building a community [standard around Gem Benchmarking](https://youtu.be/kJDOpucaUR4?t=31m28s) has even been suggested as a good way to help Ruby fine tune performance over time.

{% unless page.image %}
![Stopwatch](/assets/img/stopwatch-3206383_1280.jpg)
{% endunless %}

> image from [pixabay](https://pixabay.com/en/stopwatch-time-stop-time-training-3206383/)

## Why Benchmark A Gem

If you maintain a Gem, which could have large performance impacts on folks integrating the gem. It can make sense to try to build performance testing into the Gem, helping to ensure that changes and new features don't impact the performance in unexpected ways overtime. It also will help for you to publish performance impacts to give confidence to folks adding your gem as a dependency.

For example I maintain a Gem, [Coverband](https://github.com/danmayer/coverband), which records production code coverage. Obviously, this can have a major impact on performance as it tracks every line executed on production. During the life of Coverband, nearly every decision about features and Gem release involved some Benchmarking. The project was initially developed to help remove dead code from a large old monolithic rails app, before the first release could be put on production it went through a number of performance tests and only ran on staging until the perf impact could be acceptably <!--more--> controlled.

## Coverband Benchmark Timeline

Coverband code has gone through several strategies to mitigate the performance impact. Let's take a look at quick timeline of major changes. As Coverband has changed, we can check and compare the performance impacts with the [Coverband Benchmark Tasks](https://github.com/danmayer/coverband/tree/master/test/benchmarks), which are explained later in this post.

- 2013: initial release
  - performance cost of 100% recorded coverage, around 8X slower Rails requests
  - initial release performance costs weren't well explained with no released benchmarks
  - Performance costs were mitigated by sampling a percentage of requests
  - As well as safelist & blocklisting files to track
- 2014: released coverband_ext (C extension for fast access to tracepoint API) in
  - [benchmarks for 100% recorded coverage](https://github.com/danmayer/coverband_ext#perf-improvements) showed this 1.25X slower Rails requests
  - This was the first time I released solid benchmarks on coverband
    - benchmarks were done on a sample Rails app & a large production app at my current place of employment
    - benchmarks were done by hand in a non repeatable process
- 2015: Various performance improvements introduced
  - Redis pipelining
  - Redis `zadd`
  - benchmarking was done by hand, in a non repeatable way, to confirm actual performance impacts
- 2016: performance tests introduced into Coverband repository by [@kbaum8](https://twitter.com/kbaum8)
  - The new performance tests were used to propose that with various improvements between Ruby 1.9.x and Ruby 2.1.x that we could drop support for [Coverband_ext](https://github.com/danmayer/coverband_ext)
  - Moved from `set_trace_func` to Ruby `trace_point`
  - The micro-benchmark showed that Ruby `trace_point` was more than good enough an the C extension no longer provided significant performance improvements
  - See the [source for integrated micro-benchmark performance tests](https://github.com/danmayer/coverband/tree/master/test/benchmarks)
  - At these point most features and changes were checked with the performance tests to ensure the project was always getting faster
  - improved file filtering
  - Adding support for line usage count vs just used or unused for example didn't incur additional overhead
- 2017:
  - Multiple backend stores added
  - The benchmark performance tests were refactored, so performance could be compared across multiple backend stores
- 2018:
  - Attempt to patch the `Coverage` [reentrant Ruby bug](https://bugs.ruby-lang.org/issues/9572)
    - in this quest I propose `Coverage.pause` and `Coverage.resume`
    - and in response [@tenderlove](https://twitter.com/tenderlove) says my goals are supported by `peek_results` which was added about 3 years ago, and that the performance impacts I had been assuming were not likely correct.
    - I attempt to prove that the performance impact would be significant, and end up proving @tenderlove is correct ;) Which is what started the deeper dive into Ruby Benchmarking
  - The results from the above cause me to update the Coverband benchmarks and use those benchmarks to help prove the significant win of using `Coverage` vs `trace_point`
  - Extending the benchmark code to report across different collector methods, shows massive win for the new `Coverage` based collector, at least a 4X improvement.

## Benchmark Code

Below are some selected examples of the [Coverband micro-benchmark performance tasks](https://github.com/danmayer/coverband/tree/master/test/benchmarks).

There are many ways to setup benchmarks for a Gem. In the Coverband examples are simple Rake tasks. This is opposed to performance tests, which folks have often employed for Rails app benchmarks. Given all the configuration and runtime impacts, the Rake approach worked well, but it requires reviewing the data by hand as nothing is tracked or charted in a machine readable format over time via CI.

The example below has been simplified a bit from the full source linked above.

```ruby
namespace :benchmarks do
  # leaving out some helper methods

    desc 'set up coverband tracepoint collector to redis'
  task :setup do
    clone_classifier
    $LOAD_PATH.unshift(File.join(classifier_dir, 'lib'))
    require 'benchmark'
    require 'classifier-reborn'

    Coverband.configure do |config|
      config.redis              = Redis.new
      config.root               = Dir.pwd
      config.percentage         = 100.0
      config.logger             = $stdout
      config.collector          = 'trace'
      config.memory_caching     = ENV['MEMORY_CACHE'] ? true : false
      config.store              = Coverband::Adapters::RedisStore.new(Redis.new)
    end
  end

  desc 'set up coverband with coverage collector to redis'
  task :setup_coverage do
    clone_classifier
    $LOAD_PATH.unshift(File.join(classifier_dir, 'lib'))
    require 'benchmark'
    require 'classifier-reborn'

    Coverband.configure do |config|
      config.root               = Dir.pwd
      config.percentage         = 100.0
      config.logger             = $stdout
      config.collector          = 'coverage'
      config.memory_caching     = ENV['MEMORY_CACHE'] ? true : false
      config.store              = Coverband::Adapters::RedisStore.new(Redis.new)
    end
  end

  def work
    5.times do
      bayes_classification
      lsi_classification
    end

    # simulate many calls to the same line
    10_000.times { Dog.new.bark }
  end

  def run_work
    puts "benchmark for: #{Coverband.configuration.inspect}"
    puts "store: #{Coverband.configuration.store.inspect}"
    Benchmark.bm(15) do |x|
      x.report 'coverband' do
        SAMPLINGS.times do
          Coverband::Collectors::Base.instance.sample do
            work
          end
        end
      end

      x.report 'no coverband' do
        SAMPLINGS.times do
          work
        end
      end
    end
    Coverband::Collectors::Base.instance.stop
    Coverband::Collectors::Base.instance.reset_instance
  end

  desc 'runs benchmarks on default redis setup'
  task run: :setup do
    puts 'Coverband tracepoint configured with default redis store'
    SAMPLINGS = 5
    run_work
  end

  desc 'runs benchmarks coverage'
  task run_coverage: :setup_coverage do
    puts 'Coverband Coverage configured with to use default redis store'
    SAMPLINGS = 5
    run_work
  end
end

desc 'runs all benchmarks'
task benchmarks: ['benchmarks:run', 'benchmarks:run_coverage']
```

## Benchmark Results

Below is a sample of the output generated when all the benchmarks are run. For each test, it configures Coverband and outputs the configuration settings, along with the same code executed with and without Coverband. The key point being the output below for the new Coverband implementation.

```
                      user     system      total        real
coverband         0.320000   0.010000   0.330000 (  0.322387)
no coverband      0.320000   0.000000   0.320000 (  0.321767)
```

![Stopwatch](https://chart.googleapis.com/chart?chtt=Time%20in%20Sec%20Vs%20Benchmark%20Type&chxt=x,y&cht=bvs&chxr=1,0,1.5&chds=0,1.5&chd=t:1.350,1.3100,0.32,0.32&chco=76A4FB&chbh=23,100,75&chs=500x325&chxl=0:|Tracepoint%20to%20File|Tracepoint%20to%20Redis|Coverage%20to%20Redis|Without%20Coverband)

> User time from benchmark results below graphed

While it is easy to see the performance impact of the previous `tracepoint collector`, at `1.350000` vs `0.320000` the current benchmark can't even detect a performance slowdown using the new `Coverage` collector. While this means, I should further extend the Gems performance tests, the new implementation is significantly and easily proved to be far more performant than the previous implementation.

```shell
rake benchmarks
Coverband tracepoint configured with file store
benchmark for: #<Coverband::Configuration:0x007fc069235c68 @root="/Users/danmayer/projects/coverband", @redis=nil, @root_paths=[], @ignore=[], @additional_files=[], @include_gems=false, @percentage=100.0, @verbose=false, @reporter="scov", @collector="trace", @logger=#<IO:<STDOUT>>, @startup_delay=0, @memory_caching=false, @store=#<Coverband::Adapters::FileStore:0x007fc0692359e8 @path="/tmp/benchmark_store.json">, @disable_on_failure_for=nil>
store: #<Coverband::Adapters::FileStore:0x007fc0692359e8 @path="/tmp/benchmark_store.json">
                      user     system      total        real
coverband         1.350000   0.000000   1.350000 (  1.354026)
no coverband      0.310000   0.000000   0.310000 (  0.321970)
Coverband tracepoint configured with default redis store
/Users/danmayer/projects/coverband/test/benchmarks/benchmark.rake:127: warning: already initialized constant SAMPLINGS
/Users/danmayer/projects/coverband/test/benchmarks/benchmark.rake:134: warning: previous definition of SAMPLINGS was here
benchmark for: #<Coverband::Configuration:0x007fc069235c68 @root="/Users/danmayer/projects/coverband", @redis=#<Redis client v3.3.3 for redis://127.0.0.1:6379/0>, @root_paths=[], @ignore=[], @additional_files=[], @include_gems=false, @percentage=100.0, @verbose=false, @reporter="scov", @collector="trace", @logger=#<IO:<STDOUT>>, @startup_delay=0, @memory_caching=false, @store=#<Coverband::Adapters::RedisStore:0x007fc06911c8b8 @redis=#<Redis client v3.3.3 for redis://127.0.0.1:6379/0>>, @disable_on_failure_for=nil>
store: #<Coverband::Adapters::RedisStore:0x007fc06911c8b8 @redis=#<Redis client v3.3.3 for redis://127.0.0.1:6379/0>>
                      user     system      total        real
coverband         1.310000   0.000000   1.310000 (  1.344789)
no coverband      0.320000   0.000000   0.320000 (  0.318863)
Coverband Coverage configured with to use default redis store
/Users/danmayer/projects/coverband/test/benchmarks/benchmark.rake:141: warning: already initialized constant SAMPLINGS
/Users/danmayer/projects/coverband/test/benchmarks/benchmark.rake:127: warning: previous definition of SAMPLINGS was here
benchmark for: #<Coverband::Configuration:0x007fc069235c68 @root="/Users/danmayer/projects/coverband", @redis=#<Redis client v3.3.3 for redis://127.0.0.1:6379/0>, @root_paths=[], @ignore=[], @additional_files=[], @include_gems=false, @percentage=100.0, @verbose=false, @reporter="scov", @collector="coverage", @logger=#<IO:<STDOUT>>, @startup_delay=0, @memory_caching=false, @store=#<Coverband::Adapters::RedisStore:0x007fc0691acfa8 @redis=#<Redis client v3.3.3 for redis://127.0.0.1:6379/0>>, @disable_on_failure_for=nil>
store: #<Coverband::Adapters::RedisStore:0x007fc0691acfa8 @redis=#<Redis client v3.3.3 for redis://127.0.0.1:6379/0>>
                      user     system      total        real
coverband         0.320000   0.010000   0.330000 (  0.322387)
no coverband      0.320000   0.000000   0.320000 (  0.321767)
```

## Additional Resources on Performance Testing Gems

Some other examples of benchmarking a Gem or even single commits.

- [hexapdf benchmark tests](https://github.com/gettalong/hexapdf/tree/master/benchmark)
- [rspec-benchmark gem](https://github.com/piotrmurach/rspec-benchmark)
- [benchmarking a single Rails commit](https://github.com/rails/rails/commit/0c54fc460e52d2b9aa02e1e27a090dbe7ee98829)

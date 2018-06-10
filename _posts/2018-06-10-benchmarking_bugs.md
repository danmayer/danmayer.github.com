---
layout: post
title: "Benchmarks Bugs"
image: /assets/img/ladybugs.jpg
category: Ruby
tags: [Ruby, Rails, Performance, Benchmarking, Coverband]
---
{% include JB/setup %}

# Benchmarking Bugs

On my previous post I covered [benchmarking Rubygems](https://www.mayerdan.com/ruby/2018/05/29/rubygems_benchmarks)... I was working on some follow up to improve the benchmarks and discovered a bug rendering one of the benchmark comparisons invalid. In this post we will cover what I had missed, how to avoid some gotchas, and ways to improve the readability of your benchmarks.

![Bugs](/assets/img/ladybugs.jpg)
> image from [pixabay](https://pixabay.com/en/ladybugs-ladybirds-bugs-insects-1593406/)

## Spot The Bug

This is a simplified example from the source code. The bug is hard to notice without knowing the internals of the library, but if you understand Ruby's `Coverage` library you might spot it.

```ruby
namespace :benchmarks do
  desc 'set up coverband with coverage redis'
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

  desc 'runs benchmarks coverage'
  task run_coverage: :setup_coverage do
    puts 'Coverband Coverage configured with to use default redis store'
    SAMPLINGS = 5
    run_work
  end
end
```

The issue is that the benchmark is trying to compare running Coverband with Ruby's `Coverage` lib against code, which doesn't collect usage data. When using Ruby's `Coverage` is loaded and started, it changes how __ALL__ other code is loaded and interpreted. Which means once the `Coverage` library is loaded both benchmarks will run with the performance impact. The only difference is once is collecting and reporting the coverage to Redis, via Coverband. Since the `Coverage` library effect the Ruby runtime it is best to run the benchmarks as entirely isolated processes to avoid blending the impacts of one benchmark into the other.

# Spot the Bug in the Stats

Even if one doesn't notice the issue in the code, the output from the benchmarks should make the issue stand out. In my previous post I noticed that I __could no longer detect__ performance impacts of Coverband, that seemed to good to be true.

```shell
                      user     system      total        real
coverband         0.320000   0.010000   0.330000 (  0.322387)
no coverband      0.320000   0.000000   0.320000 (  0.321767)
```

It also didn't match with real world [Rails benchmarks](https://www.mayerdan.com/ruby/2018/03/25/ruby-benchmarking). At the time in that post, I believed my benchmarks just weren't sufficient to capture the small impact. Wanting to make my benchmarks easier to read and to be able to detect the known performance impact is what caused me to find the bug.

# Making Benchmarks More Readable

As I was working to detail the the performance impact of Coverband, I decided I should port my benchmarks from the std-lib benchmark, to the excellent [benchmark-ips](https://github.com/evanphx/benchmark-ips) gem by [@evanphx](https://twitter.com/evanphx). The gem has output in the format below. The new format in comparison to the default format, makes it much easier to understand performance differences. In this case because of the bug to see clearly a missing and expected difference. The improved Gem also helped me find better iterations to detect changes on my existing and working benchmarks.

```shell
Coverband Coverage configured with to use default Redis store
Warming up --------------------------------------
           coverband     1.000  i/100ms
        no coverband     1.000  i/100ms
Calculating -------------------------------------
           coverband     14.690  (±27.2%) i/s -    149.000  in  12.045429s
        no coverband     15.112  (±33.1%) i/s -    151.000  in  12.240970s

Comparison:
        no coverband:       15.1 i/s
           coverband:       14.7 i/s - same-ish: difference falls within error
```

The improved format along with increased iterations (5 seconds warmup and 12 seconds runtime) made it clear that there was truly __ZERO__ difference between the `Coverage` benchmarks, which was wrong.  This makes it very clear a there was a bug in my methodology.

# Fixing the Issue

Once I realized `Coverage` was loaded for both runs, it was pretty clear what was wrong. I needed to do a couple things.

* The `Coverage` lib needs to be both `required` and `started` before any code that we plan to track (this also wasn't done in the previous benchmark, so actual coverage data wasn't being collected correctly.)
* Since `Coverage` changes how Ruby actually interprets the code when loaded. I needed to run the two timed tasks independently and finally compare the data.

It was pretty easy to port my old benchmark code to `benchmark-ips`, and to clean things up along the way. As well as handle both of the mentioned issues. See the new benchmark code below (simplified here, see Github for the [full src code details](https://github.com/danmayer/coverband/blob/feature/via_coverage/test/benchmarks/benchmark.rake)).

```ruby
namespace :benchmarks do
  desc 'setup standard benchmark'
  task :setup do
    clone_classifier
    $LOAD_PATH.unshift(File.join(classifier_dir, 'lib'))
    require 'benchmark'
    require 'benchmark/ips'

    # NOTE: When we require files is what makes performance impact of Coverage interesting (moving this above or below Coverage.start gives detectable vs not detectable performance impacts
    require 'classifier-reborn'
    if ENV['COVERAGE']
      puts 'Coverage library loaded and started'
      require 'coverage'
      ::Coverage.start
    end
    require 'redis'
    require 'coverband'
    require File.join(File.dirname(__FILE__), 'dog')
  end

  desc 'set up coverband with coverage Redis'
  task :setup_coverage do
    Coverband.configure do |config|
      config.root               = Dir.pwd
      config.percentage         = 100.0
      config.logger             = $stdout
      config.collector          = 'coverage'
      config.memory_caching     = ENV['MEMORY_CACHE'] ? true : false
      config.store              = Coverband::Adapters::RedisStore.new(Redis.new)
    end
  end
  
  def run_work(hold_work = false)
    suite = GCSuite.new
    #puts "benchmark for: #{Coverband.configuration.inspect}"
    #puts "store: #{Coverband.configuration.store.inspect}"
    Benchmark.ips do |x|
      x.config(:time => 12, :warmup => 5, :suite => suite)
      x.report 'coverband' do
        Coverband::Collectors::Base.instance.sample do
          work
        end
      end
      Coverband::Collectors::Base.instance.stop
      x.report 'no coverband' do
        work
      end
      x.hold! 'temp_results' if hold_work
      x.compare!
    end
    Coverband::Collectors::Base.instance.reset_instance
  end
  
  desc 'runs benchmarks coverage'
  task run_coverage: [:setup, :setup_coverage] do
    puts 'Coverband Coverage configured with to use default Redis store'
    run_work(true)
  end

  desc 'compare Coverband Ruby Coverage with normal Ruby'
  task :compare_coverage do
    puts 'comparing with Coverage loaded and not, this takes some time for output...'
    puts `COVERAGE=true rake benchmarks:run_coverage`
    puts `rake benchmarks:run_coverage`
  end
end
```

As you can see to handle the hard part of running the benchmarks independently and comparing them I used a cool feature of `benchmark-ips`. Loading the `Coverage` library or not is now controlled by `ENV['COVERAGE']` making it easy to run with or without a change to how Ruby interprets the code.

# Using benchmark-ips hold! 

As I was starting to look at how to compare data on two runs, I checked to see if the new benchmarking gem I was using could help me. The documentation covered having a `hold!` feature, which seemed exactly what I needed.

> If you are comparing multiple implementations of a piece of code you may want to benchmark them in separate invocations of Ruby so that the measurements are independent of each other. You can do this with the hold! command.  
> -- [benchmark-ips, independent-benchmarking](https://github.com/evanphx/benchmark-ips#independent-benchmarking)


Sounds great, but the `hold!` wasn't detailed very well in the documentation. In fact another user had [created an issue](https://github.com/evanphx/benchmark-ips/issues/85) for the project trying to figure out how to properly use the `hold!`. I decided to read through the source code to figure it out and verify that it could do what I needed.

### PR with example benchmark-ips `hold!` Usage

Well long as I take the time to figure it out, and I know others have struggled to understand the usage. We might as well try to make the usage clear to everyone. The project has an [examples folder](https://github.com/evanphx/benchmark-ips/tree/master/examples) detailing several usages. Adding a small [PR with a hold usage example](https://github.com/evanphx/benchmark-ips/pull/86), gave a simple usage scenario. Which was a simplified version of the approach I used to benchmark the Ruby `Coverage` library performance impacts in Coverband.

# Updated Benchmark Conclusions

After fixing the bug, benchmarking `Coverage` is still very interesting. Even small changes in when `Coverage` is started and which files are required, can have a massive impact on the overall performance. Take a look at diff below, which shows moving a single line `require 'classifier-reborn'` to be above or below when we require and start `Coverage`, which means the libraries code is either included or not in the `Coverage` collection.

```shell
-    require 'classifier-reborn'
     if ENV['COVERAGE']
       puts 'Coverage library loaded and started'
       require 'coverage'
       ::Coverage.start
     end
+    require 'classifier-reborn'
     require 'redis'
     require 'coverband'
     require File.join(File.dirname(__FILE__), 'dog')
```     

The first benchmark shows when `classifier-reborn` is required prior to setting up `Coverage` and therefor it's data is excluded from the results.

```shell
rake benchmarks:compare_coverage
comparing with Coverage loaded and not, this takes some time for output...
Coverband Coverage configured with to use default Redis store
Warming up --------------------------------------
           coverband     1.000  i/100ms
Calculating -------------------------------------
           coverband     11.950  (±16.7%) i/s -    140.000  in  12.041935s

Pausing here -- run Ruby again to measure the next benchmark...
Coverband Coverage configured with to use default Redis store
Warming up --------------------------------------
        no coverband     1.000  i/100ms
Calculating -------------------------------------
        no coverband     14.497  (±20.7%) i/s -    161.000  in  12.020487s

Comparison:
        no coverband:       14.5 i/s
           coverband:       12.0 i/s - same-ish: difference falls within error
```

In this second benchmark we ensure the `Coverage` library is loaded and started prior to requiring `classifier-reborn`, which means we are capturing all the usage of that library code.

```shell
rake benchmarks:compare_coverage
comparing with Coverage loaded and not, this takes some time for output...
Coverband Coverage configured with to use default Redis store
Warming up --------------------------------------
           coverband     1.000  i/100ms
Calculating -------------------------------------
           coverband      9.117  (±11.0%) i/s -    109.000  in  12.108073s

Pausing here -- run Ruby again to measure the next benchmark...
Coverband Coverage configured with to use default Redis store
Warming up --------------------------------------
        no coverband     1.000  i/100ms
Calculating -------------------------------------
        no coverband     14.184  (±14.1%) i/s -    164.000  in  12.017139s

Comparison:
        no coverband:       14.2 i/s
           coverband:        9.1 i/s - 1.56x  slower
```

In these examples the only difference is that the library `classifier-reborn` is either included in the recorded coverage or ignored by the `Coverage` library, based on when we require it. The improved benchmark code:

* is easier to read than it was previously (both code and benchmark output)
* it clearly captures and allows for easy performance tests of Coverband using `Coverage`
* It makes easily clear how much of a win `Coverage` is over the older `TracePoint` API 
   *  `Coverage` showing either no diff or 1.56x slower (depending on the coverage scope)
   *  `Tracepoint` showing around 3.95x slower

### Full Benchmark Output

Here is the full benchmark comparison output across all benchmarked configurations of Coverband.

```shell
Coverband tracepoint configured with file store
Warming up --------------------------------------
           coverband     1.000  i/100ms
        no coverband     1.000  i/100ms
Calculating -------------------------------------
           coverband      3.348  (±29.9%) i/s -     39.000  in  12.095922s
        no coverband     13.921  (±21.6%) i/s -    160.000  in  12.048469s

Comparison:
        no coverband:       13.9 i/s
           coverband:        3.3 i/s - 4.16x  slower

Coverband tracepoint configured with default Redis store
Warming up --------------------------------------
           coverband     1.000  i/100ms
        no coverband     1.000  i/100ms
Calculating -------------------------------------
           coverband      3.726  (± 0.0%) i/s -     45.000  in  12.286824s
        no coverband     14.736  (±27.1%) i/s -    150.000  in  12.059519s

Comparison:
        no coverband:       14.7 i/s
           coverband:        3.7 i/s - 3.95x  slower

comparing with Coverage loaded and not, this takes some time for output...
Coverage library loaded and started
Coverband Coverage configured with to use default Redis store
Warming up --------------------------------------
           coverband     1.000  i/100ms
Calculating -------------------------------------
           coverband     12.173  (±16.4%) i/s -    143.000  in  12.017026s

Pausing here -- run Ruby again to measure the next benchmark...
Coverband Coverage configured with to use default Redis store
Warming up --------------------------------------
        no coverband     1.000  i/100ms
Calculating -------------------------------------
        no coverband     15.045  (±13.3%) i/s -    177.000  in  12.024386s

Comparison:
        no coverband:       15.0 i/s
           coverband:       12.2 i/s - same-ish: difference falls within error
```

### Driving Performance Impact Improvements Based on Learnings

Now with an ability to detect performance differences when running Coverband with Ruby's `Coverage` library, I can build features and benchmarks to show how to reduce the performance impact on real world use cases.


For example in general with Coverband the goal is to show the coverage of application code ignoring framework and gem code. Knowing that which files are loaded at what time related to `Coverage` start can impact performance. I can build a feature to ensure that Coverband sets the `Coverage` library to ensure __ONLY__ the application code is being tracked by `Coverage`, which will help ensure the lowest possible performance impact.


I will be working on this feature (Coverband Safelist) and new benchmarks to show how much application developers could reduce the performance burden on standard Rails apps by using a Safelist. Opposed to allowing various Rails framework code to be tracked along side their application code which is required by the current version of Coverband, given how Rails loads code. Look forward to another post, when that feature and benchmarks are ready.
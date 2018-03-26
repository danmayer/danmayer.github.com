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

### Rails

* [Docs on previous Rails applications Performance Testing](http://guides.rubyonrails.org/v3.2.13/performance_testing.html)
   * Oddly I can't find anything that seems to work with modern Ruby and Rails libraries  

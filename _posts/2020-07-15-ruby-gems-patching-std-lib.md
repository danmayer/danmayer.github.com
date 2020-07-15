---
layout: post
title: "Ruby: Patching StdLib in Gems"
image: /assets/img/patches.jpg
category: Ruby
tags: [Ruby, Gems]
---

{% include JB/setup %}

![Bugs](/assets/img/patches.jpg)

> photo credit [patches: AnnaER @pixabay](https://pixabay.com/photos/hand-labor-sew-patchwork-187951/)

# Why Patch Ruby StdLib Code in Gems

Well, the Ruby community does this a lot, it can unlock powerful enhancements, features, observability, and more... 

Here are some examples of patching Ruby's StdLib (standard library). Let's just look at a few that patch a single piece of Ruby, `Net::HTTP`. Many libraries want to tap into what is happening around the network.

* DataDog's [dd-trace-rb](https://github.com/DataDog/dd-trace-rb) gem, patches many [Ruby StdLib features like Net::HTTP](https://github.com/DataDog/dd-trace-rb/blob/master/lib/ddtrace/contrib/http/instrumentation.rb#L16)
* [MiniProfiler](https://github.com/MiniProfiler/rack-mini-profiler) also patches [Net::HTTP](https://github.com/MiniProfiler/rack-mini-profiler#nethttp-stack-level-too-deep-errors)
* [WebMock](https://github.com/bblimke/webmock) in tests patches [Net::HTTP](https://github.com/bblimke/webmock/blob/master/lib/webmock/http_lib_adapters/net_http.rb#L16)

Sometimes opposed to patching upstream Ruby code, one can just have adapters/wrappers around them, while related it is a much different approach and you can see how [Faraday handles adapting Net::HTTP](https://github.com/lostisland/faraday/blob/master/lib/faraday/adapter/net_http.rb) as an example of that approach. Which is safer, but requires upstream apps to change their code to use the libraries' APIs as opposed to modifying existing behavior.

# Gems Patch Ruby StdLib, So What?

The problem comes up with multiple gems trying to patch the same method. From the examples above, there are multiple ways to attempt to modify the original code, which doesn't always play nicely together.

* `alias`, `alias_method`, and the like
* `prepend`, class/module extension ways of extending a method and using `super`
* `replacing constants`, I don't know the common term for what [WebMock does to patch Net::Http](https://github.com/bblimke/webmock/blob/master/lib/webmock/http_lib_adapters/net_http.rb#L16)

If you have multiple gems patching the same upstream Ruby StdLib (or Rails) class or function, you can run into issues. This is a known [Ruby 'Bug'](https://bugs.ruby-lang.org/issues/11120) along with a known solution to detect and patch in the same way.

# Example: Errors: stack level too deep

The reason I am writing this up is that I had a [bug in Coverband for months](https://github.com/danmayer/coverband/issues/367), thx bug reporters([@](https://github.com/kejordan)) I appreciate it, that made no sense to me... I couldn't reproduce it, I didn't have any great stack traces, I had no idea what area of code the issue was even in... I couldn't even investigate the issue. At the time all I really knew about the bug? Exception: `Stack level too deep error`.

After months, of once in awhile taking a look but not understanding the problem... I got a new bug report from [@ hanslauwers](https://github.com/hanslauwers)... Which, added some details, specifically that the gem [AirBrake](https://github.com/airbrake) and [Coverband](https://github.com/danmayer/coverband), both were patching Resque... but in different ways...

A few days prior to the above report, I saw while working on another project this excellent description of a problem that had been solved in the [MiniProfiler](https://github.com/MiniProfiler/rack-mini-profiler) project, the readme documents how to resolve [Net::HTTP stack level too deep errors](https://github.com/MiniProfiler/rack-mini-profiler#nethttp-stack-level-too-deep-errors)... So the new bug report made my spidey sense tingle, and I was finally able to fix it.

# How to handle applications differences

I ended up following the same pattern as [MiniProfiler](https://github.com/MiniProfiler/rack-mini-profiler), which described the problem and the fix excellently in [it's readme](https://github.com/MiniProfiler/rack-mini-profiler#nethttp-stack-level-too-deep-errors).

> If you start seeing SystemStackError: stack level too deep errors from Net::HTTP after installing Mini Profiler, this means there is another patch for Net::HTTP#request that conflicts with Mini Profiler's patch in your application. To fix this, change rack-mini-profiler gem line in your Gemfile to the following: 
> 
> ... examples ...
> 
> This conflict happens when a ruby method is patched twice, once using module prepend, and once using method aliasing. See this ruby issue for details. The fix is to apply all patches the same way. Mini Profiler by default will apply its patch using method aliasing, but you can change that to module prepend by adding require: ['prepend_net_http_patch'] to the gem line as shown above.

The readme, explains the issue, has code examples for how app's integrating the gem can resolve the issue, and links to the original [Ruby "Bug"](https://bugs.ruby-lang.org/issues/11120), which explains the issue in detail and discusses approaches to solve the problem

# Coverband's Patching Solution

This is the [PR that was merged](https://github.com/danmayer/coverband/pull/383) after understanding the problem and approach I took to resolve the problem. Again, heavily patterned off the MiniProfiler solution.

In the end, it is a pretty simple fix, but it took time and various folks participating in the bug report to understand. If you see an open github issue that still seems relevant, add some comments and details. You never know if you will be the trigger that helps folks understand and resolve the issue.

I know patching always gets a bad wrap in Ruby, and it can be hard to fully understand and debug, but it is also extremely powerful. It is good to understand the gotcha's that can occur, and how to work around those issues, especially if you are shipping shared code that can patch other shared code like Ruby's StdLib.
 

---
layout: posttail
authors: ["Dan Mayer"]
title: "Coverband Production Code Coverage"
image: https://raw.github.com/danmayer/coverband/master/docs/coverband_details.png
category: Ruby
tags: [Ruby, Metrics]
---
{% include JB/setup %}

Rubyists have long used code coverage to help guide development. While our coverage reports are generated from tests, I wanted to see coverage of the production system as it was getting exercised by our users. After discussing with a number of developers and some failed attempts, I built [coverband](https://github.com/danmayer/coverband) to record production code coverage.

## Why production code coverage

Dead code is a bug waiting to happen. It makes reasoning about a system more complicated, maintaining large codebases is hard enough without thousands of lines of un-executed code.

If your team is managing an aging production system, a rotating group of developers and years of refactoring can create many dead code paths. It is often easy to find all the endpoints being used with data from [New Relic](http://newrelic.com), or any other web analytics. It is much harder to find all the helpers, unused model methods, and other code that has been refactored out of use. Using Coverband, we have found entire models which no longer get executed by any code path, but still had test coverage. It also made it easy to see conditional paths which are no longer followed in all directions. Dead code often has test coverage slowing your test suite, and occasionally developers have to spend time maintaining or fixing it when upgrading Ruby versions or frameworks. The less code you have the easier a system is to reason about, and the more clear the abstractions become.

## How Does it work

Initially I was trying to use Ruby's standard library [Coverage](http://www.ruby-doc.org/stdlib-1.9.3/libdoc/coverage/rdoc/Coverage.html). I tried to use Coverage on both Ruby 1.9.3 and Ruby 2.0 and ran into issues with it crashing. It didn't seem to play nicely with the idea of sampling the requests. It would often run smoothly for a short while, but would eventually segfault even on tiny example applications.

This led me to look for other solutions. Eventually I came across [set_trace_func](http://ruby-doc.org/core-1.9.3/Kernel.html#method-i-set_trace_func), which was added in 1.9.x to give Ruby some basic tracing functionality. This has been improved for Ruby 2 with the [TracePoint](http://www.ruby-doc.org/core-2.0.0/TracePoint.html) api. While there are a few weird quirks with Ruby tracing where it doesn't quite capture everything you expect, in general it works very well to allow capturing live code usage. Coverband uses a combination of Stdlib's `Coverage` to take a small baseline measurement of code executed while booting. Then it uses a [Rack::Middleware layer](https://github.com/danmayer/coverband/blob/master/lib/coverband/middleware.rb) enabling `set_trace_func` to get runtime coverage.

Since collecting the coverage data does have a performance overhead, I wanted to be able to slowly gather data without affecting all requests. So Coverband implements a sampling strategy allowing a small percentage of requests to be monitored. On smaller apps, I have a large percentage of requests being sampled while on large, high traffic sites I have been running Coverband with as little as 1% sampling and am still collecting very useful data.

While I think there are various improvements that can be made to Coverband, after running it on a few production projects it has already proved to be useful. Our team has been able to find large chunks of unexecuted code, leading to a series of my favorite commits, the elusive negative change commit.

This post will not cover the full usage and setup, as Coverband is under active development. The current detailed instructions can be found in the project's Readme. If you want to try it out, follow the setup instructions on the [Coverband github page](https://github.com/danmayer/coverband). Any issues or feature requests can be passed along as github issues.

## What do you get

To avoid reinventing the wheel, Coverband coverage output looks just like most Ruby users have come to expect. It outputs in a [Simplecov](https://github.com/colszowka/simplecov) compatible format. This makes it easy to use any [Simplecov formatter](https://github.com/danmayer/coverband/blob/master/lib/coverband/reporter.rb#L51), which is what Coverband does by default.

{% unless page.image %}
![image](https://raw.github.com/danmayer/coverband/master/docs/coverband_details.png)
{% endunless %}

##### Thanks Livingsocial

This post is a cross-post about [coverband on the Livingsocial tech blog](https://techblog.livingsocial.com/blog/2013/12/17/coverband-production-ruby-code-coverage/). I work at Livingsocial and we are hiring. At work we are using coverband in production on some applications to help drive refactoring and cleanup efforts.
---
layout: post
title: "Flaky Ruby Tests"
image: /assets/img/flaky_paint.jpg
category: Ruby
tags: [Ruby, Testing]
---
{% include JB/setup %}

# Restoration of a Ruby Test Suite

I want to talk about some recent work to restore a Rails app's test suite to a usable state. The goal went beyond the test suite, to restoring trust in the continuous deployment pipeline, but this post will mostly focus on the Rspec suite. The reason I started on this work was that the current state of deployment was "dangerous", various folks preferred to avoid the project as it was difficult to work in and release, but still critical to our overall architecture. At it's very worst, deploys were taking over 30 minutes, with a failure rate of the deployment pipeline of 45%. The issue became clear and high priority to me when one day, I had two small PRs to release, due to bad luck with the failure rate, it took me nearly 6 hours to get my changes deployed. A constant distraction that dragged on through meetings, and other work. Making the pains of the team extremely clear and personal, I decided an effort to get things back into a safe state should be taken on.


I wanted to share some of what I learned as there has been some recent discussion in the Ruby community about fixing flaky tests [@samsaffron](https://twitter.com/samsaffron/status/1125907310109323266) [@tenderlove](https://twitter.com/tenderlove/status/1167478551370592256) [@ctietze](https://twitter.com/ctietze/status/1137064436961820673) [@SonjaBPeterson](https://twitter.com/rubylandnews/status/1121554960142012416) [@saramic](https://twitter.com/saramic/status/1143617541048172544).

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Over the years one of the most complex liabilities we carried in our test suite has been flaky tests. This problem is so hard some people just give up. We are slowly cataloging the problems here: <a href="https://t.co/7AdwOGNfNw">https://t.co/7AdwOGNfNw</a> , I hope to write about it.</p>&mdash; Sam Saffron (@samsaffron) <a href="https://twitter.com/samsaffron/status/1125907310109323266?ref_src=twsrc%5Etfw">May 7, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# A Restoration Plan

Taking a step back, thinking about what needed to happen and how to get there was the first step. I thought this would fit in well to the old agile advice...

> Make It Work. Make It Right. Make It Fast.  
> - [Kent Beck](https://thetombomb.com/2018/05/17/make-it-work-make-it-right-make-it-fast/)

# Make It Work

What didn't work about the deployment? In my opinion, it was broken because:

* doesn't meet a 95% or better success rate
* deploys are too slow, to watch and review if changes succeeded, 10 minutes of less
* test suite relying on CI parallelism is to slow to ever run locally, local suite run needs to be possible in 1hr or less.

With a definition of what success looks like to make it work, then I was able to start to dig into the details of how to get there. 

## Delete Flaky Tests That Aren't Valuable

This is often a hard one for some teams. An honest discussion of the purpose and value of tests is likely needed. I found good success by having a small PR removing a few flaky tests, and pointing to similar tests in the suite that exercised functionality in a more reliable way. For example, moving from a complete feature spec that tested several endpoints in a long workflow, to a couple of feature tests exercising individual endpoints, along with unit tests for the underlying service providers. The team might need to have a discussion ahead of time, or you might be surprised that others quickly agree that really flaky tests aren't providing value.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Flaky tests are worse than useless tests</p>&mdash; Aaron Patterson (@tenderlove) <a href="https://twitter.com/tenderlove/status/1167478551370592256?ref_src=twsrc%5Etfw">August 30, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


## Fixing Flaky Tests

The primary cause of our unstable deploy pipeline was flaky tests. Given we were having deployments fail 45% of the time we had a large number of flaky tests causing issues. Let's dive into some of the techniques for resolving flaky test failures.

![Flaky Paint](/assets/img/flaky_paint.jpg)
> - [andrewhalliday](https://www.flickr.com/photos/andrewhalliday/4599220963/in/photostream/)

### Divide and Conquer, with Rspec-Retry

> Initially quarantine helps to reduce their damage to other tests, but you still have to fix them soon.  
> - [Martin Fowler, Eradicating Non-Determinism in Tests](https://martinfowler.com/articles/nonDeterminism.html)

Since before I joined the project, it has used [rspec-retry](https://github.com/NoRedInk/rspec-retry) as a way to isolate some flaky tests. Yes, this is a band-aid, but in terms of getting back to a "make it work" baseline, it is a wonderful tool. This is how I used it. For a period of about a month, I watched every failure on our CI spec suite. Every time a test failed more than once, I would add it to an internal wiki marking the test as flaky. Myself and other folks from the team, when they had time, would "adopt" a test and try to fix it, if one timeboxed an hour or two and couldn't figure out and fix the underlying issue, we would tag it flaky, so that `rspec-retry` would run the test multiple times trying to achieve success. We ran our `flaky` tag specs in a special CI job, `bundle exec rspec --tag retry_flaky_test` isolated from our other tests. This CI job had a success rate of 99%, so the flaky tests would pass on retry, and be split off from others. Then with logging, and debugging we could dig in deeper in resolve the underlying issues and move the test back into the standard test suite. This is great because it very quickly got the test suite back into usable condition and tags all the future work still needing to be addressed and captures metrics about which tests are most flaky, or no longer are flaky as we resolve issues. At our current stage, we still need to go back and resolve a number of flaky tests, but they no longer slow down or block our CI.

__Isolate Flaky Test Recipe:__

* capture data and identify flaky tests (use metric tracking, or just eyeball if from your CI history)
* quickly try to fix them timeboxed to a short amount of time
* if you can't fix them, tag them for `rspec-retry`, to isolate them and remove them as a blocker for CI
* Find a way to distribute this process across folks on the team, and explain the plan on how to follow through with cleanup.

### Fix the Worst Offenders

From above you likely will find some worst offender tests or hopefully patterns that impact multiple tests. These even with flaky test `rspec-retry` may still fail to often to be reliable. If you dig into a few of the tests (during the timeboxing) you are likely to find some patterns. For example [@TildeWill](https://twitter.com/TildeWill), fixed a whole class of flaky tests related to Capybara negative matchers. We also fixed entire categories of failing tests that weren't properly using [Capybara's asynchronous matchers](https://github.com/teamcapybara/capybara#asynchronous-javascript-ajax-and-friends), each of these fixes added around 6% to the success rate of our CI suite per PR.

### Common Flaky Test Issues

I won't cover all the various types of flaky tests in as much detail as you can find in [@samsaffron](https://twitter.com/samsaffron)'s post, [Tests that sometimes fail](https://samsaffron.com/archive/2019/05/15/tests-that-sometimes-fail). Here are some of the most common issues we found while resolving issues.

* fix timing issues (timezone dependant)
* stale state issues due to non DB stores (global vars, redis, memcache, Rails.cache, etc)
* fix order / dependency issues... Tests that only pass in a specific order
  * running specs in documentation mode can really help find ordering issues... Run it this way every time so you have a clear log of what ran when ``time bundle exec rspec --format documentation`
* Capybara
  * devise auth issues [1](https://github.com/plataformatec/devise/wiki/How-To:-Test-with-Capybara) [2](https://github.com/plataformatec/devise/wiki/How-To:-sign-in-and-out-a-user-in-Request-type-specs-(specs-tagged-with-type:-:request))
  * not using the [aysnch matchers](https://github.com/teamcapybara/capybara#asynchronous-javascript-ajax-and-friends)
     * example:  `expect(page.current_url).to eq(/something/)` is bad, switch to waiting version `expect(page).current_path.to eq(/something/)` which is good.
  * using sleep opposed to correct waiting matchers
  * in geneal `wait_for_ajax` is dangerous
* VCR allowing non-stubbed network requests can be dangerous, try to get your suite passing with, `VCR.configure { |c| c.allow_http_connections_when_no_cassette = false }` 

### Tips and Tools to Fix Flaky Tests

A few tips to help debug and fix flaky tests. I found each of these scripts extremely valuable in moving forward our success rate.

#### Single Flaky Test Case

Quickly, verify a test that fails randomly even in isolation, with this great tip.

> ![Bugs](/assets/img/spec_check.png)   
> from [@_swanson](https://twitter.com/_swanson/status/1161734593730568198)

#### Single Flaky Spec File

Quickly, check the success rate of a single file. I use this to report a before and after of a fix in a PR.

<script src="https://gist.github.com/danmayer/d28c98a6b6cd2882bf90102bd76f0cbf.js"></script>

#### Calculate Success Rate of a Branch on CircleCI

Push a fix on a branch and run it a number of times to see if it improves the overall success rate.

<script src="https://gist.github.com/danmayer/4f3dd95adf2d01fb5b37b45b6ddc2515.js"></script>

### Additional Resources on Resolving Flaky Tests

* [BuildPulse](https://buildpulse.io/), software service that helps identify flaky tests.
* [Capybara Cheat Sheet](https://devhints.io/capybara), ensure you are following the best practices, to avoid common mistakes.
* [Write Reliable, Asynchronous Integration Tests With Capybara](https://thoughtbot.com/blog/write-reliable-asynchronous-integration-tests-with-capybara)
* [Capybara::SlowFinderErrors](https://github.com/ngauthier/capybara-slow_finder_errors)

# Make It Right

Most of the remaining work on restoring this test suite now falls into this category. The deployment pipeline succeeds at over a 95% success rate at around 10m. These are acceptable numbers for our project. What we haven't done is resolve all of the flaky tests which pass because of retry attempts. Until we can move all the tests to be fully reliable there is work to be done. 

# Make It Fast

I will dive into this more in a future article, but with some effort, the team was able to get our CI deployment pipeline down from over 30m on avg to only taking 10m on average. The CI jobs to run just our tests are down around 5m, with the full deployment jobs taking longer. I expect as we continue to make improvements and fix some of the known bad actors in our test suite, this number will continue to go down. Why did we make so much progress on "Make It Fast" before finishing "Make It Right"? Well, we needed a better and faster feedback loop to find and fix flaky tests, as well as to make it right. A fast feedback loop is really required to make progress quickly. Until we could increase the iteration cycles, we could only have so many flaky fix PRs make it through the pipeline in a day, and at the beginning testing locallt wasn't really possible. In terms of make it fast, I did want to mention there are still two efforts under way.

## Local Test Suite Speed

If the test suite it to slow to ever run locally it is also hard to test and ensure it reliably runs anywhere other than on CI. Initially, the test suite was so slow, it would either crash or stall out most of the time. Occasionally with many failures, it would complete after 9+ hours... After using CI to drive most of the fixes, now the local spec suite reliably runs on a single machine in 45 minutes. This is still far to slow for my liking but is headed in the right direction.


## Deployment Pipeline Improvements

The CI deployment pipeline is the test suite, but also much more. This article isn't going to focus on deployment improvements but without changes related to the tests or fixing flaky test failures. Various improvements cut our deployment in a third, I will detail this more in a future article. This involved breaking down all the continuous deployment steps finding inefficiencies, redundancy, and improving parallelization.
---
layout: post
title: "Serverless Thoughts"
image: /assets/img/ladybugs.jpg
category: Ruby
tags: [Ruby, Rails, Performance, Benchmarking, Coverband]
---
{% include JB/setup %}

## Why Serverless is confusing

honestly, I think serverless is a great and amazing paradigm for web development. I think it might be one of the next big new things but it screws up ALL the work we have been doing the last few years which is hard to swallow and it doesn't build on top of any learnings it builds on JS, which is basically a F' that we don't need to learn from the past we will re-learn everything the hard way language.

#### The last few year	s

So the last few years web developers, Rubyists, etc were like we need to be highly scalable, concurrent, able to maximize our resources... Lots of people have flooded elixir, Clojure, and scale to do just that... laughing at the old way of doing things and how Rails again can't scale in a WebSocket world to real-time streams... etc etc... so here is the thing maximizing a computer efficiency or even a few to full CPU and Memory usage hasn't generally been the problem... never has never will... scaling a bit is annoying but not where we will see major wins in how we think about building our applications... and scaling inside one machine or horizontally... is great but still is an older way of thinking that doesn't match serverless.

#### Why not

So let's look at Clojure which makes it really easy to have lots of concurrent processing going on to speed up various things... if you are blocked on DB or microservices, not a bit help, you can hold more connections per machines but really a web request shouldn't and generally doesn't need to optimize across 32 processors... sure there are some small wins when you do that on all your mapping etc... but really in the web word how many web requests can optimize 32 processors for a request... most shouldn't they should use let and keep more in memory. 

### Serverless is an entirely different concept than scaling single machines or network machines

Elixir is like we are optimized to do communications not just multiple CPU systems... fine... sure.. but elixir and Pheonix as currently designed expect the same network of computers with hot swapped code and can't really leverage the concepts introduced by fanning out serverless requests.


### What is new in serverless?

It is just a function... 

Well yes, but second to second pricing etc on functions where you can optimize each critical path expensive function to the best tool, language, etc for the job... you can reroute different params to different functions as an optimization you can build AB testing into the orchestration opposed to the language. You red/green deploy singled functions reducing risk... you roll ou function changes to a percentage of users... etc...

### Um, ok neat... so

Well I want to take advantage of those concepts but the frameworks aren't there... today you can barely find the debug of testing support that you get out of the box for many other frameworks... but the ability and functions for tomorrow are very obvious and there is a path to them for the well thought out framework abstracted from real-world usage... that is when Serverless stops being interesting or a cost-saving measure and starts to become a new way to think about programming and more importantly language design, features, and performance optimizations... Trust me on perf with a cold start the initial load time is a key performance metric.

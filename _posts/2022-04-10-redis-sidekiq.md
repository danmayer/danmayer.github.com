---
layout: posttail
authors: ["Dan Mayer"]
title: "Redis & Sidekiq"
image: /assets/img/redis-logo.png?cache=1
category: Ruby
tags: [Ruby, Redis, Notes, Tips]
---

{% include JB/setup %}

# Redis & Sidekiq

A collection of notes about working with Sidekiq and Redis. A previous post about [Ruby & Redis](https://www.mayerdan.com/ruby/2022/03/26/ruby-redis), briefly touched on some things, but I will get into more specifics in this post.

# Redis and Background Jobs

A common usage of Redis for Rubyists is for background jobs. Two popular libraries for jobs are [Sidekiq](https://github.com/mperham/sidekiq) and [Resque](https://github.com/resque/resque). At this point, I highly recommend Sidekiq over Resque as it is more actively maintained and has more community support around it. I am not going to get into too many specifics of Sidekiq and Resque, but talk a bit more about how they use Redis. There are always some gotchas when working with Redis, ask folks about sometimes an incident that occurred because of a `keys`, `flushall`, or `flushdb` command. Some of these commands are destructive which is always something to be careful with, but they also all have very slow performance characteristics. It is worth noting how some of the calls in Resque and Sidekiq scale with queue depth, which is critical to understand.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">One of the most desirable properties in queue or stream based systems is increased efficiency as the queue depth grows. Without that property, slight mode shifts can push the system into the state of perpetually growing backlog. Who here hasn&#39;t a seen a graph like this: 1/ <a href="https://t.co/opKuB7Y9tA">pic.twitter.com/opKuB7Y9tA</a></p>&mdash; Joe Magerramov (@_joemag_) <a href="https://twitter.com/_joemag_/status/1511027555813318658?ref_src=twsrc%5Etfw">April 4, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# A Incident Caused by our Sidekiq/Redis Observability

__UPDATE:__ We no longer think the line below is the culprite, we observe latency growth and decline with queue size, but we are unsure of the cause and unable to reproduce. As seen, in the `NOTE` above the Sidekiq latency call is `O(1+1)` and therefor fast and predictable.

We got into trouble when moving from Resque to Sidekiq because our observability instrumentation was frequently making an `O(S+N)` call (Sidekiq's queue `latency`). It wasn't much of a problem until we had one of our common traffic spikes that results in a brief deep queue depth. Our previous Resque code didn't have any issues and had some similar instrumentation being sent to Datadog. While our Sidekiq code had been live for days, this behavior where our processing speed decreased with queue depth hadn't been observed or noticed. The problem came to light when on a weekend (of course) a small spike caused a background job backlog, as we an expected common case. The latency went way up due to our instrumentation and we started processing jobs slower than we enqueued them. This fairly quickly filled our entire Redis leading to OOM errors.

![Redis Sidekiq Analytics](/assets/img/redis_sidekiq.png)
> Analytics Monitoring our Recovery

These charts are from after the incident. We moved to a new Redis to get things back up and running during the incident, and after things were under control worked on draining the old full Redis, in a isolated way that couldn't impact production load. In this graph, you can see as we reduce the queue size the latency of our Redis calls also reduces in step. I included CPU to show how hard we were taxing our Redis, this chart isn't 1:1 as we were adding and removing workers and making some other tweaks, but the queue size -> latency is a direct correlation. 

## Code Culprite

__NOTE: Update Mike responded that he doesn't think the `latency` call is the [issue so we are further investigating](https://github.com/mperham/sidekiq/issues/5282)__


__UPDATE:__ We no longer think the line below is the culprite, we observe latency growth and decline with queue size, but we are unsure of the cause and unable to reproduce. As seen, in the `NOTE` above the Sidekiq latency call is `O(1+1)` and therefor fast and predictable.


As mentioned it wasn't any of our normal code that was really the problem, it was this line that was part of our instrumentation and observability tooling. `Sidekiq::Queue.new(queue_name).latency`. As with any incident, there were a ton of other related things, but it is worth noting that this seemingly simple line could have some hidden gotchas or an outsized impact on your Redis performance. As that `latency` call scales linearly with queue size, it is calling Redis's [`Lrange`](https://redis.io/commands/lrange/) under the hood which is an `O(S+N)` operation.

# Sidekiq / Redis Performance

A colleague [@samsm](https://twitter.com/samsm), helped dig into this incident by putting together the queue size -> latency charts above as well as all the helpful tables I am sharing below. These showe how Sidekiq calls translate into their Redis implementation operation details and the operational costs.

## Redis / Sidekiq Math

Doing the math on various Sidekiq operations: how much will they impact Redis?

## Big O Complexity Notation 101

[Big O Notation](https://www.honeybadger.io/blog/a-rubyist-s-guide-to-big-o-notation/)

![Redis Big O](/assets/img/redis_big_o.png)

## Sidekiq Operation Complexity

![Redis Sidekiq Mapping](/assets/img/redis_sidekiq_map.png)

# Additional Sidekiq / Redis Reading

Some additional reading if you want to dig in further on working with Sidekiq and Redis

* [Sidekiq Best Practices](https://github.com/mperham/sidekiq/wiki/Best-Practices) has some useful tips and calls out gotchas
* [Sidekiq in Practice](https://nateberk.gumroad.com/l/sidekiqinpractice) book, fastest way to get it right the first time if you are just learning Sidekiq
* [Blog Post on Sidekiq testing](https://sloboda-studio.com/blog/testing-sidekiq-jobs/)
* [Sidekiq Testing Wiki Entry](https://github.com/mperham/sidekiq/wiki/Testing)
* [Redis Commands Documentation](https://redis.io/commands/)
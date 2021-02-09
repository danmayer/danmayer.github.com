---
layout: post
title: "Learning with Game Days"
image: /assets/img/football-gameday.jpg
category: Management
tags: [Team, Management, Tech, Learning]
---

{% include JB/setup %}

![performance](/assets/img/football-gameday.jpg)

> photo credit [Neramitevent@pixabay](https://pixabay.com/photos/football-colored-sports-gear-1166205/)

# Learning with Game Days

Many different companies and posts talk about why and how to run Game Days. I won't rehash all of that in this post, instead I will give a basic intro and link to some sources then dive into some more specific Game Days I have recently been involved with.

> A game day simulates a failure or event to test systems, processes, and team responses. The purpose is to actually perform the actions the team would perform as if an exceptional event happened

* [AWS Concepts Game Day](https://wa.aws.amazon.com/wat.concept.gameday.en.html#:~:text=A%20game%20day%20simulates%20a,if%20an%20exceptional%20event%20happened.)
* [New Relic How to Run a Game Day](https://blog.newrelic.com/engineering/how-to-run-a-game-day/)
* [How to Run a Game Day](https://medium.com/@rebeccaholzschuh/break-your-software-or-how-to-run-a-gameday-b68150188bb8) by [Rebecca Holzschuh](https://medium.com/@rebeccaholzschuh)

Below are a few recent Game Day examples, with some details of what we did, what we learned, how we broke something in a "safe" manner, and a runbook to run your own. In all cases, one important factor of running the Game Day is having a way to stop if the simulated incident starts to cause a real incident. When planning a simulated emergency make sure you have a planned way to escape out of the test if something unexpected is occurring.

## Safe and Confident Deployments

For various reasons some of our systems were relatively slow to deploy. This means if something bad happened, it could take awhile to revert, pass CI, deploy etc... We finally got access to a `rollback` tool which was much faster than the normal deploy process to jump back to a recently deployed version of the code. While the tool was available for awhile many folks had their first experience using it during a real incident! Trying to find docs and understand the commands while stressed about some service being broken. Not the ideal way to learn... We got a group together with a preplanned and scheduled time, we then broke a 'hidden' endpoint on production, used rollback, fixed the code and showed how to "roll forward" back into the standard development flow. Since our tool did a bunch of cool things like freezing the deploy when you roll back, alerting various folks that it was going on, etc we got to see and feel the full experience. We had folks running the commands who had never had to do a rollback in production before, which made the exercise really valuable.

### Runbook

* schedule with a group of interested folks
* announce to everyone in relevant channels so they don't believe a real incident is occurring
* deploy a non-important change
* roll back and verify all the alerts, notifications, and commands
* watch dashboards confirming how quickly the rollback worked and shows how to monitor deploy progress
* fix the non important change
* unfreeze deploys (if your system supports something like this)
* deploy the main branch and restore the standard flow.

## Upstream Partner Timeouts

We have a feature that I will cover more at some point in a future post, called chaos traces, similar to chaos monkey it lets you inject some chaos into your system to see how it behaves. In this Game Day, after the release of a new partner integration, we used our chaos trace tool to validate how the integration handle timeouts and errors. The code author and the PR reviewer paired up following the deploy and used chaos traces to verify that when the integration had an API Error or if the integration was running slow that the app handled it how everyone expected. By injecting say 3 seconds of latency into the respond time, we verify that the app would handle the timeout and give the customer a reasonable UX experience.

### Runbook

* schedule with a group of interested folks
* announce to everyone in relevant channels so they don't believe a real incident is occurring
* cause partner error scenarios (if you  don't have chaos functionality a feature flipper, or ENV toggle may work)
* watch dashboards confirming expected logs / metrics
* screen shot / share the UX experience of the error states with the team
* have confidence that edge case integrations are not leaving users stuck in a confusing state

## Simulating Traffic Spikes

I didn't participate directly in this Game Day, but I helped write some of the code and reviewed PRs. As a new service was being integrated into a high traffic flow, before the new service went live the team wanted to load test it. In the past we have often used simulated load, but it is hard to realistically generate traffic that looks like production... We tried something new and did a Game Day around production load... The team had areas of site that would soon make the new experience visible fire and forget all get requests to the new services without displaying and results... They even had a scale factor so we took traffic on a normal day and generated 3X production traffic to the new backing service... Since all the requests were fire and forget it didn't slow down the user experience and let us work on performance tunning the new service under real heavy load.

### Runbook

* schedule with a group of interested folks
* announce to everyone in relevant channels so they don't believe a real incident is occurring
* have a feature toggle to enable or disable the fire and forget load
* enable and start to scale up the load factor
* watch dashboards
  * ensuring the Game Day isn't impacting existing services or users
  * learn how the new service response to heavy and increasing load and fix any performance issues
* toggle back off the simulated load, and move forward with confidence the new service can handle real traffic

## Cache Failures

Caching is hard, eventually you might have to break a bad cache... If this cache has data for a few million users, sometimes very bad things happen to performance while the system tries to rebuild a cache. This is a future Game Day, that we have not yet done, but are currently planning after running into a cache issue. We were able to quickly bust the cache and fix a service that was in a invalid state, but it got us thinking... As the service and data set keeps growing, how long can we rely on that? At what point will we break cache and start to see a cascading of timeouts throughout all of our client services as we buckle under the load... Seems like a perfect thing to Game Day, we plan to put a feature toggle in place to let us ramp up `cache_skips` for a percentage of requests. Turn up the dial and ensure we can hit 100% without to large of an impact to our performance and stability.

### Runbook

* schedule with a group of interested folks
* announce to everyone in relevant channels so they don't believe a real incident is occurring
* have a feature toggle turn up cache skips
* start to turn up while watching dashboards and dial back down if there is any unexpected performance issues
* identify any scaling issues and address and repeat until comfortable
* enjoy the confidence that next time someone needs to bust the entire cache it shouldn't be a problem

## Event Bus Failures

After some recent issues with our Event Bus, we put a number of protections in place that we thought would ensure our service could handle a significant unplanned outage without causing any interruption to clients. We made several changes to how we were handling events

* moving from synchronous to asynchronous sending of events where possible
* on any synchronous message queue retries in background jobs for later
* increase our background job storage to be able to handle millions of stalled and failed events waiting for recovery
* autoscaling background workers to be able to quickly process a big backlog of events without going to fast to overload the system

OK, great next time there is an incident our service will keep humming along without any issue... Well, would it really hold up? How could we be sure? Of course by now, y'all realize that instead of waiting for the next time our events queue has an incident, we can run a Game Day! That is what we did, we made a toggle to disable our access to the event queue server... Then flipped it off, we got to see if our protections worked verifying each doing what was expected... If we were wrong we could very quickly restore the system... During the incident the week prior, our internal background job storage overflowed in about 15m as we helplessly watched in horror... As we watched for 15 minutes during this Game Day our new monitor and connected alert showed the estimated time remaining we could buffer all events before running into problems. Showing how we could now handle hours of downtime, giving the teams plenty of time to get paged, and work on a resolution if needed.

### Runbook

* schedule with a group of interested folks
* announce to everyone in relevant channels so they don't believe a real incident is occurring
* toggle off access to the event queue service
* watch dashboards and improve any lacking observability to be confident in being able to understand your system
* scale up any resources that are more impacted than expected
* use the background job stalled jobs load to calculate and set alerts and storage needed for appropriate response times
* enjoy the confidence that next time the event service has unexpected maintenance your service won't drop any data and the services clients won't see any errors.


# Conclusion

Game Days can be used to work through what could be a difficult or exceptional situation in a controlled manner at a planned time and the support of a team. When done well, they can teach folks how to be better prepared for incidents, better understand their systems, and have more empathy for how other folks process and understand system in the stress of a real incident. They are a great way to ensure everyone on the team is ready when something unexpected next happens. 

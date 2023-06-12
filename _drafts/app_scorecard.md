---
layout: post
title: "Repo Health"
category: Programming
tags: [Programming, Development, APIs]
---
{% include JB/setup %}

I previously wrote about organizational health and strong ownership. It is hard to have strong ownerhship of code if it isn't clear who is responsible for a repo... Related it is hard to keep ownership and maintain a repo when one doesn't know what it does, or the value of the repo... The risks and rewards to take into account when working on the system and making trade-offs. The stronger ownership your code has and the less often code repositories move around the better and much of this knowledge will implicitly be known by the team... but over a decade plus of software development, it is easy to look back and realize there is a mess of code some of which might be entirely out of use, and other of questionable value... Do we need to maintain it? Do we need to rebuild domain knowledge? Who can immediately take over at least the on-call pager?

For all these things we need a way to talk about the health of a code repository. It helps one maintain good quality and hygene in good times, and when things are less clear it can help organizations make tough decisions with data... Like dropping support of a feature that might have outsized maintence and complexity costs vs the value it provides.

# Code Repository Metrics

Everyone knows there are a bunch of vanity metrics, and yes every metric can be gamed... I still think some metrics can be good signals, at least to help take a bit of a closer look.

* Recent Changes:
  * Dependency Updates: We have a dependency update policy requiring dependency updates at least once a month
  * Last Updated: If it hasn’t been modified for 1 year, clearly not updating dependencies, it should probably be archived
  * Last Deployed: If it hasn't been deployed perhaps the dependencies have been updated but the build is failing and it isn't being deployed... So again, probably should be archived.

* Repo Description: every repo must have a description that can help folks understand why it exists in our eco system

* Follows Development Quick Start Policies
  * bin/setup: within reason gets repo up and passing tests on a developer machine
     * bonus points: we recommend having a CI job run `bin/setup` on a bare machine
  * bin/start: runs the most common developer mode (ie boots a webserver and outputs the port)
    * bonus points: we also run this on CI and curl a endpoint to ensure the server starts successfully



* tbd

# Encouraging Collaboration

As many folks have ended up in ecosystems that might have a few more microservices than is a good idea. After a few years, re-orgs, and a normal cadence of folks moving on a number of repositories might be in poor health.

The repositories might have been moved from team to team and lost most of the historical knowledge and had the code quality atrophy over time. As folks work on new features, mainintaining old ones, and working on technical migrations... Eventually these small services will need updates. The easier you can make it for any developer that needs to make small contributions safely, the more likely you will be at successfull at seeing collaboration and lower friction migrations opposed to teams finger pointing about being blocked by some other group.

One easy way to help encourage small collaborative contributions is making sure it is easy to get up and running. Quickly going from `git clone` to being able to run tests and confidently make changes to the code base.

# Repo Health

* http://engineering-principles.onejl.uk/Self-Assessment.html
* SLO
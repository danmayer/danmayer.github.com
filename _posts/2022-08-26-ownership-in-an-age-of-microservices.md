---
layout: posttail
title: "Ownership in an age of microservices"
image: /assets/img/organizational_drift.png
category: Management
tags: [Management, Microservices, Tech, Resilience]
group: draft
---
{% include JB/setup %}

This is the second post in a series thinking about [organization structures](/management/2022/08/22/hr-org-dev-org), teams and ownership, and finally I will cover application health.

# Ownership challenges abound in microservices

While there are some great discussions about when  microservice are or are not a [good fit](https://www.martinfowler.com/bliki/MicroservicePremium.html), with recent examples of [Segment, moving back to a monolith](https://segment.com/blog/goodbye-microservices/). Here, I am going to focus on some of the unique challenges of ownership in microservices and some of the approaches where companies are making larger macro-services (these tend to be aggregation services focused on a specific domain) to help address the issue. For example, [Uber working towards macro-services with a Domain-Oriented Microservice Architecture](https://www.uber.com/blog/microservice-architecture/). One of the common problems called out as a pain point with microservices is ownership, both the Uber example and the [macro-service Domain aggregation evolution at AirBnB](https://medium.com/qe-unit/airbnbs-microservices-architecture-journey-to-quality-engineering-d5a490e6ba4f) are aiming to specifically improve the clarity and ownership of domains of data and the teams and services that support them.

# microservices and evolving models of ownership

There are many different models of ownership, and one of the reasons microservices took off was to avoid the tragedy of the commons that often occurs in large shared codebases. We break the systems apart to try to avoid shared codebases that tend to degrade over time. As companies moved to many smaller systems a number of different ownership models emerged:

* Single Owner
* Orphan codebase
* Modular Monolith
* Team Ownership (my preferred)
* Workgroup/Guild/Steering Committee Ownership

Along with some more modern code collaboration patterns

* Internal tickets
* Internal open-source (my preferred)
* Trusted outsider
* Tour of duty
* Embedded expert

These are all explained very well in a post [patterns of cross-team collaboration](https://blog.thepete.net/blog/2021/06/17/patterns-of-cross-team-collaboration/). I personally like team ownership acting as stewards of the long term vision and domain of services, influencing changes via an internal open-source model. The teams in these cases are similar to the primary contributors to open source projects.

# Ownership, strong ownership takes time

In the decomposed microservices world, I personally believe that having a team with a long history of knowledge building and maintaining an app will lead to better outcomes. The institutional knowledge of operating the service, feeds back into the development practices of the system. Learning how to avoid risk, anticipate needs, and more quickly and flexibly change and update the system over time. It also helps with communications, especially at times of incident response when everyone knows the team that owns an app and is confident that the team has deep knowledge of the system and will be able to support it. A stable relationship between business domain, services, and team brings clarity and shared knowledge of where responsibilities and vision for the domain belongs. In my last post, I explain how reorgs and diverging team names across systems causes [organizational drift](/management/2022/08/22/hr-org-dev-org) and confusion.

# Who is responsible for the Distributed Monolith?

One issue that comes up in microservices is the emergence of a distributed Monolith. As microservices have been around for a fairly long time at this point (in tech life cycles that is) there are places that have "legacy"  microservice systems, perhaps better called a distributed monolith. As a company first splits up a legacy monolith, they often make many learning mistakes (bad boundaries leading to distributed transactions) shortcuts (hello shared DB my old friend). The early set of services often have some winners that prove the value of well done extractions, as well as some less than ideal systems that make up a distributed monolith. The remains of the monolith that folks have failed to ever finish extracting. At some point, companies need to refactor, delete, and reduce the maintenance of microservices the same way companies end up building strategies to unravel or [modernize legacy monoliths, via Modular Monolith](https://shopify.engineering/shopify-monolith) and other techniques.

The problem with the poorly extracted and very tightly coupled services is they don't have clear domain boundaries and often are difficult to build up strong ownership and historical knowledge of. These services end up with the same tragedy of the common issues of a large shared code base.

As part of any thinking about reorgs, considering these systems is key. The new structure should have more clear domain boundaries, and make future ownership of those clear. A steering group, architects, etc can help think through high friction boundaries and make recommendations. Often, I see companies try to re-org only thinking about the new work, opposed to taking into account these hard to maintain poorly understood systems that create a lot of technical drag for any teams trying to own them, or any team that has feature requirements that have yet to be extracted out of these systems. If the reorg doesn't take this into account, it might make the situation worse by trying to brush these problem areas under a rug. 

[![Microservices Architecture Journey at Airbnb](https://miro.medium.com/max/700/1*IlxBthy_kQMJh3YgHabJlw.png)](https://medium.com/qe-unit/airbnbs-microservices-architecture-journey-to-quality-engineering-d5a490e6ba4f)
> Reorgs and technology investments to help address confusing ownership at Airbnb

# Re-orgs, impacts clear ownership

At the same time companies are also very keen on reorgs in part with the recent popularity around [inverse conway maneuver](https://www.thoughtworks.com/en-us/radar/techniques/inverse-conway-maneuver). This attempts to use the fact that Conway's law, particularly in microservices, org structure ends up designing your architecture at least in terms of system boundaries. The [Team Topologies](https://teamtopologies.com/) book about this is very compelling, but I think many organizations attempt to do this without understanding the domains and systems that teams currently own, leading to poor outcomes as they try to reorg to a better set of domains, but the teams often have to pull forward legacy systems they already own. Without a process to understand and purposefully move applications to proper owning teams which, when done well leads to strong and better understood domains by teams with a coherent set of domain and system boundaries. This leads to strong ownership and deeper domain knowledge by the team. When an organization reorgs without understanding or correcting existing application ownership, I don't believe it can really capture the value of the reorg at all, in fact it probably ends up causing more chaos, confusion, and poor maintenance costs.

> When the company needs to freeze hiring or contract, how are legacy systems assigned ownership and supported. Reorging when a company is growing leads to more positive ownership opportunities than reorging when a company is at a stable size or shrinking. How do we set up ownership so that we can withstand ups and downs. --Erica Tripp

As leadership sees some of the issues falling out of the current org structures, they often will reach for the reorg, but reorgs themselves don't change the ways of working, and often can make maintaining legacy systems harder if you move folks away from areas they have built domain expertise.

> changing structure and process without addressing leadership, cultural and ways of working issues, usually exacerbates existing problems rather than improving performance. --[The Structure and Process Fallacy](https://medium.com/nick-tune-tech-strategy-blog/the-structure-and-process-fallacy-40640e844230)

In terms of clear ownership in microservices some even propose that, ["Ideally each team has only one service"](https://microservices.io/patterns/decomposition/service-per-team.html). If you are a growing company that has been evolving microservices, I doubt this is the situation. After a number of reorgs and folks coming and going a team's responsibilities more often look like a giant group of only semi-related services and libraries. 

![overloaded but not entirely uncommon diagram showing a teams repo ownership](/assets/img/example_team.png)
> A overloaded but not entirely uncommon diagram showing a teams repo ownership

If you end up having teams with ownership responsibilities as shown above, with more services than team members. It is unlikely there is strong ownership with deep understanding of all the systems involved.

# What do we need to know about our teams?

We need to better understand the reality of what our teams are working on and if they are supported to work on the goals we set out for them. If the team's goals align with the systems they have, if they are set up for success or are in a declining spiral of more maintenance than they can healthily support while also delivering new value. There is a lot we should know about how our teams currently look, so that we can re-balance in ways that ensure all teams are healthier and more effective. While we need to also consider domains, specific systems, and team's charters to re-define an org structure, there are a lot of things that should be considered about the team health directly.

* Is the team overloaded?
  * Do they maintain too many repos for the number of folks on the team?
  * Do they have too many weeks on-call per developer?
  * Are they supporting legacy systems with high maintenance burdens, or all newer and actively supported systems?
  * Are the systems they support well bound to a coherent set of domains?
  * Are the apps they currently support healthy? (I will dig in more into what is a healthy app in a future post).

* Is the team well rounded?
  * Does the team have some tenured folks that can navigate the org and have historical context?
  * Is the team a good mix of Sr / Jr folks, for the type or work?
  * Is the manager a good fit for the team (A newish manager with a Jr and non-tenured team, leaves everyone trying to learn and navigate at the same time)

* How is attrition impacting the team?
  * Teams with higher attrition than others are likely significantly impaired, consider [what really happens when someone leaves a team](https://twitter.com/benjiweber/status/1480219318273073157)


## What do we need to know about our repos and apps?

We can't just talk about teams without looking at the details, at some point we want to also look at all the repos they own, what they most actively work on, and the health of those systems. Especially after several wild rounds of reorgs, teams often end up with some things that don't fit well into their teams goals, but the system's responsibility has to end up somewhere. It is best to at least make it clear where the responsibility ends up, even if it immediately requires some discussion about how the legacy load might not be healthy, so that it can be fixed. I will follow up on this question in a future post, digging into how to think about the health of repos and the value and risk they create for companies.

# Strong ownership drives quality

There are many other posts talking about the [impacts on ownership of microservices](https://bennorthrop.com/Essays/2022/code-ownership-stewardship-or-free-for-all.php). I think there are still a lot of good questions on how best to handle it. I am mostly trying to make the case that thinking through the domain boundaries is not enough, one has to think of what it takes to have deep knowledge and strong ownership of a domain. It takes having a healthy team without too many responsibilities with a cohesive set of services and responsibilities that form a common domain. If you move teams into what seems like better domains as part of re-orgs but don't look at or address the other responsibilities a team may already have, strong ownership and the attempts at more clarity of domains will not succeed.


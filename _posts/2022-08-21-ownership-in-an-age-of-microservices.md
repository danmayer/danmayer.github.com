---
layout: posttail
title: "Ownership in an age of microservices"
image: /assets/img/code_detective.png
category: SRE
tags: [SRE, Tech, Resilience]
group: draft
---
{% include JB/setup %}

google and see if there is some thinking out there...
   * trend in undoing to many microservices uber, spotify, etc
   * grab the uber and spotify from slack etc...
   * when the company needs to freeze hiring or contract, how are legacy systems assigned owhership and supported.  re-orging when a company is growing leads to more positive ownership opportunities than re-orging when a company is at a stable size or shrinking.  how do we set up ownership so that we can withstand ups and downs -- Erica T.



# Who is Responsible for the Distributed Monolith?

As microservices have been around a fairly long time at this point (in tech life cycles that is) there are places that have "legacy" micro-service systems, perhaps better called a distributed monolith. At some point, companies need to refactor, delete, and reduce the maintenance of micro-services the same way companies end up building strategies to unravel or [modernize legacy monoliths](https://shopify.engineering/shopify-monolith). 

## OWNERSHIP, strong ownership

At the same time companies are also very keen on re-orgs in part with the recent popularity around reverse convey maneuvers... This attempts to use the fact that Conway's law, particularly in microservices, ends up designing your architecture at least in terms of system boundaries. The book on this is very compelling, but I think many organizations attempt to do this without understanding the domains and systems that teams currently own, leading to poor outcomes as they try to re-org to a better set of domains, but the teams often have to pull forward legacy systems they already own. Without a process to understand and purposefully move applications to proper owning teams which, when done well leads to strong and better understood domains by teams with a coherent set of domain and system boundaries. This leads to strong ownership and deeper domain knowledge by the team. When an organization re-orgs without understanding or correcting existing application ownership, I don't believe it can really capture the value of the re-org at all, in fact it probably ends up causing more chaos, confusion, and poor maintenance costs.


## WHAT DO WE NEED TO KNOW About Our TEAMs?

We need to better understand the reality of what our teams are working on and if they are supported to work on the goals we set out for them. If the team's goals align with the systems they have, if they are set up for success or are in a losing spiral of more maintenance than they can healily support while also delivering new value. There is a lot we should know about how our teams currently look, so that we can re-balance in ways that ensure all teams are healthier and more effective. While we need to also consider domains, specific systems, and team's charters to re-define an org structure, there are a lot of things that should be considered about the team health directly.

* Is the team overloaded?
    * Do they maintain too many repos for the number of folks on the team?
    * Do they have too many weeks on-call per developer?
    * Are they supporting legacy systems with high maintenance burdens, or all newer and actively supported systems?
    * Are the systems they support well bound to a coherent set of domains?
    * Are the apps they currently support healthy? (I will dig in more into what is a healthy app in a future post).

* Is the team well rounded?
    * Does the team have some tenured folks that can navigate the org and have historical context?
    * Is the team a good mix of Sr / Jr folks, for the type or work?
    * Is the manager a good fit for the team (A newish manager with a Jr and non-tenured team, leaves everyone trying to learn and navigate at the same time)

## What do we need to know about our repos and apps?

We can't just talk about teams without looking at the details, at some point we want to also look at all the repos the own, what they most actively work on, and the health of those systems. Especially after several wild rounds of re-orgs, teams often end up with some things that don't fit well into their teams goals, but the systems responsiblity has to end up somewhere. It is best to at least make it clear where the responsibility ends up, even if it immediately requires some discussion about how the legacy load might not be healthy, so that it an be fixed. I will follow up on this question in a future post, digging in to how to think about the health of repos and the value and risk they create for companies.
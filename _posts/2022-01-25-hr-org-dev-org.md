---
layout: posttail
authors: ["Dan Mayer"]
title: "Operations vs Ownership vs HR Organizational Structures"
image: /assets/img/request_success.png
category: SRE
tags: [SRE, Tech, Resilience]
group: draft
---

{% include JB/setup %}

# Organizational Structure Drift Causes Issues

When your HR and management org structure starts to drift from your operational and development structure things suffer.

* folks talk about groups and management teams in meetings that don't actually exist in terms of ownership of runtime systems and deliverables
* folks see incidents and can't map the product feature and ownership to the system, team, and pager on-call / at fault to follow up on investigations
* running operations for a system and not having input into it's long term ownership in direction leads to increased pages and incidents with no vision on a stable and coherent system.

### The tale of the teams of before

If org charts, mangers, and teams are re-org'ed a few times through systems that do not connect to actual system and on-call ownership one day you will find out, and hopefully you find out before a major incident.

* an incident occurs various systems are having problems and need small updates / restart, it becomes clear system X needs attention and that no one is clear who is responsible for the system... One can sometimes even page that system and page a team that 'owns' it to find that a responder knows nothing about the system and didn't know it was assigned to their team... or that oh that system, well yeah we inherited it and only "Rosco" knows anything about it as he is the last one left at the company that worked on it...

At this point during an incident possibly in the middle of the night you have folks with very little context about a system making decisions to "change the system without safety" or "wake up people who likely don't know how to help". The failure at the moment must get resolved, but during any good post-mortem (incident review). It should come up that there wasn't clear ownership of that system

* it wasn't clear which product team owned it
	* or that product team no longer actively worked on it, overlooked "legacy" system that is actually critical
* a product team clearly owned it but new nothing about it
	* this was re-org'ed to us... non of the original product or engineering teams originally involved are responsible anymore... we have spent only mandatory maintenance time keeping it running.
* a eng team still clearly owned it but new it was a disaster and has been trying to deprecate it for years
	* "yes we own it, no one will take it... no one will give us staffing to get rid of this, and our clients refuse to migrate of it because it is actually critical to like 70% of the companies revenue but we can't get anyone to invest in supporting it or replacing it"
	* our product partners don't agree we own this as a team since the last re'org but no one else has accepted the pager, so like we own it and spend 0 time on it unless someone bugs us....
* it actually isn't clear who owns that any more... the team that owned it was re-orged away and it wasn't noticed that no one was left on it's pager rotation even though they operated several apps.

If you have been around the block a few times you have likely seen one or a few of the above examples before... All of which result in increased risk, increased burnout, lowered productivity, and both organizational and domain confusion which increases bad decision making. These are all examples of problems that arise form organizational structure drift, and why you should fix it.

## what it looks like

operations, code owners, vs org charts

> diagrams

## How to fix it...

Everyone wants a data driven business and can't even get their organizational data to agree... Have a source of truth and be able to map it to any an all different views... try to keep those views as close as possible and have good reasons for when they drift (migrating from a out-dated to new view of responsibilities)... Make it very easy to find and look up this information and fix descreptioncies. IE, if an incident is occuring and you don't know what team_xyz is and you know all the consumer engineering teams, you likely have a big issue in drift.

fix it by picking the source of truth and restructuring the other mappings to follow... do this in code or an automated process. do not rely on humans or you be back at it again in just a little while.

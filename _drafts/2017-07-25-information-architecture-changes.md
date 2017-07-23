---
layout: post
title: "Information Architecture Changes"
image: /assets/img/information_architecture_changes.png
category: Programming
tags: [Programming, Development, Tips, Rails]
---
{% include JB/setup %}

![image DB Schema Changes](/assets/img/information_architecture_changes.png)
> Visualizing DB Schema Changes via DOT files

# Information Architecture Changes

Getting the Data Model correct for your business and application is one of the most important things, but we still don't have great tools for discussing proposed database schema changes. Fixing a bad data model after data has started flowing on a production system is always far more complicated and time consuming than folks estimated. What can we do to ensure a more robust model from the start?

Below, I will lay out a proposal we are working to adopt as part of our OGE Team practices.

Our Goals:

* Quickly visualize and be able to discuss changes (faster feedback loop)
* Ability to communicate across dev, PM, and BI teams anticipated impacts
* Reduce bad data models making it live prior to cross functional review
* Supports asynchronous communication styles that work best for our distributed team
* Ability to incremental evolve the model quickly during discussions
* Ability to see high and low level details using the same data
* Ability to narrow in to only the models under discussion

# Live & Collaborative Refactoring Your DB Schema

It might be easier to understand the goal with a quick animation to show the flow, than just describing it. Here is the flow one can expect to get into when working on DB model / schema changes.

![image DB Model Change Animation](/assets/img/refactor_db.gif)

# DB Schema Change Process

The process creates some artifacts that help support a robust understanding and conversation around the data changes.

1. A PR is used to group the artifacts, description and reasoning for the change, and to focus the discussion
2. A high leveled visual asset on changes to quickly understand the lay of the land so to speak
3. A low level view showing column level removals and additions to the schema, colorized via `git diff` support

### High Level Visual Assets

### Low Level Details
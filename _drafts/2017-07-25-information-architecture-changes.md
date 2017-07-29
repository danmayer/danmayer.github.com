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

Getting the Data Model correct for your business and application is one of the most important things to get right. We still don't have great tools for discussing proposed database schema changes. Fixing a bad data model after data has started flowing on a production system is far more complicated and time consuming than folks estimate. A series of not fully thought out data decisions early on project can cut a teams velocity significantly while trying to fix bad & invalid data, adding missing [DB constraints & validations](http://naildrivin5.com/blog/2015/11/15/rails-validations-vs-postgres-check-constraints.html) where needed, and refactoring towards a more appropriate data model. 

__What can we do to ensure a more robust model from the start and increase the confidence we have in data model changes?__

## A Proposal For More Communicative Data Model Changes

Below, I will lay out a proposal we are working to adopt as part of our OGE Team practices.

Our Goals:

* Quickly visualize and be able to discuss changes (faster feedback loop)
* Ability to communicate across Dev, PM, and BI teams anticipated impacts
* Reduce bad data models making it live prior to cross functional review
* Supports asynchronous communication styles that work best for our distributed team
* Ability to incremental evolve the model quickly during discussions
* Ability to see high and low level details using the same data
* Ability to narrow in to only the models under discussion
* Easily integrates into our tool chain

While this does add additional overhead while working on data changes to our system. It helps us to collaborate and socialize the data model. Working towards ubiquitous language across our teams and with our stakeholders.

It is important to note this is for [data schema changes not for data migrations](https://www.mayerdan.com/programming/2016/11/21/managing-rails-migrations), which I have written about how we handle previously.

## Data Model Change Process

The process creates some artifacts that help support a robust understanding and conversation around the data changes.

1. A PR is used to group the artifacts, description and reasoning for the change, and to focus the discussion
2. A high leveled visual asset on changes to quickly understand the lay of the land so to speak
3. A low level view showing column level removals and additions to the schema, colorized via `git diff` support

### High Level Visual Assets

<img src="/assets/img/customer_phone_clean.png" alt="detailed customer cleanup" width="100%">
> A high detail visual representation of the expected end result

The high level view are images that can include class or class and field information about the models under change. The PR will typically include both the before and after image so one can see how the classes and associations will change over type. If fields are moved you can also see a class shrinking as fields move to newly associated objects. This type of view can help see the bigger relationships and structures of the data model.

### Low Level Details

The low level details will result in a `git diff` showing the specific fields and associations that are added and removed. While this might be verbose for some folks. For the developer implementing and the business intelligence analyst reviewing to make sure it meets their needs it will be very helpful.

## Example Live Refactoring Your DB Model

It might be easier to understand the goal with a quick animation to show the flow, than just describing it. Here is the flow one can expect to get into when working on DB model / schema changes.

![image DB Model Change Animation](/assets/img/refactor_db.gif)
---
layout: post
title: "Practicing Fast Development"
category: Programming
tags: [Programming, Development, Learnings, Practices]
---
{% include JB/setup %}

## The importance of being fast

I have recently been more concerned with the speed of development. Feeling like my ability to get things done quickly was falling behind the curve. As I mostly work on very large project where slow and steady refactoring and daily progress was the name of the game. In my personal projects I started spending time focusing more on quickly creating small projects and getting them off them to a usable point. It was a bit disorganized at first, but I feel like I was able to start to break it down into slightly more focused areas to improve.

* Quickly setup an environment with all my development needs
* Getting a application up that supports common basic needs
* Better sharing and reuse of common code between apps, services, and components
* Quickly being able to release to a production (at least publicly available) environment
* Doing all this while maintaining some level of quality

As I was working away on these points and trying to refine some practices around them. I came across Jason Fried's article [The Importance of Quick and Dirty](http://www.inc.com/magazine/201305/jason-fried/the-importance-of-quick-and-dirty.html). It reminded me that we get good at what we practice, and I hadn't been practicing launching from scratch. At work I was launching features, improvements, refactorings, and updates. I was very rarely launching new apps, products, or services. This renewed my belief that purposefully working on the skill of going from nothing to production was a valuable one. In a series of posts, I wanted to cover some of the process I have been using and tools that help me to quickly get up and running on projects.

## Develop a plan

First have a plan of what you are specifically trying to get better at. In my case

I started to try to automate away as much of the blockers that make it hard to start a new project.I also wanted to more quickly be able to play with new environments, or languages. This got me interested in prebuilt EC2 boxes as well as the automated creation / maintenance of EC2 (or any cloud really) boxes. 

* separate learnings from trying to launch something new. If you are learning a new language you are likely just building a toss able toy app. You don't need to concern yourself with reuse and automating as much. Working slowly when learning a new skill is great it is just different than purposefully working on speed of your mainline development process.
 

* automate everything, interest in chef, boxes, short personal shell scripts, etc
  * I joke about people obsessed with short key commands in editors and on the cmd line but at least they are always automating and shortening their process
  
* Try to use generators or leverage other projects to avoid repeating, with that for personal projects I use rails composer for starting rails projects, I use my own personal sintatra_template project for web and api sinatra project starting. I use bundler to quickly startup a new gem

# Creating a new rails 3.2.x, project.



    
# Intro to sinatra template

I wanted to very quickly have a mostly static site that could have a bit  of dynamic backend. I wanted a way I could quickly play around with new ideas and play with designs and projects out of the box nearly instantly. This solved that problem by giving me Jquery, bootstrap, and erg with a nice layout… To just immediately get into the meat of the project. It also has a reasonable simple template for a API only setup which has no real UI, but supports a client gem.

# example quickly built project kindlier was up and running on heroku in a single weekend while drinking coffee
  
given a couple more mornings of cleanup it was on heroku with a solid setup, some documentation, a reasonable UX explaining the setup, and solving a real problem I had.

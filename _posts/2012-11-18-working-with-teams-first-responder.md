---
layout: posttail
authors: ["Dan Mayer"]
title: First Responder, helping large development teams coordinate and work together
category: ruby
tags: [programming, development, ruby]
---
{% include JB/setup %}

The team I am working on has been responsible for maintaining a large central code base. This code base is a older code base that spans to many responsibilities. It's stability and performance is important, because of this central roll. It is a point that many other teams need to interact with. Any downtime or large exceptions can have a significant impact on the company or many other teams relying on this project as a API.

As the number of developers and teams within our company has grown so has how we manage code going into this central project. We began requiring the majority of code going into the project to have [code reviews](http://www.codinghorror.com/blog/2006/01/code-reviews-just-do-it.html). We also went from only having developers who had a lot of experience with the central project to many developers who only touch it a hand full of times and work on other projects for their day to day development. This generally meant when a developer from another project needed a small change they needed some help finding their way around the project and to understand the context where they would be making changes. 

The changes and growth lead the team I am on to being overwhelmed with requests to review code, answer questions, and help other teams integrate changes into the project. At first we tried to just deal with this ad hoc as situations arose. While this sort of worked for awhile, it lead to a number of distractions and interruptions for all the developers on our team. It also made it hard to plan and schedule our own features as we didn't know when or which one of our developers might get pulled of task to help another team work with the codebase. We needed a better way to work with other developers and teams, and a way to help review the constant flow of new code being pushed into the project. Code needed to be reviewed often coming in from all the other devs on our team freed up to focus on getting things done.

For me personally the constant flow of interruptions was endangering my ability to have and longer period of focus, or get any significant work done because of [the interruption tax](http://37signals.com/svn/posts/2272-the-interruption-tax).  

> interruptions are the enemy of work. They are the enemy of productivity, they are the enemy of creativity, they are the enemy of everything. 

--[Jason Fried of 37Signals](http://bigthink.com/ideas/18522)


## Introducing a first responder

We decided to schedule one person from our team a week to do nothing but help other developers get code into our project. The first responder (on-call, bug catcher, or on-duty) developer does the majority of the code review during their week. They take emails coming in for live bugs and if it is something tiny they fix it immediately or determine if another developer on the team needs to immediately focus on that issue. They help PM get estimates on upcoming work to at least ballpark if it is worth discussing. They look over other teams proposed features, branches, and Pull Requests to varying degrees. Sometimes all that is needed is a code review of the final changes, other times having a quick meeting with a team to discuss the requirements of their feature and what changes in the central project would need to occur to support their feature. Occasionally the first-responder will end up pair programming with another developer to help share knowledge of the codebase and help them integrate their changes.

We rotate who is the first responder on the team each week. It can actually be pretty hectic and a bit scary. Some days you will get slammed with so many incoming requests bouncing quickly from one idea to another, and all the context switching will wear you out. Other days, you get to learn a lot about a part of the code base that you might not have been as familiar with previously, or with another team's work which is new to you. It is definitely a challenging week that requires a different set of skills than our normal development duties.

This has freed up the rest of our team's developers to better focus on the features and work that we had planned. It makes it less likely a unexpected hiccup will knock all our devs off schedule. It has also reduced the tiny little interruptions that destroy developers ability to focus and do real development.

#### Share the expectations to other teams

When our team introduced the first responder, we emailed all developers at the company. We shared our plan for a first responder and a email address to get in touch with our team's first responder. The email went to the first responder who is on duty that week, but also allows the rest of our team to have a high level of what is going on by lurking on email threads. We let teams know that if there is a more immediate need they can jump in our campfire room and ask questions where anyone from the team can help respond, and we always update the room info to let people know who is the first responder this week. We asked that people try email and campfire channels prior to falling back to IMing a developer directly. We also added all the information to our projects README, so that new developers joining a team can find out quickly how to best interact with the central project.

We aren't the only team at our company that has been creating the first responder position, in fact we weren't even the first. Other teams naturally evolved similar positions. Since we have been using the first responder on our team for awhile now. I think I can safely say it has been a big improvement. I have been happy to see more teams adopting similar rotation roles as well, as it has been great to have someone as a point of contact when trying to work with a project when you less familiar with it.

While the satisfaction of being the first responder is different than normal tasks, helping someone ship a big new feature for their team can be very rewarding. So can mentoring more junior developers to help them solve a problem in a better way. There is also a certain joy of helping review and ship 10 - 15 smaller deployments to production, getting a bit in the code review zone of a review deployment / cycle. I know that I believe it has helped increase the overall quality of the code getting to the production system. It has also helped us to streamline and more quickly process a rapid flow of pull requests without slowing down the development pace as much (So has standardizing and sharing a set of expectations for pull requests for our project, but more on that in another post). I don't like adding to much process to the development flow, but I think the right amount of process helps keep healthy balance between [Stables and Volatiles](http://www.randsinrepose.com/archives/2012/11/14/stables_and_volatiles.html), ensuring they can work together while trying to get some of the benefits of each group. If your team seems to be frequently knocked off task by outside requests or facing a growing backlog of necessary code reviews, I highly recommend implementing the team first responder.


###### Additional Sources 


  * [A Protocol for Code Reviews](http://www.naildrivin5.com/blog/2012/04/02/a-protocol-for-code-reviews.html)  
  * [reasons interruptions hurt productivity](http://blogs.atlassian.com/2012/10/collaboration-best-practices-3-reasons-interruptions-hurt-productivity/)  
  * [37signals Getting Real chapter, Alone Time](http://gettingreal.37signals.com/ch07_Alone_Time.php)  
  * [Large collection of sources on StackOverflow about about developer interruptions](http://programmers.stackexchange.com/questions/105891/where-can-i-find-articles-on-why-interruptions-are-bad-for-programmers)  
  * Our first responder contact methods (email, group chat, IM) in part help people to follow [Tactics for avoiding colleague interruptions](http://programmers.stackexchange.com/questions/94800/best-tactics-for-avoiding-colleague-interruptions)  


###### Unsolved First Responder Issue
  
  * A developer on my team pointed out one problem we have been having with the first responder rotation. We work on a distributed team, so we have rotations that involve developers in different timezones. If the first responder is on the west coast and a early morning issue occurs someone needs to respond. Currently a east coaster will drop what they are doing to step in to the first responder role to help with whatever live bug fighting is going on. We don't really have a good solution for this issue yet.  

  
  
 
  
 
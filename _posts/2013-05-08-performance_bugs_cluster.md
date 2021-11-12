---
layout: posttail
authors: ["Dan Mayer"]
title: "Performance Issues and <!--more--> Bug Clusters"
category: Programming
tags: [Programming, Development, Learnings]
---
{% include JB/setup %}

There is common advice in programming that bugs tend to cluster in the code. I have always found that true. In part because if there is a hard problem without a clean solution it is easier to make a mistake. Another reasons is one bug results in one hack with a bad fix adding it's own bug. __Creating bugs all the way down__. I think devs in general know about the issue of bugs clustering, but I don't think everyone knows what to do about it or that it doesn't only apply to bugs.

### OK, bugs cluster now what?

Depending on the on the seriousness of the bug, likelihood of a one off mistake or potential cluster, there are a couple of different things that might be worth doing:

* For any bug it is worth at least doing a brief audit to see if there are similar mistakes in nearby code.
  * Did this class use the same variable with the same mistake?
  * Was this method accidentally called with the wrong object anywhere else
  * Was this a data error, logic mistake, typo, misunderstanding? (How likely is this to be a one off bug vs. a cluster)
  * Do you remember debugging something like this in a related area fairly recently, If so likely worth digging in more.
  * A quick check can find and save many related bugs from popping up, over and over.
* Was this a Really serious bug?
  * Audit all related code. Looking at all calling code and everything relying on results from the buggy section of code.
  * Did you just find a bug in authentication, encryption, payment services, etc… You better believe you should have one or two devs look for similar errors.
  * Where else in the code is there anything similar to this that could be impacted
  * Why didn't a test catch this bug?
  * After the bug is fixed was it serious enough there needs to be a follow up post-mortem, meeting, log audits, discussions with the original code author(s)?
* Hmmm this was just a tiny bug but there is similar code all over the place. 
    * Did you just fix the same bug 3 places in arrow? If so time to Isolate buggy issue. 
    * If there are many related pieces of code dealing with the same issue often in slightly different ways, it is extremely likely there is a bug. 
    * It also means that if you hack something to fix the bug, you likely only fixed one manifestation of the bug, or by fixing the known case created a new unknown bug.
* Is this bug to big of problem to fix it all right now? Fix the initial known bug. Then in a [rare time where comments are better than code](http://pragmati.st/2012/03/10/the-war-on-comments/). Comment on the hack pointing to related past bugs and potential other bugs. If you have even built up the mental model of a solution or two perhaps leave that information as well. We all have had to hack around some bug just to make it through the day, but if you come back a second time to fix a bug and find a comment like that, you have some refactoring in your future, dig in and get to it.
* If you wrote the code and just authored a bug fix for a issue, perhaps ask another dev to give a quick code review of the code, class, or method. Fresh eyes can do wonders to illuminate a subtle deeper issue.
* Likely a obvious one, but write a test that fails then fix the bug… Exceptions on production you say! Fine fix, deploy, then locally revert the fix and get that test around the error case. 
* A much harder thing to fix but good to understand. Was the bug cluster caused by a bad data model. Code that isn't representative of the problem and task at hand? If so there might be a larger discussion or refactoring to start to consider.


### Clusters, it's not just for bugs  
<div class='blog-header' data-title='Not just for bugs'>
</div>

Code patterns are everywhere: styles, library usage, thoughts, developers, late night bad hacking, good day, bad day, new shiny obsession, dead feature, big O blindness, N+1, slow methods, service abuse…

Pretty much any pattern the human mind can recognize can and will cluster in code. If you are trying to fix up, undo, remove, or improve code it helps to understand a bit of context. Just a little extra context can explain why the code exists the way it does. Git blame your lines, methods, and features to learn some possible historical context. See what other code was added or modified around the same time. I find that helpfully when sleuthing for all other possible related bugs… I actually find more often that this sort of 'code cluster' is more useful when removing a feature or doing performance work. It is good to know that code pattern form clusters like this in general but, I have found that following up on the patterns particularly for performance issues can have huge payoffs. If you find a simple but large performance win, dig into the code cluster finding all related code.

I was working on performance problems for a specific Rails action. I found that it was doing the most naive and simple thing possible, which is great and in the past never really cause an issue. As the data size changed it was blatantly obvious that it was making hundreds of unnecessary calls per request and reducing the result set down for display to the first 5. Basically `get_massive_result_collection[0…5]`, Ok simple fix, added ability to pass a limit `get_massive_result_collection(:limit => 5)`. I realized that when the collection method was first added to the code, it's usage had been spread all through out the app. I got the important performance fix deployed to production and saw a order of magnitude difference proving this was a pretty valuable discovery. I immediately created a ticket to follow up on all calls to the existing collection method in the app and find how many were abusing it. Over the next week or two I was able to knock incredible amounts of time of nearly every page load as the method was being used in application layouts, common partials, and spread since it was originally implemented. The code changes where each simple after tracking down the initial performance mistake. I personally will always spend a bit of time spelunking the code now to follow up on related code after discovering a large performance win.

### Humans are pattern recognition machines  
<div class='blog-header' data-title='Pattern recognition machines'>
</div>

Seriously we are are pattern recognition machines, get good at it and use it! Keep a eye out for the patterns in your code. Understand that it can help you with bug fixing, refactoring, performance, dead code removal, and more. No piece of code is written in complete isolation, if it was it really wouldn't be able to do much. So consider the code clusters the surround your changes, and can help you prevent a bug that has gone undetected. 

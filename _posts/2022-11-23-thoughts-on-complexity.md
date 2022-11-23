---
layout: posttail
title: "Thoughts on Software Complexity"
image: /assets/img/a_robot_playing_chess.png
category: Software
tags: [Software, Process, Management]
---
{% include JB/setup %}

__NOTE: this was originally a [mastodon thread](https://ruby.social/@danmayer/109385071308169183), but feels like small linked blog posts are a better format

As there seems to be a tech crunch going on, several companies are responding in different ways, including layoffs which increase the maintenance cost per developer... This naturally leads to companies looking at re-orgs, shutting down services, and current maintenance costs.  

The constant reshuffling of engineers, I find, is universally disliked, and companies seem to be pretty bad at it, although there seem to be some growing trends to try to do it better.

* Current popular re-org strategy around [team topologies](https://teamtopologies.com/).
* A post where the [BBC covers how it applied team topologies](https://medium.com/bbc-product-technology/refactor-organisation-80e4e171d922) and how it went.

Pair the above re-org reading with a good rebuttal with [the structure and process fallacy](https://medium.com/nick-tune-tech-strategy-blog/the-structure-and-process-fallacy-40640e844230). Which points out that without fixing underlying problems a re-org isn't likely to be much help.

Finally, take a look at the [collapse of complex software](https://nolanlawson.com/2022/06/09/the-collapse-of-complex-software/)... Even if you spend time fixing ways of working, org structure, and processes as the above articles suggest if the economic times are forcing a shrinking team to maintain a large and complex system that already has out of control dependencies... The post points to two end states: collapse and rebuilds or build early with sustainable, tried-and-true techniques.

Some choice quotes from the collapse of complex software:

> more hierarchies, more bureaucracies, deeper intertwinings of social structures. Early on, this makes sense: each new level of complexity brings rewards, in terms of increased economic output, tax revenue, etc. But at a certain point, the law of diminishing returns sets in, and each new level of complexity brings fewer and fewer net benefits, dwindling down to zero and beyond.

I have definitily seen where additional layers start to bring negative value.

> complexity has worked so well for so long, societies are unable to adapt. Even when each new layer of complexity starts to bring zero or even negative returns on investment, people continue trying to do what worked in the past. 

I am a architect but often feel powerless to stop the rapidly increasing complexity

> Architects are brought in to “fix” the system. They might wheel out a big whiteboard showing a lot of boxes and arrows pointing at other boxes, and inevitably, their solution is… to add more boxes and arrows. Nobody can subtract from the system; everyone just adds.

This seems to be what Musk is trying to do cutting microservices left and right at twitter (I disagree with how he went about it in a very de-humanizing way).

> software companies can keep hiring new headcount to manage their existing software (i.e. more engineers to understand more boxes and arrows), but if their labor force is forced to contract, then that same system may become unmaintainable. A rapid and permanent reduction in complexity may be the only long-term solution.

This also seems fairly real from my industry experience.

> I think whether software follows the boom-and-bust model, or a more sustainable model, will depend on the economic pressures of the organization that is producing the software. A software company that values growth at all cost, like the Romans eagerly gobbling up more and more of Gaul, will likely fall into the “add-complexity-and-collapse” cycle. 

# How to reduce complexity?

That is likely to big of a topic for this post, but I can through in a bonus link for where to start... Take more careful consideration of your dependencies. If you want to help organization reduce maintenance costs over time, [cull your dependencies](https://www.tomrenner.com/blog/2022-06-09/cull-your-dependencies). Which I generally agree with. Also, make sure you consider your own internal libraries and services as dependencies. 
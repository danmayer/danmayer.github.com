---
layout: post
title: "SVMMail vs Apple Mail"
category:
tags: []
---
{% include JB/setup %}
Well it looks like my SVM mail is very similar to apple's Mail. Apples mail also uses a vector representation and training to achieve 98%+ accuracy (the claim). After reading through this, it makes sense why my filter is achieving such good accuracy. They are using a little more complicated vector analysis tool than I. I use SVMlight, while Apple is using LSA (Latentic Semantic Analysis), which i used to work with but I found the tools far less developed and harder to work with. It was causing me all sorts of problems to tell LSA to do the simple clustering I was doing very simple with SVMlight. The main reason it looks like they are using LSA is they first reduce the space vector and then using LSA on the reduced vector they are claiming a major performance increase. This is really believable, especially since LSA offers quick tools for folding new information into a model instead of recreating it. Anyways, I am happy to learn that the approach I took with my mail filter appears to be very similar to one of the best computer companies out there. It gives me even more reason to believe that I am on the right trail with all of my various Vector based learning algorithms.

<a href="http://www.macdevcenter.com/pub/a/mac/2004/05/18/spam_pt2.html">Explaining the Apple Mail Filter</a>

P.S. This means that my filter that has barely been developed and has many enhancements possible is achieving about .5% less than apples filter!
---
layout: posttail
authors: ["Dan Mayer"]
title: ratio of bugs per line of code
category: ruby
tags: [programming, development, ruby]
---
{% include JB/setup %}

__The more development I do the more I feel like increased Lines Of Code (LOC), nearly always results in increased bugs.__

I know that seems obvious at first, but hear me out, as many refactorings, abstractions, 'cleaner' code increases the LOC.

I have been reviewing a lot of code lately and the larger the added LOC are the more concerned I am about being able to fully understand and review the code. Even when I fully understand the purpose of the new code, I know lurking in each line could be a subtle but important bug. Seems obvious at first, but shouldn't the overall complexity of the change and level of difficulty of the code be a large part of the equation as well? Most of the time the answer is not really. Reviewing new code going into a project each line introduces a new place for a bug to exist, even when each individual line is incredibly simple. So reviewing a 'simple' code change of 600 LOC is still often times far more risky than a complex change of 100 LOC (^1).

My team has been working on refactoring and cleaning up a large older code base. One of the biggest issues now is just the sheer volume of unused, near duplicated, or overly abstracted code. The cognitive load associated with understanding all the implications of a change, and who might be relying on a specific quirk in a piece of existing code.

This made me think about many of the great developers I know and how they try to avoid creating large code bases. Which is why I think eventually many great developers start to really favor the most succinct code to accomplish their task. Often it is slightly less readable (chaining injects, transformations, and reductions to a collection in one line), but it leaves such a small surface area for bugs to linger. Which is why I think so many incredibly smart engineers who enjoy the beauty of code move from writing verbose 'readable' explicit code with big objects and reusable modules, to condense and succinct but powerful code. Often favoring simpler objects, relationships, and data structures.

I think the best example of developer trajectory of verbosity to conciseness comes from Steve Yegge, who gives a outrageous example of beginner code compared to expert code, to illustrate his point in [Portrait of a N00b](http://steve-yegge.blogspot.ca/2008/02/portrait-of-n00b.html). While he admits that example is a bit of a joke, he does seem to have some support for my premise.

> I happen to hold a hard-won minority opinion about code bases. In particular I believe, quite staunchly I might add, that the worst thing that can happen to a code base is size.

-- Yegge in [codes worst enemy](http://steve-yegge.blogspot.com/2007/12/codes-worst-enemy.html)

In fact many developers talk about how [LOC is the enemy of software projects](http://www.codinghorror.com/blog/2006/07/diseconomies-of-scale-and-lines-of-code.html). The linked post references 37 Signals (several times), Seth Godin, and heavily quotes Steve McConnell all supporting how much more difficult and less time efficient it is to manage large code bases.

I think in part the reason large codebases are such a problem is that as the code grows, so does the number of existing bugs in the system. The ratio of bugs per lines of code is pretty constant for a project based on the methods the team has followed while adding features and code to the project. Many of the articles I am linking to, point out the the cost of adding code doesn't grow linerly but get's orders of magnitude worse as the code base grows.

### Bug to code ratios

The idea of bugs per lines of code isn't really a new idea. Steve McConnell, the primary source for the previously mentioned post, has written extensively on defects per lines of code. Covering average bugs per LOC stats in his great book [Code Complete](http://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670)

    (a) Industry Average: "about 15 - 50 errors per 1000 lines of delivered
    code." He further says this is usually representative of code that has some
    level of structured programming behind it, but probably includes a mix of
    coding techniques.

    (b) Microsoft Applications: "about 10 - 20 defects per 1000 lines of code
    during in-house testing, and 0.5 defect per KLOC (KLOC IS CALLED AS 1000 lines of code) in released
    product (Moore 1992)." He attributes this to a combination of code-reading
    techniques and independent testing (discussed further in another chapter of
    his book).

    (c) "Harlan Mills pioneered 'cleanroom development', a technique that has
    been able to achieve rates as low as 3 defects per 1000 lines of code during
    in-house testing and 0.1 defect per 1000 lines of code in released product
    (Cobb and Mills 1990). A few projects - for example, the space-shuttle
    software - have achieved a level of 0 defects in 500,000 lines of code using
    a system of format development methods, peer reviews, and statistical
    testing."

Going further McConnell talks about the value of [defect tracking](http://www.stevemcconnell.com/ieeesoftware/bp09.htm). As well as the speed of writing [quality software in relationship to the defect rate](http://www.stevemcconnell.com/articles/art04.htm), and bugs related to a team's [software development process maturity](http://www.stevemcconnell.com/articles/art02.htm).

I think McConnell places too high of cost on bugs, at least for modern agile web development. He is mostly discussing the issues in the context of shipped (Microsoft, NASA, and defense), opposed continuously deployed web apps where most bugs can be solved quickly and the mean time to recovery matters more than have a extremely low bug rate. (yes +1 for Facebook's [Move Fast and Break Things](http://spectrum.ieee.org/at-work/innovation/facebook-philosophy-move-fast-and-break-things)). I do agree with McConnell that more bugs in the software will also slow the speed of development, as it increases the cognitive load.

Working on a large project with many developers of varying skill, I often push for easily readable code. I think it is important that anyone on the team can work on the code. When more easily readable code starts to increase total code size, these two ideas are at odds. That dichotomy is what brought all of this to the front of my mind. I have been increasingly been hesitant to believe a refactoring just for the sake of slight readability at the cost of increased lines of code is a good thing.

I do think heavily functional and succinct code is far better for back end systems and complex functions and less likely to cause maintainability problems. So while I might slowly be writing more chained and dense code, I don't think it works everywhere. I have yet to see how that kind of succinct 'clean' code can handle user input exceptions, and highly conditional view layers. I think part of it might be why experienced developers like to work on frameworks and more isolated services where one can produce and enforce such 'pretty' code.

## Final Thoughts

>Keep your code tiny. Fight extra complexity and lines of code and strike down upon it with great vengeance & furious anger...

--[not quite what was said in Pulp Fiction](http://quotes.dictionary.com/And_I_will_strike_down_upon_thee_with)

I think bugs to LOC ratio is one of the main reasons having a large codebase is bad. I believe the cognitive load of having to write code that functions around all the bugs/quirks in a code base is why progress slows so much on larger code bases.  I think large codebases being bad is one of the reasons why SOA, [Micro-Service Architecture](https://www.youtube.com/watch?v=2rKEveL55TY), Heroku's [Lightweight Web Services](http://rubyconf2008.confreaks.com/lightweight-web-services.html), and Github's [building mini-apps](http://zachholman.com/posts/scaling-github-employees/) is the solution all larger apps end up moving towards.

While I still place a incredibly high value on the readability of code, and often find a Collection#each accumulating into another variable more readable than Collection#inject. I think developers should error on the side of less code, unless there are clear improvements to having more code. Especially when trying to refactor to improve the readability of the code.

Based on this I feel like refactorings that are introducing more lines of code for the sake of readability are often just moving the complexity around. It often feels like a win, but it has a good probability to introduce more bugs. In some cases is actually only more clear to the refactoring author.

Related to refactoring making code larger, while small testable methods are great. If each method just is another layer of abstraction deferring to yet another method before the meat of the problem is solved, it is less likely to be a improvement. Abstractions have a cognitive load and each leaky abstraction layer is another potential buggy line of code. Design patterns can be great but knowing when they are overkill takes time.

I am not saying all refactoring is bad, in fact I think bug LOC ratios increase the importance of some refactorings. A refactoring that doesn't make the code easier to read (and likely not any more difficult) but delivers the same functionality while reducing the total LOC is a big win. A win in terms of maintainability, it reduces the far too frequent bugs where multiple files/functions need to be 'kept in sync' to ensure correct functionality.

One failing in my keep the project as small as possible idea, is user input and UX. All those dedicated to succinct code, please show me great examples of user input error handling and complex conditional view layers. I still haven't seen good ways to approach these issues short of writing more code and trying to make all of the conditions as clear and small as possible. (Often products made for developers solve this by only allowing for tiny number of possible conditions. I don't think that approach works in reality when working with designers and UX teams, who often have clear use cases for each conditional)


###### Additional Sources


  * [Software Quality Metrics Overview, detailing defect tracking](http://www.informit.com/articles/article.aspx?p=30306)  
  * [Source of McConnell's defects per lines of code](http://amartester.blogspot.com/2007/04/bugs-per-lines-of-code.html)  
  * [McConnell, also thinks bugs ratios get worse with larger projects](http://www.stevemcconnell.com/articles/art06.htm)  
  * [While SOA helps solve the large code issue it introduces new complexities, covered a bit in Wycat's code cruft talk](http://confreaks.com/videos/1121-gogaruco2012-cruft-and-technical-debt-a-long-view)  
  * [Section 'Novices versus Experts', might explain the more ridged verbose earlier code](http://www.kitchensoap.com/2012/10/25/on-being-a-senior-engineer/)  



(1) Obviously different bugs have different costs, and critical path bugs are much worse than minor presentational bugs. I am ignoring this issue to get to the larger point.


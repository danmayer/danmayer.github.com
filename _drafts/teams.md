### Team Structures

[The upside down org chart](https://6brand.com/the-upside-down-org-chart.html)

> This inverted[3] org chart effectively evens out the broken power dynamics of the patriarchal model. The language itself is fixed: “I rely on my manager.” “I support my team.” “Because we’re way up here the CEO needs us to tell them what we see.” “I’m not sure I want to take on the weight of another team – that’s a lot to support.”

> If you want them to produce something amazing, then place them in a team of people with all the resources of a supporting manager, a supporting corporate team, and total freedom to do their best work in the way they best see fit. You need only communicate the needs of the end customer clearly and then the work will get done.

This is a great post and I agree with much of it, but one problem I see, in this and other fully self-suffienct team models... Is that while each team might solve any problem on their own, it doesn't mean it is a good overall solution across the architecture... For example each team using entirely independant technology and rebuilding duplicate implementations of various feature... The maintence drag will eventually be as much friection as bad management.
I feel like somewhere in this there has to be a way where supportive leadership pushes constraints which lets all the independant teams work directionally towards a world that make collaboritve features and integrations easier not harder... As a few simple examples, setting a set of list of supported languages (and ensuring those languages have fully expected operational support end to end), API protocals, end to end tracing/observability across systems and languages, etc... I am sure most folks feel like this is supportive, but also the articles talk about an empowering a team and getting out of there way, I think it needs to be a bit more setting the constraints and letting that breed creativity... Teams that are continually trying to side step constraints aren't your fast moving inovators they don't understand collective collaboration and are making short term wins to benifits their team at a cost to everyone else. 

### Growing Teams

https://twitter.com/jmwind/status/1477399261700526080

### Conways Law and Microservices

https://ardalis.com/conways-law-ddd-and-microservices/

> It would be unusual, and probably inefficient, to have a microservice that any number of different teams all share responsibility for maintaining and deploying.

> How you decompose and attach a large problem comes down to how you organize multiple teams of people, and if these teams aren't aligned with the software modules you're building and shipping, you're going to have problems.

### Reducing Coordination

Some great thinking on team coordiatnion from [@jessitron](https://twitter.com/jessitron). A long ago post about the [tradeoffs in coordination among teams](https://jessitron.com/2016/05/07/tradeoffs-in-coordination-among-teams/). It talks about how teams can set them selves up in different ways to help handle the growing complexity of coordination, and balance the tradeoffs as well as some practical conclusions. One of them being having stronger team boundaries.

> The same level of consensus and coordination isn’t practical anymore. Coordination costs weigh heavily. New people coming in don’t get to build a mental model of everyone who already works there. They don’t know what other people know, or which other people need to know something.

Years, later she follows up with [Better coordination, or better software?](https://jessitron.com/2021/08/02/better-coordination-or-better-software/), and talks more about having clearly defined and strong team boundaries. Then going further not just boundaries but more explicit ways to work across the boundaries.

> TL;DR: When different parts of an organization need to coordinate, it seems like a good idea to help them coordinate smoothly and frequently. Don’t. Help them coordinate less — more explicitly, less often.

Or a section that spoke to me.

> To minimize coordination, establish boundaries and the few interfaces that cross them. Work carefully on those interfaces: document them thoroughly, and test on both sides. Change them sparingly and with effort: versioning, backwards compatibility, gradual deprecation.


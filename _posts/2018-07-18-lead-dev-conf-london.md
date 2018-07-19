---
layout: post
title: "Lead Developer London"
image: /assets/img/leaddev_london_stickers.jpg
category: Programming
tags: [Programming, Conference, Stickers, Talks]
---
{% include JB/setup %}

# A Unique Conference

I attended [#LeadDevLondon](https://twitter.com/hashtag/LeadDevLondon) this year, it was a nice and different conference. Generally, I have attended more language-specific conferences. There were basically no language-specific talks at all during the conf, as everything was a bit more general about building and working well with technology teams. Given that these days a large part of what I do is manage teams of devs, it was good to hear other folks talk through some of the challenges and solutions they have gone through during their journey.

![leaddev london stickers](/assets/img/leaddev_london_stickers.jpg)
> My swag bag full of stickers

# Some Favorite Slides

For my very favorite slide see the section with my tweets below ;) Otherwise, enjoy some favorite slides with little to no context ;) You can generally find the full presentation slides on the [talks page](https://london2018.theleaddeveloper.com/schedule) and the full videos of the [#LeadDevLondon talks on youtube](https://www.youtube.com/playlist?list=PLBzScQzZ83I_VX8zgmLqIfma_kJs3RRmu).

![leaddev london slides](/assets/img/leaddev_london/container_manual_1.jpg)
> [@alicegoldfuss](https://twitter.com/alicegoldfuss) explaining containers

![leaddev london slides](/assets/img/leaddev_london/container_manual_2.jpg)
> [@alicegoldfuss](https://twitter.com/alicegoldfuss) explaining what else ops does ;)

![leaddev london slides](/assets/img/leaddev_london/art_of_reviews.jpg)
> [@alexhillphd](https://twitter.com/alexhillphd) going over the art of code reviews, this talk had my favorite slide of the conf

![leaddev london slides](/assets/img/leaddev_london/scaling_yourself.jpg)
> [@cmccarrick](https://twitter.com/cmccarrick) how to scale yourself and make important decisions

![leaddev london slides](/assets/img/leaddev_london/jr_next.jpg)
> [@tara_ojo](https://twitter.com/tara_ojo) on how to help Jr's with good 1:1s

![leaddev london slides](/assets/img/leaddev_london/destroyed_island.jpg)
> [@nmeans](https://twitter.com/nmeans) lessons learn from 3 mile island

![leaddev london slides](/assets/img/leaddev_london/no_elitism.jpg)
> [@ClareSudbery](https://twitter.com/ClareSudbery)

![leaddev london slides](/assets/img/leaddev_london/widely_distributed.jpg)
> [@dbussink](https://twitter.com/dbussink) shows how distributed his team is

![leaddev london slides](/assets/img/leaddev_london/widely_distributed_2.jpg)
> [@dbussink](https://twitter.com/dbussink) explains how to make that an advantage

![leaddev london slides](/assets/img/leaddev_london/awesome_internships.jpg)
> [@WebDevBev](https://twitter.com/WebDevBev) on how to run awesome internships

![leaddev london slides](/assets/img/leaddev_london/edit_data.jpg)
> [@jqiu25](https://twitter.com/jqiu25) the journey to safe ways to edit production data

### Four Slides From The Legacy Code Talk

I guess I really liked what [@ramtop](https://twitter.com/ramtop) had to say about legacy code

![leaddev london slides](/assets/img/leaddev_london/legacy_rewrite.jpg)

![leaddev london slides](/assets/img/leaddev_london/legacy_strangler.jpg)

![leaddev london slides](/assets/img/leaddev_london/legacy_modularity.jpg)

![leaddev london slides](/assets/img/leaddev_london/legacy_simplify.jpg)


# A Talk Pattern I Want To See

One thing I noticed and really came away with from the talks is that every piece of advice and best practice really fits into part of a companies growth curve. Even the most agreed on advice can't and shouldn't apply the same to a single person startup and a company of thousands of people and hundreds of engineers. This made me crave a talk that opposed to saying how some team approaches a challenge and the ways it works for them, but how a best practice or process changes and adapts to different growth stages of a company...

As a single talk, an example let's consider continuous delivery of the growth of a team. While the end best practices involve style checkers, peer code review, automated test suites, deployment to one or more staging, and feature flag or percentage based releases to production, before/after metric analysis on the impact of deploys... It would not be possible to start there nor would it be sensible to set up all that complexity when just getting started... I feel like the flow would naturally look something more like this.

* 1 person startup -> manually run CLI deployment task from the dev machine
* 2-3 people -> CI test suite, manual CLI deployment
* 3-8 people -> static style checker, CI test suite, code review, staging deployment with stakeholder / QA review, push-button deployments and rollbacks automated on CI
* 8-16 -> all the above, with multiple staging environments, some integrated with 3rd party sandboxes, feature flag based releases, metrics tied to specific deployed releases, and deployment queue to help schedule deployments
* etc, etc, etc...

I think it would be great to see detailed talks on tech org structures, testing, monitoring, alerting, etc..

# My Tweets

Some of the tweets I shared during the conf.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Great to see some old friends at <a href="https://twitter.com/hashtag/LeadDevLondon?src=hash&amp;ref_src=twsrc%5Etfw">#LeadDevLondon</a> and introduce them to Theo... <a href="https://twitter.com/mariagutierrez?ref_src=twsrc%5Etfw">@mariagutierrez</a> got a nice hug... <a href="https://t.co/bUIjOUrdff">pic.twitter.com/bUIjOUrdff</a></p>&mdash; Dan Mayer (@danmayer) <a href="https://twitter.com/danmayer/status/1012026404890988545?ref_src=twsrc%5Etfw">June 27, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>



<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">My favorite slide from <a href="https://twitter.com/hashtag/LeadDevLondon?src=hash&amp;ref_src=twsrc%5Etfw">#LeadDevLondon</a> so far.. Also, why our team tries to have linters as part of our CI build... Have higher level PR discussions... <a href="https://t.co/9gandnj3Q5">pic.twitter.com/9gandnj3Q5</a></p>&mdash; Dan Mayer (@danmayer) <a href="https://twitter.com/danmayer/status/1011991874259832833?ref_src=twsrc%5Etfw">June 27, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>



<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Thanks <a href="https://twitter.com/hashtag/LeadDevLondon?src=hash&amp;ref_src=twsrc%5Etfw">#LeadDevLondon</a> after the conf, Theo got to see the analytical engine and difference engine at the London Science Museum... Which is fun since I am reading him a book about Ada Lovelace and Charles Babbage. <a href="https://t.co/sK6VxRnhaQ">pic.twitter.com/sK6VxRnhaQ</a></p>&mdash; Dan Mayer (@danmayer) <a href="https://twitter.com/danmayer/status/1012420484158255104?ref_src=twsrc%5Etfw">June 28, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>



# The Most Important Part, Stickers

Seriously, thanks to all the sponsors and friends handing out stickers. I love collecting stickers at conferences to come back and cover my climbing wall. I am building a large collage covering the entire climbing wall in layers of stickers. After returning from a conference I always have a huge collection of stickers to use, which is great. In this case, I basically was able to make an entire tile of my climbing wall a #leaddevlondon tile full of stickers I picked up during the trip.

![leaddev london stickers](/assets/img/leaddev_london/stickers_1.jpg)

![leaddev london stickers](/assets/img/leaddev_london/stickers_2.jpg)

![leaddev london stickers](/assets/img/leaddev_london/stickers_3.jpg)


If you don't know what to do with all the stickers you have collected at various conferences, feel free to send them my way ;)
---
layout: post
title: "Alexa Compliment My Wife"
category: Programming
tags: [Programming, javascript, Alexa]
---
{% include JB/setup %}

# Alexa, tell my wife she's pretty

| > Erin holding baby Theo  | Alexa, My Wife |
| ------------- | ------------- |
| ![image](/assets/img/Erin_Pretty_Theo_verticle_sm3.jpg) | > User: "Alexa, tell my wife she is pretty."  
> Alexa: "Hey Wife, Wow, that confidence looks sexy on you."  
> User: "Alexa, tell my wife set name to Erin"  
> Alexa: "Wife's name is now set to Erin"  
> User: "Alexa, tell my wife Erin she is sexy"
> Alexa: "Dang Girl is your name Wifi ? Because I’m feeling a connection!" |

I have a hobby of playing around with new technology while ignoring the super bowl on TV. This year I decided to learn some of the Alexa API. I had received an [Echo](https://www.amazon.com/b/?ie=UTF8&node=9818047011&ref_=fs_ods_fs_aucc_cp) for Christmas and thought it would be fun to build a really simple app. I decided to make a little app to help me compliment my wife. We try to [compliment each other daily](https://www.gottman.com/blog/the-positive-perspective-dr-gottmans-magic-ratio/), something we learned in our marriage class ;)
 
# Alexa Skill: "My Wife"

I had the basic functions working by the end of the Super Bowl. After tweaking it a bit more and adding a name variable I decided it was good enough to publish. It is a silly skill, but it was something fun to learn and do in a couple of hours. It has also inspired me to start working on some other Alexa skills. Without further ado, feel free to install the [MyWife Alexa skill](https://www.amazon.com/DanMayer-MyWife/dp/B06XDX5QPM/ref=sr_1_2?s=digital-skills&ie=UTF8&qid=1489859248&sr=1-2&keywords=my+wife)



I plan to add some more fun features eventually, but this was amusing enough for me to start with.

# Alexa Links

I have been having fun with our Echo's, you can see how I have been using [Alexa for newborns](https://www.mayerdan.com/2017/03/05/Alexa-for-newborns) to help us adjust to our baby. I plan to try to do even more with Alexa in the future.

If you want to get started with Alexa programming. Amazon made it super simple, start with the Node.js Alexa SDK Lambda skill, and work from there. See the simple example tutorials, I liked above with my code. I think there are some really cool possibilities opened up by nearly always on voice UI.

* sign up as an [Amazon Alexa developer](https://developer.amazon.com/alexa)
* read about the [Alexa skills kit for Node.js](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) and [here](https://github.com/amzn/alexa-skills-kit-js)
* getting started with [skills kit](https://developer.amazon.com/alexa-skills-kit#Ready%20to%20start%3F)
* a good [trivia game tutorial](https://developer.amazon.com/blogs/post/TxDJWS16KUPVKO/new-alexa-skills-kit-template-build-a-trivia-skill-in-under-an-hour)
* a nice [Fact skills step by step guide](https://developer.amazon.com/blogs/post/Tx3DVGG0K0TPUGQ/updated-alexa-skills-kit-fact-template-step-by-step-guide-to-build-a-fact-skill)

# Code

This is the full [source code](https://gist.github.com/danmayer/34c645ef1780fed7510cf904e04dcc7b), feel free to use it to learn some Alexa basics. It basically extends some concepts from the [sample space facts](https://github.com/alexa/skill-sample-nodejs-fact) and [high low game](https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/src/index.js) examples.

<script src="https://gist.github.com/danmayer/34c645ef1780fed7510cf904e04dcc7b.js"></script>

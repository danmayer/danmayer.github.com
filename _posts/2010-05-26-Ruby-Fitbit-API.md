---
layout: post
title: "Ruby Fitbit API"
category:
tags: []
---
{% include JB/setup %}
[Fitbit](http://fitbit.com) has been slow to release an official API, so I started work on a screen scraping version. It will become a nice gem interface to the real API when it is released. It is pretty limited at the moment, only able to pull the most basic current days info.     You can check it out here [ruby-fitbit](http://github.com/danmayer/ruby-fitbit/) on github.    Example output<pre>~/projects/ruby-fitbit(master) &gt; ruby bin/ruby-fitbit my@email.com MYPASSCalories Burned 834Steps Taken 552Milkes Walked .23Activity Levels Durations:Sedentary 11hrs 28minLightly 19minFairly 16minVery 0min    done</pre>    I also connected a quick sinatra app on [Heroku](http://heroku.com) to it so that I could embed the data in my personal blog as a widget. I will clean that up and release the code for it soon. Here is the widget at the moment. I need to add good CSS that is customizable by the user. It would also be good to make it easy for others to host their own widgets opposed to just my own data.
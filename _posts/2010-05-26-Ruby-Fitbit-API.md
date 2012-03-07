---
layout: post
title: "Ruby Fitbit API"
category:
tags: []
---
{% include JB/setup %}
<a href="http://fitbit.com">Fitbit</a> has been slow to release an official API, so I started work on a screen scraping version. It will become a nice gem interface to the real API when it is released. It is pretty limited at the moment, only able to pull the most basic current days info. 

You can check it out here <a href="http://github.com/danmayer/ruby-fitbit/">ruby-fitbit</a> on github.

Example output
<pre>~/projects/ruby-fitbit(master) &gt; ruby bin/ruby-fitbit my@email.com MYPASS
Calories Burned 834
Steps Taken 552
Milkes Walked .23
Activity Levels Durations:
Sedentary 11hrs 28min
Lightly 19min
Fairly 16min
Very 0min

done
</pre>

I also connected a quick sinatra app on <a href="http://heroku.com">Heroku</a> to it so that I could embed the data in my personal blog as a widget. I will clean that up and release the code for it soon. Here is the widget at the moment. I need to add good CSS that is customizable by the user. It would also be good to make it easy for others to host their own widgets opposed to just my own data. 

<iframe height="320px" frameborder="1" width="200px" scrolling="no" src="http://fitbit-widget.heroku.com/widget/60a4da84f6d1b0d92d8be565b9cffa8c0f0d24ccd6da0ddc1f021cc29ffbc92a" name="fitbit"></iframe>

<div class="zemanta-pixie" style="margin-top:10px;height:15px"><a class="zemanta-pixie-a" href="http://reblog.zemanta.com/zemified/7e9bcb50-5d30-472a-8b60-885abfa6e7af/" title="Reblog this post [with Zemanta]"><img class="zemanta-pixie-img" src="http://img.zemanta.com/reblog_e.png?x-id=7e9bcb50-5d30-472a-8b60-885abfa6e7af" alt="Reblog this post [with Zemanta]" style="border:none;float:right"></a><span class="zem-script more-related pretty-attribution"><script type="text/javascript" src="http://static.zemanta.com/readside/loader.js" defer="defer"></script></span></div>
---
layout: posttail
authors: ["Dan Mayer"]
title: "Introducing Churn Site to measure code churn"
image: /assets/churn-graph.png
category: Ruby
tags: [Ruby, Sinatra, Code-quality, Metrics]
---
{% include JB/setup %}

### Inspiration for the project

I have been interested in code metrics for awhile. I have built a few dev tools, and in the past tried to build startup based on code metrics. Recently I have been working on various side projects. As part of that, I wanted to put a little more work into the [churn gem](https://github.com/danmayer/churn) that I maintain. I decided building a site around [code churn](http://churn.picoappz.com/about) would force me to much more familiar as a client/user of the gem. Which would help me find more of the rough edges inspiring me improve the the project. I also thought I could learn some interesting stats by running churn against a larger variety of projects. Finally, I just wanted to play around with the idea of disposable temporary worker servers, which I have been toying around with and it seemed like a great fit for running churn against arbitrary projects.

Check out [churn-site](http://churn.picoappz.com) now, or read a bit more about the project.

### Churn-Site details

I put the app together pretty quickly using Sinatra (using [Sinatra-Template](http://mayerdan.com/ruby/2013/08/20/fast-prototyping-with-sinatra/)), [Chart.js](http://www.chartjs.org/), and personal projects that aren't yet ready for release. The site is fairly simple, it has a list of projects and allows anyone to add projects or trigger churn builds against a project. For each project it collects churn data over time per commit and charts the results over time. To simplify collecting the churn data it supports [github webhooks](http://churn.picoappz.com/instructions), which make it simple to keep churn up to date.



&nbsp; | {% unless page.image %}
![Churn Graph](/assets/churn-graph.png)
{% endunless %} | &nbsp;
:----------- | :-----------: | -----------:
&nbsp;         | [churn data for Metric-Fu](http://churn.picoappz.com/metricfu/metric_fu)         | &nbsp; 


At the moment the most interesting data is probably the average churn of a method in your project and the number of methods with churn greater than that. Which I think gives interesting insight to problematic methods at a much more specific level than only looking only at file level churn (which is the standard unit for many churn tools).

I am hoping to add class and method break downs for additional languages, but at the moment Ruby is the only language supported for anything beyond file level data.

If the churn project interests you, there is a shared [project tracker](https://waffle.io/danmayer/churn) with upcoming features queued up.

If you are more interested in the site, feel free to check out the source code to [churn-site](https://github.com/danmayer/churn-site), although it will likely be a bit hard to contribute to yet as it relies on some of my other yet to be released projects. I think after a bit more cleanup, and adding support for uploading metrics directly from the churn gem, it will be much easier to contribute to the churn-site.
If you have ideas for additional graphs of ways to break down the churn data let me know. 

I am interested in how the community can make code metrics simpler while still being able to build rich dashboards like [Metric-Fu](http://metric-fu.rubyforge.org/) or [Code Climate](https://codeclimate.com/). I reached out to the [Metric-Fu Google Group](https://groups.google.com/forum/#!topic/metric_fu/LgI8js5rZ18), with some additional details about the project to get some early feedback. From that email thread, [@kerrizor](http://twitter.com/kerrizor) was nice enough to send my first PR for the site. Then share some good ideas for future features such as, showing the velocity of churn over time and showing a breakdown of the percentage of commits that involve a file or class.

---
layout: posttail
authors: ["Dan Mayer"]
title: "Jekyll JS code formatting and running"
category: Javascript
tags: [Javascript]
---
{% include JB/setup %}

This post is an example of how to setup JS code formatting for Jekyll on Github pages along with a ability to allow users to execute the example JS code.

example JS code snippet:


<div class='js-runner'>
{% highlight javascript %}
alert('hello');
function adder(a,b){
 return a + b;
};
adder(5,8);
{% endhighlight %}
</div>  

This is just for fun and should make it a bit easier to blog about some JS code examples in the future. It also allowed me to play around with some JS code to build a simple Jquery plugin for my blog.

### Instructions

To make this work on github pages for your own blog basically follow the [Pygments for Jekyll instructions](http://www.recursive-design.com/blog/2010/10/12/static-blogging-the-jekyll-way/). Remember to link the generated Pygments css file in your layout file. Then I just hacked together a really quick JQuery plugin which I include on my Jekyll layout template, starting from [Jquery.exampleRunner](https://github.com/conzett/jquery.exampleRunner), I modified the plugin to find any div with class `js-runner` and insert a `run` button which will include the results. You can view the source by checking this blogs source, or view [my version of jquery.exampleRunner source](/assets/javascript/jquery.exampleRunner.js) directly.
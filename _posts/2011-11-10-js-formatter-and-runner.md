---
layout: post
title: "Jekyll JS code formatting and running"
category: javascript
tags: [javascript]
---
{% include JB/setup %}

This post is showing how to setup JS code formatting for Jekyll and Github pages as well as JS code running.

<div class='js-runner'>
{% highlight javascript %}
alert('hello');
function adder(a,b){
 return a + b;
};
adder(5,8);
{% endhighlight %}
</div>

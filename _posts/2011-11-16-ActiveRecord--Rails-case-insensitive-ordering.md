---
layout: post
title: "ActiveRecord / Rails case insensitive ordering"
category:
tags: []
---
{% include JB/setup %}
Rails, Ruby, ActiverecorderIt is pretty common to want to have the results of a query sorted by order. I wanted the results sorted by name on a user object. Oddly it is hard to find how to make a string based order case insensitive on google. So for other having the same issue, it is simple, just add lower(field) in the order clause and it will sort in a case insensitive manner. Now I don't care when a user doesn't capitalize the first letter of their name.    ``User.order('lower(name)').all ``
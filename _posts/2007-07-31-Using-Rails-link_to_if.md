---
layout: post
title: "Using Rails link_to_if"
category:
tags: []
---
{% include JB/setup %}
There are a lot of great helper methods in rails, and I need to remember to use more of them, one I over looked for a long time that I have found useful is link_to_if    <%= link_to_if logged_in?, "#{item.name}", :controller => 'items', :action => 'show', :id => item %>    replaces the much longer and more verbose:    <%- if logged_in? %><%= link_to , "#{item.name}", :controller => 'items', :action => 'show', :id => item %><%- else %><%= item.name %><%- end %>    I like being able to replace five confusing lines with one single simple solution. The link_to_if helper writes a link if the condition is met, otherwise it just outputs the text that would have been in the link. Very cool.    Also if you want to use [Ajax forms with multiple submit buttons in Rails, here is the solution](http://www.rails.cz/articles/2007/07/13/ajax-forms-with-multiple-submit-buttons-bug).    Lastly if you are trying to write a selector and want to make sure the test is returning the html you expect you can add puts @response.body into the test after the page call and see the response. This has been useful to me a few times.
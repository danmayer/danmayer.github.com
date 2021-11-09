---
layout: posttail
authors: ["Dan Mayer"]
title: "Grep a filtered list of files"
category:
tags: []
---
{% include JB/setup %}
I am working on a project that has view formats. Frequently when grepping the project, I want to grep only one format. I added a couple bash aliases to help me pipe a list of files to grep. Grepping through a specific list of files can be useful in many situations. Here is how to grep a list of files or set up quick aliases to make it easy to do.    First you need to get a list of files, in my case I do this with find and looking for the touch format    ``alias find_touch_views='find app/views/ -name "*.touch.erb"'``    This generates the list of files you want to grep, now you just pipe that list to grep using xargs to grep each file for a specific word.    ``alias grep_touch_views='find_touch_views | xargs grep -Ri "$0"'``    in the end this lets me run    ``grep_touch_views touch-nav ``    Modify these to fit your needs and add them to your ~/.bash_profile    ``alias find_touch_views='find app/views/ -name "*.touch.erb"'alias grep_touch_views='find_touch_views | xargs grep -Ri "$0"'``    which gives me a list of all the views that contain touch-nav.
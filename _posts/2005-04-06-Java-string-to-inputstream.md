---
layout: posttail
authors: ["Dan Mayer"]
title: "Java string to inputstream"
category:
tags: []
---
{% include JB/setup %}
If you need to make a string into an input stream it is really easy. Many people say you shouldnt convert a string into an input stream and that it is bad code design though. Since I was using someone elses library that only took input streams and all of my input was created as strings i really had no choice but to do the conversion (which is wastefull of memory cause you essentially have exact copies of the same data). Making a string into an inputstream can be done like this:    ByteArrayInputStream bs = new ByteArrayInputStream(site.getBytes());    If you have any problems leave a comment.
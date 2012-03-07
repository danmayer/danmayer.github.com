---
layout: post
title: "Appcelerator Titanium older SDKs"
category:
tags: []
---
{% include JB/setup %}
If you have a need to work with a app on a older SDK Titanium doesn't make it very easy for you. In fact they don't seem to have historical files available for download or any info on how to install older SDKs.

You can get a old version of the 0.8.x (in this case 0.8.2) SDK here:
<a href="http://share1t.com/dto0nv">Titanium 0.8.2 SDK download</a>

And after a bunch of searching I found that you should move the file on OSX to this location:
/Library/Application Support/Titanium/mobilesdk/osx/0.8.2

After that restart Titanium and the SDK should be available to you in the SDK dropdown when you create or import projects.
---
layout: post
title: "Converting Movable Type to Tumblr"
category:
tags: []
---
{% include JB/setup %}
Continuing my work on converting this blog to be a dev blog, I moved over all non development and computer related posts to my personal blog. I just converted about 1,000 posts and 3,000 comments from MovableType to Tumblr and Disqus.

I decided I would host my personal blog on Tumblr, which has been interesting so far. Sucking the old posts and comments out of MovableType and pushing them to Tumblr wasn't as easy as I had hoped. Although it gave me a chance to enjoy on of my favorite parts of being a developer. If something doesn't exist and I want it, I can built it. So I set off to write a script that would take a Movable Type blog export and import all of the posts into Tumblr and push all of the comments to Disqus. While it wasn't the easiest thing to do, it wasn't that difficult either. I have slowly built up a collection of various utilities to help port from Movable Type to Wordpress, or from wordpress.org to wordpress.com. Things that help clean up formatting or remove javascript and replace it with something allowed on wordpress.org. I added my conversion script to the inconveniently named <a href="http://github.com/danmayer/MT_WP_Converter">MT_WP_Converter</a> git repo.

<a href="http://github.com/danmayer/MT_WP_Converter/blob/master/mt_tumblr_converter.rb">View MovableType to Tumblr Converter Script</a>

<script src="http://gist.github.com/412468.js?file=movabletyle_tumblr.rb"></script>

Quick Gotchas:
* There are lots of older or bad example code on how to use the disqus API out there, I had a problem posting comments because all of the POST endpoints must end with a '/', which I didn't know. This forum post helped me <a href="http://www.ruby-forum.com/topic/180723">fix an issue posting to disqus with rest client</a>.
* Remember to turn off the facebook publishing for tumblr, before doing the import or testing it. I didn't remember this and published the same test post on facebook about 40 times. Oops!
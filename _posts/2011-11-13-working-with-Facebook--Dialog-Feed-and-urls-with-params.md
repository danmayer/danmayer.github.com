---
layout: post
title: "working with Facebook  Dialog Feed and urls with params"
category:
tags: []
---
{% include JB/setup %}
Facebook's documentation always sucks. There are many examples of working with facebooks dialog feed, but none of them include passing urls that have params. They are all simple examples like share 'http://example.com', well if you want to share 'http://example.com?foo=bar&buzz=baz' you are kind of out of luck. It took me far longer than I care to admite to figure out the right way to get facebook to share a link that included params.<br />I was using ruby and rails, creating a link with \_url and params, and then trying to encode it and send it to facebook. Below is what ended up working. Note that it seems to be a bit of an odd encoding, but it allows one to send urls with params and encoded '?' and '&' properly through facebook and have the share url include the params your expecting.<br />``facebook_shared\_url = action\_url({:foo => 'bar', :buzz => 'baz'})facebook\_url = "https://www.facebook.com/dialog/feed?app_id=#{FACEBOOK_CLIENT_ID}&redirect_uri=#{URI.encode(facebook_shared\_url).gsub('&amp;','%26')}&description=#{text}&name=#{via}&link=#{URI.encode(facebook_shared\_url).gsub('&amp;','%26')}"``
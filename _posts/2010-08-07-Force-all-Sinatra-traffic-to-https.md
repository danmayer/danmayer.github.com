---
layout: post
title: "Force all Sinatra traffic to https"
category:
tags: []
---
{% include JB/setup %}

I wanted to have all traffic on a site go through https. Since the site was on heroku. `@env['rack.url_scheme'])=='https'` wasn't a sufficient way of detecting if on https. You need to also check `(@env['HTTP_X_FORWARDED_PROTO']`.

 Below I wrote a simple before filter which you could place in the production configuration. After talking with the author of rack-ssl-enforcer I got that patched to work on heroku as well. So that is an even simpler option.    

Anyways, I spent far to long googling sinatra https, sinatra ssl, sinatra over https, sinatra secure, and heroku https, and couldn't find good pages on this for awhile. So here is the info for anyone else wanted to host secure Sinatra pages on heroku.    

          <script src="http://gist.github.com/512887.js?file=sinatra_https_redirect.rb"> </script>
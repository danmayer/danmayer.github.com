---
layout: post
title: "JS bookmarklet to switch between environment & shell function to open branch in github"
category: javascript
tags: [javascript]
---
{% include JB/setup %}

I got annoyed manually typing a new host to switch between development, staging, and production environments for some of my projects. After having yet another typo take me off to the wrong place and looisng my train of thought. I decided to whip up a better solution.

### Switch environments using bookmarklets

Basically when switching environments I was manually applying a regex replacement in my head. Then I would type out that replacement in a error prone way. Instead let's just write it once and let the browser take care of it. To do that we create a bookmark prepended with `javascript:` so the browser will run it. Then munipulate the current `document.location` to take you where you want to go.

##### Example url swapping bookmarklets


{% highlight javascript %}
	
	#bookmark named to_development
	javascript:(document.location.href = document.location.href.replace(document.location.host,'localhost:3000'))
	
	#bookmark named to_churn_staging
	javascript:(document.location.href = document.location.href.replace(document.location.host,'churn-site-staging.heroku.com').replace(':3000',''))
	
	#bookmark named to_churn_production
	javascript:(document.location.href = document.location.href.replace(document.location.host,'churn.picoappz.com').replace(':3000',''))

{% endhighlight %}
	
This is a really simple solution, which is very handy. Recently, I have found myself building a hand full of tiny custom bookmarklets to help with little tasks. More than JS bookmarklets, you can use tricks like this all over the place.

### Beyond bookmarklets, tiny shell helper functions

I have been automating tasks with shell functions as well. The same basic idea as the bookmarklets above of having a tiny function to replace a repetitive error prone task. I think encoding logic like this into a bookmarklet or a shell function is a great way to remember the tricks you learn, and encode the knowledge in a way that is sharable. In fact [@tcopeland](https://twitter.com/tcopeland) shared a great shell function with me recently, to quickly jump from the terminal to my branch view in the browser.

	function open_branch { open http://github.com/danmayer/`basename \`pwd\``/tree/$(git symbolic-ref head| sed -e 's/.*\///g'); }

The code above will open my browser to github on my current project and the branch I am currently working on.

I use a number of other shell functions to simplify my day to day tasks. I highly recommend building some of your own functions and getting them checked into your dotfiles repo (you do have your dotfiles in a git right?). If you have any great bookmarklets or shell functions definitely let me know by commenting or sending a note to [@danmayer](http://twitter.com/danmayer) on twitter.
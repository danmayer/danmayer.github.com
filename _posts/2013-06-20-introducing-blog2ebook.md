---
layout: posttail
authors: ["Dan Mayer"]
title: "introducing Blog2Ebook"
category: Ruby
tags: [Ruby, Development, Products, Ebooks]
---
{% include JB/setup %}

## Take your Blogs to go

I recently have been working improving my ability to quickly prototype projects from the ground up. I feel like in my day to day work I am frequently working on very large established systems. Where slow steady progress and refactoring are king. Working on smaller apps to try out new ideas and development methods can be a fun and educational habit. I built this app initially very quickly to solve a problem of my own. I have then expanded it a bit to build out out a app that might be useful for some to some other people.

The result is a tiny app, [Blog2Ebook](http://blog2ebook.herokuapp.com/)

## What does it do?

Blog2Ebook supports importing from 3 different formats to make a Kindle book:

* RSS feed to Kindle
* Single post to Kindle (useful because some https sites no longer allow bookmarklets)
* Copied article text to Kindle

You might be thinking there are tons of solutions for this. Like [Readability](http://www.readability.com/) and [Amazon's send to Kindle](http://www.amazon.com/gp/sendtokindle). True but each seem to have some problems and is missing something I want. 

* Nothing seems to fetch & format a full blog the way I want.
* Readability is mostly setup for single articles as a bookmarklet, but the newer JS restrictions on some https sites like github prevent the bookmarklet from working
* Amazon allows you to email files to the Kindle, but sometimes you just want to paste some text. You have to create and attach a text file to the email opposed to just having the email body be the content.

So I built a little app and learned a ton about eBook formatting, publishing, and various eBook formats. I think I might want to self publish something in the future and this has prepared me with some knowledge of the self publishing problems and process.

Supporting very simple eBook publishing of a full blog with all content is the primary goal of the project. The other features are secondary and basically around because they were easy to add on and solved some problems. At this point I am starting to look a bit more into how to best format the content and embed related content into the books.

## App details and Resources

You can find the project Blog2Book, [convert an RSS feed to Kindle eBook](http://blog2ebook.herokuapp.com/), hosted on [Heroku](http://heroku.com).

The source code is available on github, as [Blog2Ebook is open source](https://github.com/danmayer/blog2ebook)

If you have thoughts, problems, or ideas [send feedback to issues](https://github.com/danmayer/blog2ebook/issues) for the project.

## Technologies Used

I will likely post a bit more about the development process and specific examples of tech usage in another post, but I wanted to provide some details on the tech supporting the project.

* Built using [Sinatra Template](https://github.com/danmayer/sinatra_template), a personal project I maintain to quickly bootstrap small Sinatra projects. I will describe it more in a future post, but it makes it easy to get up and running with a web or API project using Sinatra and the gems and features I am experienced using.
* Single Article Publishing, document content parsing
  * [Readability's Api](http://www.readability.com/) to better support single article publishing
  * I also checked out [Pismo](https://github.com/peterc/pismo) and [Ruby Readability](https://github.com/cantino/ruby-readability) which is a Port of arc90's readability project to ruby. In the end single article support most often uses Readability's API as I found it gave the best results.
* [Redis Cloud by Garantia Data](http://redis-cloud.com) A awesome cloud redis provider
* [Mailgun](http://www.mailgun.com/) to power email, which is the kindle delivery mechanism.
* RSS feed processing was done with [rest-client](https://github.com/rest-client/rest-client) and [nokogiri](http://nokogiri.org/)
* Amazon's [KindleGen](http://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000765211) to package up HTML content into .mobi files. Which allows packaging images in with the content as well as embedding book meta data. (mobi support with images is on a work in progress branch on not live yet)

Because this is using the free tier of some of the supporting services, I limited daily usage of the app to below the free tier limits. So please be kind to the service, if it starts to run out of capacity I will take a look at expanding it out.
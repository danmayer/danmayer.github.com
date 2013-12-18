---
layout: post
title: "Introducing Ruby Resume, a project to create and host your resume"
category:
tags: []
---
{% include JB/setup %}

Ruby, Github, Open source, Programming, Heroku, Markdown, Tools, ResumeThe [Ruby Resume project](http://github.com/danmayer/Resume), is a project I started to make it easier for Ruby developers to create, host, share their resume, and keep it up to date. It is an open source project, that anyone can use to help manage their resume online. It offers a variety of options and you can take or leave any part you wish. Basically, you fork the project, alter some things for your needs, and can contribute interesting additions back to the shared Ruby Resume project.    The project uses Sinatra, Markdown, and a collection of Rake tasks to get the job done.     What does the Ruby Resume project do?- Supports deploying your resume to [Heroku](http://heroku.com) in a variety of formats.

- Easily deploy your app to any Sinatra compatible host

- Allows simple publishing of your resume to your github personal page.

- It makes it simple to publish your resume as a gem. I got the idea for a [personal resume gem](http://groups.google.com/group/rails-business/msg/68cf8a890c0d4fc8?pli=1) from [Eric Davis](http://twitter.com/edavis10).

- It uses Markdown, which integrates well with [Github Jobs](http://github.com/blog/553-looking-for-a-job-let-github-help)

- It currently suppots HTML, LaTeX, and Markdown. Soon it will support PDF, RTF, etc...
    I built this because I had to publish and start updating my resume again after not dealing with it for 3 years. I wanted something that would simplify the whole process. I wanted my resume under git, and I wanted to be able to quickly deploy any changes online and support a large number of formats.    Anyways check out the [source on Github](http://github.com/danmayer/Resume) and the Readme which gives simple instructions on how to use the project. Or what the video below which demonstrates how to use this project for your own resume.    Live Examples:- My [resume on Heroku](http://resume.mayerdan.com)

- My [Github personal page](http://danmayer.github.com)

- My personal resume gem is, [danmayer-resume](http://rubygems.org/gems/danmayer-resume), which can be installed using ``gem install danmayer-resume``, then execute danmayer-resume
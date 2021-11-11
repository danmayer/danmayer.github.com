---
layout: posttail
authors: ["Dan Mayer"]
title: "Fast Prototyping with Sinatra"
category: Ruby
tags: [sinatra, ruby, programming, practices]
---
{% include JB/setup %}

## Quickly prototyping apps with Sinatra

When I am quickly playing around with a new app or idea. I often want to be very minimal and fast. Half the time I never even get the app up and running anywhere other than my machine. Sometimes I never get past an index.html with some words and inline JS. I have found that being able to quickly setup a nice basic development environment makes it more likely I will play around with ideas, and explore new projects.

After various approaches I have found that for me, I am very happy to do my fast prototyping in Sinatra. I can quickly get an application or api started with Sinatra, with a  bit of help it provides all the basics I need. After a couple projects, I have simple deployment of the projects down for either EC2 or Heroku. I can start up and get into the details of my idea amazingly quickly, which is great. After starting a couple projects with Sinatra I was tired of taking the time to setup some of the basic Sinatra boiler plate, the way I liked. Eventually after refactoring a few projects, I found a Sinatra style and setup that I like. I standardized on gems and configurations that solved common problems that I ran into. I built out a skeleton app to help me get up and running on my projects more quickly. It is simply my personal [Sinatra Template](https://github.com/danmayer/sinatra_template)

## Why use a Sinatra Template (or skeleton)?

Starting a brand new app takes time and much of the initial configuration is the same. This doesn't mean I don't fully understand the app, Sinatra Template tiny and it has been abstracted out of a few real projects. I built on it and then improved on my template as I began using it to generate newer apps.

If I choose Sinatra over Rails for a web project, in part I am assuming less front end needs, overall smaller project, and a codebase that requires less structure. If this is more than a prototype, microsite, or expected to grow into a larger application, I recommend just starting with Rails. For that you can take a look at [quickly starting Rails apps with Composer](http://mayerdan.com/ruby/2013/05/27/fast-start-rails-with-composer/), which is another post in this series. So why not just start with a blank Sinatra app. Sinatra is very barebones, my Sinatra Template gives me the basics I expect.

*  environments (multiple procfiles), server startup (foreman), console (configured Pry), tests, my preferred license, development mode app reloading (shotgun), better_errors in development, flash message support, sessions, logging, admin authorization
* A solid starting design, Sinatra Template has [Twitter Bootstrap](http://twitter.github.io/bootstrap/) configured and ready to go out of the gate
* I am setup to perform most of my basic JS needs via Jquery which is ready to go from the beginning
* Having a nice familiar base app as a starting point helps me more quickly get to building application specific pieces of code and get my idea on the page. Using a normal configuration with gems I am familiar with.

Really I am not advocating others to use my Sinatra Template, it is so small and simple that I recommend building your own. Feel free to use mine (or one of the many listed at the bottom of this post) as a example and starting point. Then customize it the way you like, as you built multiple Sinatra apps. Become familiar with your setup, and update it as you improve your Sinatra projects. When I add a new gem or technique to a couple of my projects I back port the features to my original template. Things like the better_errors gem, Pry, and Foreman weren't originally part of my Sinatra template.

## Nothing to development with Sinatra Template

The example below is creating a new application called test_project.

    cd ~/projects/
    git clone https://github.com/danmayer/sinatra_template.git
    cd ~/projects/sinatra_template
    rake clone_web project=test_project

This should give you output like

    building project: test_project
    running mkdir test_project
    
    running cp -R ./sinatra_template/web/ ./test_project/
    
    running cp ./sinatra_template/README.md ./test_project/

    running rm -rf .git

    running git init
    Initialized empty Git repository in /Users/danmayer/projects/test_project/.git/
    running rm -rf .rvmrc
    
    running rm -rf tmp/*
    
    running echo "rvm use ruby-1.9.3-p392 --create"  >> .rvmrc
    
    running find ./ -type f -exec sed -i '' 's/SINATRA_TEMPLATE/test_project/g' {} \;

Then you can start to work on your project

    cd ~/projects/test_project
    #agree to the rvm ruby version
    bundle install
    foreman start
    open http://localhost:3000
    
    #also a single test should exist and pass
    bundle exec rake
    
## From development to production

Great we have an app how do we get it out there for the world to see? For personal projects I mostly deploy initially to Heroku and only move to a larger more real production environment if the project really demands it. Getting a basic app to Heroku is easy. Obviously in the instructions below you need to give your app a different name.

    heroku apps:create sinatratestproject
    git add .
    git commit -a -m "initial commit"
    
    git push heroku master
    #thats it you should be live
    open http://sinatratestproject.herokuapp.com
     
## Sinatra from nothing to production

Following the steps above it how I start most of my Sinatra apps these days. Getting me up and running very quickly so that I can focus on the goals at hand and not worry about some of the initial app creation boilerplate. I have used this on a couple projects now and I am pretty happy with my Sinatra setup. I have continued to patch and evolve my base Sinatra template, and I expect it will continue to improve over time.

I built both [blog2ebook](http://blog2ebook.picoappz.com/) and the [Code Churn](http://churn.picoappz.com/) site using Sinatra Template, if you would like to checkout some examples.

#### Like the idea but not my Sinatra Template, Alternatives

* [Zapnap's Sinatra Template](https://github.com/zapnap/sinatra-template)
* [Oren's Sinatra Template](https://github.com/oren/sinatra-template)
* [Sinatra Skeleton](http://blog.yannick.io/ruby/2012/07/28/sinatra-skeleton.html)
* [Abachman's Sinatra Skeleton](https://github.com/abachman/heroku-sinatra-skeleton)
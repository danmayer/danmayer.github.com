---
layout: posttail
authors: ["Dan Mayer"]
title: "fast start rails with composer"
category: Ruby
tags: [Rails, Ruby, Programming, Practices]
---
{% include JB/setup %}
    
## Quickly getting started with Rails 3.2

This post explains how I <!--more--> quickly get an application started for Rails 3.2.x.The post is part of a series covering quickly prototyping projects.

When I start a new rails project, I want to quickly get going with a login system, admin and other user roles, a nice default app template / style, and a JS framework I can build on. After looking at several options I ended up going with [Rails Composer](http://railsapps.github.io/rails-composer/). It has a number of packages that work out of the box. It is very configurable, it is very easy to get up and running. [Railsapps](https://railsapps.org) used to have a lot of free tutorials coving using rails-composer, now they [sell detailed tutorials to support their work](https://tutorials.railsapps.org/). You can still generally just read the read me for a project and go through the basic options to get everything working. I generally follow the [Rails App for Devise with CanCan and Twitter Bootstrap](https://github.com/RailsApps/rails3-bootstrap-devise-cancan) example for my basic app base and further configure it myself from there.

## Why use Rails composer?

Starting a brand new app takes time and a lot of the initial configuration is very much the same. The composer options I choose are well understood common Rails gems I would often choose for my initial setup in the first place. I understand all the pieces that I setup with Rails composer so I don't feel like I am giving up any understanding by starting with the generated app. I would recommend making sure you 'could' setup any of the pieces Rails composer configures for you, and understanding them before using them in a generated project. If I am programming in my personal time I often have a problem I want to solve or a specific idea I want to test, getting to the point I can work on the primary focus with little lost has a big value to me.

If I choose Rails over Sinatra for a web project, in part I am assuming I will have higher front end needs for the project. Which likely means I will have accounts, logins, roles / rights, and want a more polished look and feel. Out of the box Rails requires you to setup a lot just to meet those basic needs. With Rails composer, I am basically good to go.

* A solid starting design, Rails composer will give me [Twitter Bootstrap](http://twitter.github.io/bootstrap/) configured and ready to go out of the gate
* I am setup to perform most of my basic JS needs via Jquery which is ready to go from the beginning
* Accounts, roles, and rights are covered by : Devise, Cancan, and Rolify. Quickly covering my basic account management needs.
* The composer setups up a great way to share application specific configuration that isn't checked into the code repo via [Figaro](https://github.com/laserlemon/figaro). Which also supposed publishing the environment to Heroku my preferred production deployment for personal projects.
* Having a nice familiar base app as a starting point helps me more quickly get to building application specific pieces of code and get my idea out there. Using a normal configuration with gems I am familiar with.
* Stand on the shoulders of giants, I don't want to spend my time building yet another authentication system, building in features like forgot password, email confirmation, etc.

## Nothing to development with Rails composer

The example below is creating a new application called nothingcalendar2, which is a new version of a app I created awhile ago called nothing calendar to try out some JS ideas. Now I want to convert it to a modern rails application and add some new features. 

    rvm use ruby-1.9.3
    
    #this will ask you some configuration options
    rails new nothingcalendar2 -m https://raw.github.com/RailsApps/rails-composer/master/composer.rb
    
    cd nothingcalendar2
    bunlde install --local
    bundle exec rake db:create
    bundle exec rake db:migrate

    #set the data to match your accounts / info
    open config/application.yml

    #this will use the data set in the last step to create accounts in the dev DB
    bundle exec rake db:seed

    # You have a app
    rails s
    open http://localhost:3000/
    
    # check the tests
    bundle exec rake
    
    #create a new repo
    https://github.com/new
    git remote add origin git@github.com:danmayer/nothingcalendar2.git
    git push -u origin master
    
## From development to production

Great we have a app how do we get it out there for the world to see? For personal projects I mostly deploy initially to Heroku and only move to a larger more real production environment if the project really demands it. Getting a basic app to Heroku is easy. Obviously in the instructions below you need to name your app something else.

    heroku apps:create nothingcalendar2
    
    #edit Gemfile
    #add the group option to sqlite3 as you don't want it to install on heroku
    #set group to development and test
    #you could use postgres locally since that is what you are using on heroku in production. That is the recommended setup but for a toy project many people don't have postgres locally
    gem 'sqlite3', :group => [:development, :test]
    #add postgres to Gemfile only for production group
    gem 'pg', :group => [:production]
    bundle install
    
    git push heroku master
    heroku run rake db:migrate
    #push the settings in your config/application.yml to heroku
    bundle exec rake figaro:heroku
    #seed the database with admin account
    heroku run rake db:seed
    
    #you should be live
    open http://nothingcalendar2.herokuapp.com/
    
## Rails from nothing to production

Following the steps above it how I start most of my rails apps these days. Getting me up and running very quickly so that I can focus on the goals at hand and not worry about some of the initial details of having a basic infrastructure to build on. I have used this on a couple projects now and I am pretty happy with the process. I will likely continue to use this to quickly test out ideas, although for many simple progress I prefer the even lighter weight Sinatra setup, but that is for another post.

I think this is a great way to get going. Not everyone agrees with me for the opposing view checkout, [Why we don't use a Rails template](http://thunderboltlabs.com/posts/why-we-dont-use-a-rails-template.html) by [thunderboltlabs](http://thunderboltlabs.com/).

#### Like the idea but not Rails-Composer, Alternatives

* [Raygun](https://github.com/carbonfive/raygun)
* [Suspenders](https://github.com/thoughtbot/suspenders)
* [Primo](https://github.com/cbetta/primo)
* [Appscrolls](http://appscrolls.org/)


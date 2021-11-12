---
layout: posttail
authors: ["Dan Mayer"]
title: "Smokescreen: Smoke tests for Ruby"
category: Ruby
tags: [Ruby, Testing]
---
{% include JB/setup %}

This post is a cross-post with the [livingsocial tech blog](https://techblog.livingsocial.com/blog/2013/09/19/smokescreen-smoke-tests-for-ruby/). Livingsocial was nice enough to help opensource smokescreen so I could blog about it.

There is a staggering number of definitions of [smoke testing](http://en.wikipedia.org/wiki/Smoke_testing), and a good subset about how it relates to software development. I think the most common definition related to software can be quoted from the wikipedia article, "A subset of test cases that cover the most important functionality of a component or system." You can also find some good explanations covering [smoke tests on stack overflow](http://stackoverflow.com/questions/745192/what-is-a-smoke-testing-and-what-will-it-do-for-me). 

As our test suite grew we had a need for quickly 'smoke testing' a project before deployment. We had a need because it was no longer reasonable to run the full test suite before every small commit. We wanted to run a smart subset of tests before deploy. Our smoke tests wouldn't cover everything, but it would catch silly mistakes (syntax error, broken config files, etc) and check for catastrophic errors that could impact key actions, like our purchase flow. Obviously this is only necessary for projects that have very large and slow test suites, if your project has a suite that completes in 5 minutes or less congrats!

At the moment running smokescreen prior to deploy is part of our deployment 'checklist', but it could be easily integrated directly into our deployment tools. Eventually one could see integrating <!--more--> smoke tests directly into the deployment process to run on the production boxes prior to starting up new unicorn workers. While it doesn't protect us from every mistake it gives us confidence to deploy as frequently as we do while reducing the risk of making larger mistakes.

There are a number of existing gems related to smoke testing available, [smokeit](https://github.com/timonv/smokeit) a tool for smoketesting urls, similarly [antismoker](https://github.com/yyuu/antismoker) helps build rake tasks to test urls which can be run as part of CI. Our primary need wasn't to quickly check endpoints for http 200 success responses, but to get fast feedback on the critical functions of our app. We wanted to always run a minimum set of tests to cover our most important actions, as well as run tests likely to be impacted by the recent changes. We ended up building smokescreen to meet our needs, originally as a rake task and eventually extracting it out to a gem.

### Setting up Smokescreen

Setting up smokescreen is fairly easy, include the gem in your `Gemfile`, and then require it in your primary `Rakefile` or in any of your `lib/tasks/other_rakefiles`.

	#in Gemfile
    group :development, :test do
      gem 'smokescreen'
    end

	#in a Rakefile
    require 'smokescreen'
    
	#below require in rake file
    Smokescreen.configure(:critical_tests => ["test/functional/purchases_controller_test.rb", "test/functional/important_controller_test.rb"])
    
After you require smokescreen make sure to configure the critical tests. Just pass in an array of tests that you want to be be considered part of the critical set of tests. 
    
### After configuring Smokescreen

You can view all the tasks together running `bundle exec rake -T smoke`, as you can tell there are four main groupings of tests current, deploy, previous, and recent. 


	rake test:smokescreen:critical:functionals                # Run tests for critical:functionals
	rake test:smokescreen:current:all                         # run most important tests as well as tests for currently changed files (git diff)
	rake test:smokescreen:current:changed                     # run tests related to currently changed files (git diff)
	rake test:smokescreen:current:changed_tests               # run currently changed test files (git diff)
	rake test:smokescreen:current:functionals                 # Run tests for functionals
	rake test:smokescreen:current:functionals:changed_tests   # Run tests for functionals:changed_tests
	rake test:smokescreen:current:units                       # Run tests for units
	rake test:smokescreen:current:units:changed_tests         # Run tests for units:changed_tests
	rake test:smokescreen:deploy:all                          # run most important tests as well as tests for files changed since the last deploy
	rake test:smokescreen:deploy:changed                      # run tests related to files changed since last deploy
	rake test:smokescreen:deploy:functionals                  # Run tests for functionals
	rake test:smokescreen:deploy:units                        # Run tests for units
	rake test:smokescreen:previous:all                        # run most important tests as well as tests for previously changed files (last commit, git show)
	rake test:smokescreen:previous:changed                    # run tests related to previously changed files (last commit, git show)
	rake test:smokescreen:previous:changed_tests              # run previously changed test files (last commit, git show)
	rake test:smokescreen:previous:functionals                # Run tests for functionals
	rake test:smokescreen:previous:functionals:changed_tests  # Run tests for functionals:changed_tests
	rake test:smokescreen:previous:units                      # Run tests for units
	rake test:smokescreen:previous:units:changed_tests        # Run tests for units:changed_tests
	rake test:smokescreen:recent:all                          # run most important tests as well as recently effected tests (git diff + git show)
	rake test:smokescreen:recent:changed                      # run tests for currently changed files (git diff)
	rake test:smokescreen:recent:changed_tests                # run recently changed test files (current and previous commit test files)
	rake test:smokescreen:recent:functionals                  # Run tests for functionals
	rake test:smokescreen:recent:functionals:changed_tests    # Run tests for functionals:changed_tests
	rake test:smokescreen:recent:units                        # Run tests for units
	rake test:smokescreen:recent:units:changed_tests          # Run tests for units:changed_tests


### Running Smokescreen

The most common task I run is `rake test:smokescreen:recent:all`, as it is the most comprehensive. That task runs the critical tests, test files related to currently change files (as found by git diff), and test files related to recently changed files (as found by git show). It is easy to target more specifically if you choose.

I also find running `rake test:smokescreen:previous:changed_tests` or `rake test:smokescreen:previous:all` handy when doing code review on another developers cherry-picked commit. Making sure the tests don't have one of the "it works on my machine" bugs.

Smokescreen has only been used on a small set of projects, and doesn't currently support anything other than `test:unit`. Now that it is extracted out from a single application, I plan to user it in other projects and hopefully it will be easy to make some improvements to the tool. I already know there are easy wins that could be made to improve the process of matching likely related test files to recent changes. Other possible future features are parallel tests support, recently failing tests from CI or previous local test runs, and rspec support.

Finally wanted to mention, as we have improved our test suite, and moved CI to run a massive split of [parallel tests](https://github.com/grosser/parallel_tests), smokescreen has been less important than in the past, but it is still something I run nearly daily and have enjoyed having in my toolbox.
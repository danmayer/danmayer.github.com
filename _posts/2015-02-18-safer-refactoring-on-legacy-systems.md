---
layout: post
title: "Safer Refactoring on Legacy Systems"
category: Programming
tags: [Programming, Refactoring, Process, Ruby]
---
{% include JB/setup %}


A small refactoring project I took on turned into a crazy journey. Filled with frustration, production bugs, and quick fixes...

<blockquote class="twitter-tweet" lang="en"><p>started one of those, &quot;it will be an easy little refactoring&quot;… Now I am lost in a sea of yak hair on a ship crewed by yaks… What happened?</p>&mdash; Dan Mayer (@danmayer) <a href="https://twitter.com/danmayer/status/564940251911557120">February 10, 2015</a></blockquote>

As you can see from the time between these two tweets it also, was burning away on my back burner annoying me for 8 days. I worked on other things for most of that time while it went through some PR review and QA, but it was still a task to check in on each day.

<blockquote class="twitter-tweet" lang="en"><p>Hooray! Started as an estimated 2 hr refactoring -&gt; 9 hours of coding, 1 1/2 week of QA / PR review -&gt; 138 prod errors -&gt; fix -&gt; it&#39;s live!</p>&mdash; Dan Mayer (@danmayer) <a href="https://twitter.com/danmayer/status/568114276344336384">February 18, 2015</a></blockquote>

# There has got to be a better way

TLDR; I did a refactoring, which I believe should have been done. After I completed the release, I realized how I could have done it safer and with less stress all around. Read the breakdown and two solutions to see a better way to handle situations like this.

First let me start by saying I am very aware of [responsible refactoring](http://naildrivin5.com/blog/2013/08/08/responsible-refactoring.html), which is a great thing to keep in mind. I knew when I first started this refactoring it would be a little dangerous, but decided to take it on for a few reasons.

* we had extracted the functionally of the app into a gem
* the gem had made it into usage in ALL other consumer facing applications
* the legacy app code was basically a duplicate
* the legacy app code had fallen out date
* the legacy app code was missing some features
* the refactoring has been suggested since the initial creation of the gem and beyond being out of date the code methods and results were beginning to diverge.

OK, this made me think it was worth the risk and there were risks.

* the legacy app is poor testing
* the legacy app was notoriously hard to manually test
* the code wasn't designed into the app well in the first place, it was all over the place `git diff => Showing  43 changed files  with 130 additions and 492 deletions.`
* while the original code was out of date and didn't always match the results of the newer gem, we might have started to "code 
around" the issues, you know "it's not a bug, it's a feature."

As @tcopeland said, "ha whew. Replacing lots of global-ish methods is tough"

# Quick breakdown of the problem

Since every situation is a bit different. I want to try to give a bit better idea of the problem I faced.

    #app/controllers/application_controller.rb
    include HelpfulModule
    
    # Hey cool, it is mixed in all our controllers, lets really make this global
    # we can just include a bunch of helper methods,
    # and sprinkle usage of this all over the view layer as well!
    helper_method :helpful_check?
    helper_method :give_me_some_type_name
    ...# a surprisingly large set of these
    helper_method :is_some_special_thing?
    
    #app/controllers/api/various_base_controller(s).rb
    include HelpfulModule
    
    #app/controllers/modules/helpful_module.rb
    module HelpfulModule
      protected
    
    	def helpful_check?
    	 !!(rand > 5)
    	end
    	
    	def give_me_some_type_name
    	  case
       	    when (helpful_check?) then true
            when is_some_special_thing? then false
            else true
          end
    	end
    
    	... #many more methods
    	
    	def is_some_special_thing?
    	  return true
    	end
    
    end
    
    #many controller and module call sites
    app/controllers/modules/auth_support.rb
    app/controllers/home_controller.rb
    ...
    
    #many view layer call sites
    app/views/cool/index.hml.erb
    app/views/something/_partial.hml.erb
    ...

# The way I did it

I didn't realize the code had spread so far and wide through out the app and just figured. I could create the object one place in the request and then switch all the calls to it. Basically the change was something like below.

* in `app/controllers/application_controller.rb`
  * I removed the module: `git diff => -  include ContentNegotiation`
  * I removed all the various helper methods `git diff =>`
  
        - helper_method :helpful_check?
        - helper_method :give_me_some_type_name
        ...# a surprisingly large set of these
        - helper_method :is_some_special_thing?
        
  * I added an accessor
  
         def helpful_thing
           @helpful_thing ||= Gem::HelpfulModule.new(request, "stuff")
         end
    
* I removed the module `rm app/controllers/modules/helpful_module.rb`
* I then updated all those many many call sites `git diff =>`
  
        #app/controllers/home_controller.rb
        - is_some_special_thing?
        + helpful_thing.is_some_special_thing?

After thinking, I had made all the changes. I ran the test suite. I had a bunch of errors and failures. I missed various calls. Some places didn't have access to the initialized object. I fixed both good and bad tests (tests which basically had hard coded expectations), and got everything passing. I looked at my diff and realized I had been all over the code, changing far more files than expected and having to fix more unexpected failures than imagined. I knew this had become riskier than initially imagined and it took me far longer to get to the complete state than I thought it would. I knew that the tests in the legacy app weren't covering the change well enough and went though some manual testing and fixed. I then passed it off to the mobile team to help QA since it would effect some mobile APIs. We finally deployed it, and boom exceptions. A quick rollback and fix, deploy... All seems good a few hours later some error reports come in, with another minor issue which didn't cause any exceptions... Another fix and the long 8 day journey of the minor refactoring is over. 

# The way I should have made the change

I should have broken this into two steps. It would have made the initial estimate far more accurate at a few hours. It would have significantly reduced the risk. It also would have reduced the scope of where I needed to focus testing both manual and automated to catch any unexpected changes.

* Replace global methods implementation in module wrapper to simple make calls to the new gem. Initially leaving all callers as they are
* After that has been successfully deployed, slowly move callers to direct calls, where it makes sense. Otherwise leave the level of abstraction as a single container for all interactions with the gem.

That change looks something like this

    #app/controllers/modules/helpful_module.rb
    module HelpfulModule
      protected
    
    	def helpful_check?
    	 helpful_thing.helpful_check?
    	end
    	
    	def give_me_some_type_name
    	  helpful_thing.give_me_some_type_name
    	end
    
    	... #many more methods
    	
    	def is_some_special_thing?
    	  helpful_thing.is_some_special_thing?
    	end

       private
       
       def helpful_thing
         @helpful_thing ||= Gem::HelpfulModule.new(request, "stuff")
       end
    end

Which is obviously a much simpler and less invasive change. It is easier to reason about and test. It is something I could have completed much faster and released with more confidence.

# Conclusion

Yes this is actually pretty common refactoring advice. It has been around nearly as long as the concept of refactoring to do this type of change in two or more steps opposed to doing it all at once. For me the point was that it is easy to forget the challenges of working with a large and legacy production system. The complexity demands additional attention both in terms of adding features and making "smaller" refactorings. A big part of any change to a large complex system at the heart of a companies systems, should be a roll out plan, always thing of the safest way to try to roll forward. Sometimes that is feature flags, ab testing, limiting to employee users, and sometimes it is breaking up a refactoring into smaller easier and safer steps, like I should have.

Dan Mayer's Developer Blog
===

## Todos

* Fix look of code imports that used `` back ticks
* update formatting / theme, font size etc (look at using one of the nicer plugin fonts)
* pick using tags or categories or both and import them
* twitter integration?, show recent tweets, could use nathan H's thing
* Coderwall integration (Achievements, projects, etc)

## Topic / Post Ideas

* DCI is sort of interesting but seems to go against LOC==bugs and Kingdom of Nouns post which really makes me upset to see DCI with .excute methods seems close to what I like and envision but actually to heavy weight
  * http://vimeo.com/8235574
* post about JS titles I saw and incorporated along with having JS runner allow users to activate some of the example code.
    * <div class='blog-header' data-title='Bug to code ratios'></div> 
* Graphite unused view layout / partial tracking
* Smokescreen and the importance of fast test / fast feedback loop, and that sometimes if the tests are really slow they actually have a negative value even if they do test some edge case
* Writing code vs. app builders / generators, and how I am disappointed to still be building applications with dense text in a 20+ year old editor… There has been progress, but with progress some people should be able to create programs knowing far less of the underlying details. (How yeoman, meteor, the JS world, and closure are making tiny but at least better progress on on modern flows)
* Automate everything, all the way down (chef/ec2, dot files / emacs, Boxen looks cool because of this, etc)
* Tiny blog post about copy_files_and_maintain_structure method for ec2 copying
* Fixing and improving my emacs setup, with links to some of the places I picked up tips, Avdi's blog, etc
* Play with some of the easy to build automated mobile apps to build a silly app (possibly review for api reviews)
* Build something random to mashup Spotify play with artist info and reviews pulled from wikipedia, etc
* just include in your actual test class the module then hit methods on test class itself. (do this for nothing calendar and blog post about it)
* Best things to happen to developers, AWS ec2 and instance / cheap ways to test all sorts of infrastructure. Github and all the great tools and integration around the github community. Online courses / education. Easy payments (stripe, square, etc)… Lacking from this list is great stuff from google, who actually has more restrictions and issues working with there data and apis… Try just getting some search data out of there system… etc Great time to be a developer
* CI it isn't just to fix the 'it works on my machine problem'. It also is a developer performance multiplier. There are some tests that ever dev shouldn't be spending time and shouldn't normally need to worry about testing for each change. The cost of over testing and wasting developers time is worth worrying about. (Running the same test in 5 browser types, great on CI, shouldn't be part of every dev test run, fuzzy testing is great for CI opposed to local runs, testing the current system versus full integration system against live external dependancies), True integration tests… etc
* blog about factories and fixtures
  * factories for very custom
  * fixtures for all basic example objects
  * speed and how it really matters
* Getting over the fear, sometimes everyone is afraid of a big scary piece of code. For months people know about the problem and propose all sorts of large solutions that might take weeks to implement so no one touches it. After talking about that and coming up against a wall in about one day I was able to get over 2X performance increase, drop a extremely long running data sync and kill off endpoints that were some of the largest blockers in migrating away from that system.
* decided that live monitoring is likely more important than amazing test suite... Some things you can test for ever and the bug will still get to production, and once it is there you want a way to know that as quickly as possible 
* The industry couldn't keep up with spammers
  * commenting (spam), blogging (content farming), and the slashdot effect (spikes taking down sites) all outpaced the ability of normal people to maintain systems. Not to mention hacking against these systems. 
  * Facebook solve peoples issues to publish themselves
  * Twitter is the same as facebook
  * we moved from the old media distribution systems and channels to the new media distribution setups. Facebook and google are the new distribution kings
  * If you publish your content and don't have a site you post to facebook / google plus. They get more of the benifit  than you, but your distribution is wider
  * A reason people use FB and SMS messages over email now? people don't email but message through these distribution systems because people trust them more, because there was less spam / attacks. And they better integrated with SMS and  mobile publishing than any other system
* lessons learn from fitbit mini
  * mobile changes fast
  * more UI design and CSS harder than the backend
  * USE rails not sinatra/etc if you have ANY front end work
  * having a real API is much nicer than scraping
  * building a small simple production released app is actually much more work than I would have guess. even when KISS
  * other thoughts ideas mention mobile web / then android app, with api.
* make my own scaffold replacement gem http://www.viget.com/extend/rails-3-generators-scaffolding/ look more at generators build one and post about it
* blog on happiness personal growth as a dev, vs getting stuff done... vs loner culture and being involved in the community
* rebuilding AOL, why are we rebuilding AOL. The status message is just an away message. A facebook page is just a AIM profile picture and text box. The pictures and things shared in the facebook walled garden are the same as AOL only sites... facebook.com/nike is the same as aol target keyword: nike
* We do we program?
  * Not why we currently on a day to day basis code, for a paycheck, a company a career, a family
  * Why did we get into programming?
  * I did get into it because I saw the ability to free information and send it across the world. To share knowledge so easily and freely. It was such a powerful idea that it scared governments (china firewall US Skype)
  * I saw it as being able to contribute far more than a single persons abilities towards one thing. Early on I realized if I could 'codify' a strategy to solve a problem in a repeatable way it was far more powerful than manually doing the error prone task myself. It is part of what drew me to programmable calculators and early programming. To extend my own abilities beyond what I could actually do. To be able to extend my work beyond what I as a individual could do for a company.
  * We have seen this we have likely all coded something that replaced anthers job, which is a bit sad in one sense, but in another it just should increase the productivity of everyone. In my mind that frees these people up to help work on the next tasks as there are many that still need actual people to help determine and make decisions and figure out what we can make a truly repeatable process.
* Working with great developer's is awesome, and list some of the great devs we work with and there blogs and posts.

## Possible Project Ideas

* Kindle Ebook walking tours Start with DC and partner with friends to have them write some about other cities   
* tequila review blog with Erin
  * The Top 10 Best Tequila Websites | Taste Tequila http://tastetequila.com/2010/the-top-ten-best-tequila-websites/ 

## Post Ideas I might do on LS techblog or clear with work to post here
* Rails 2.3.X view tracking, about the work I did track all the view layouts, templates, in partials in deals to remove dead files
* Smokescreen, to discuss the importance of fast feedback loops and when a test suite grows to large good ways to focus in on the important changes (I actually run `bundle exec rake test:smokescreen:all_current` on almost all changes now which runs the critical tests along with test files that are likely to be affected by current changes)

## Possible short posts more likely tweet sometime, if I can't elaborate enough for a post

* pretty sure code readability matters more than DRY, cleverness, clean code, etc...
* never let overly difficult testing get in the way of a good implementation
* stop building for tomorrow, when you can build something that is complete and works today… YANGNI
* why is it so many of the 'agile' people I know say process over people, but are continually about refining and adding more process
* don't fear the opinionated, at least you know where they stand, fear those with no opinions
* Harder to inspire or motivate than it is to be a critic or point out flaws or to demotivate and put people down.

## Jekyll-Bootstrap
This blog is built using Jekyll-Bootstrap. The quickest way to start and publish your Jekyll powered blog. 100% compatible with GitHub pages

### License

[Creative Commons](http://creativecommons.org/licenses/by-nc-sa/3.0/)

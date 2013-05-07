#Dan Mayer's Developer Blog

## Todos

* fix look of code imports that used `` back ticks
* update formatting / theme, font size etc
* better newline detection / fixes on import
* pick using tags or categories or both and import them
* try to recover some of the really old images from banddesigns url
* alter / improve the layout
* twitter integration?, show recent tweets
* add link roll back to other bloggers etc
* Coderwall integration (Achievements, projects, etc)

## Topic / Post Ideas

* DCI is sort of interesting but seems to go against LOC==bugs and Kingdom of Nouns post which really makes me upset to see DCI with .excute methods seems close to what I like and envision but actually to heavy weight
  * http://vimeo.com/8235574     
* Improve JS runner to handle multiple examples, and do a post about that as a plugin and show some usage examples
* post about JS titles I saw and incorporated along with having JS runner allow users to activate some of the example code.
* Graphite unused view layout / partial tracking
* Smokescreen and the importance of fast test / fast feedback loop, and that sometimes if the tests are really slow they actually have a negative value even if they do test some edge case
* Writing code vs. app builders / generators, and how I am disappointed to still be building applications with dense text in a 20+ year old editor… There has been progress, but with progress some people should be able to create programs knowing far less of the underlying details. (How yeoman, meteor, the JS world, and closure are making tiny but at least better progress on on modern flows)
* Automate everything, all the way down (chef/ec2, dot files / emacs, Boxen looks cool because of this, etc)
* Much like bugs performance improvements cluster together (limit on collections, large vs slim objects, eager filtering, etc example from LS of lsdeals)
* Tiny blog post about copy_files_and_maintain_structure method for ec2 copying
* Fixing and improving my emacs setup, with links to some of the places I picked up tips, Avdi's blog, etc
* Play with some of the easy to build automated mobile apps to build a silly app
* Build something random to mashup spottily play with artist info and reviews pulled from wikipedia, etc
* Best things to happen to developers, AWS ec2 and instance / cheap ways to test all sorts of infrastructure. Github and all the great tools and integration around the github community. Online courses / education. Easy payments (stripe, square, etc)… Lacking from this list is great stuff from google, who actually has more restrictions and issues working with there data and apis… Try just getting some search data out of there system… etc Great time to be a developer

## Post Ideas I might do on LS techblog or clear with work to post here
* Rails 2.3.X view tracking, about the work I did track all the view layouts, templates, in partials in deals to remove dead files
* Smokescreen, to discuss the importance of fast feedback loops and when a test suite grows to large good ways to focus in on the important changes (I actually run `bundle exec rake test:smokescreen:all_current` on almost all changes now which runs the critical tests along with test files that are likely to be affected by current changes)

## Jekyll-Bootstrap
This blog is built using Jekyll-Bootstrap. The quickest way to start and publish your Jekyll powered blog. 100% compatible with GitHub pages

## License

[Creative Commons](http://creativecommons.org/licenses/by-nc-sa/3.0/)

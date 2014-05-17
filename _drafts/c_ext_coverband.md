# Building a Ruby Gem with a C extension

### Notes

* [C level events, including RUBY_EVENT_COVERAGE](http://qiita.com/yui-knk/items/92b0537fa1d5dd5ebc83)
* [writing C extensions: part 1](http://tenderlovemaking.com/2009/12/18/writing-ruby-c-extensions-part-1.html)
* [writing C extensions: part 2](http://tenderlovemaking.com/2010/12/11/writing-ruby-c-extensions-part-2.html)
* [wrapping a c-library for ruby is easy](http://blog.firmhouse.com/wrapping-up-a-c-library-for-ruby-it-s-actually-pretty-easy)
* [Coverage Documentation](http://www.ruby-doc.org/stdlib-1.9.3/libdoc/coverage/rdoc/Coverage.html)
* [Ruby C extensions: basics](http://blog.x-aeon.com/2012/12/13/the-ruby-c-api-basics/#TRCAB_Calling)
* [Ruby C extensions: Slides](http://java.ociweb.com/mark/NFJS/RubyCExtensions.pdf)
* [Ruby C extensions: blocks](http://clalance.blogspot.com/2011/01/writing-ruby-extensions-in-c-part-11.html)

### Examples

* [Stackprof.c](https://github.com/tmm1/stackprof/blob/master/ext/stackprof.c)
* [fast_stack.c](https://raw.githubusercontent.com/SamSaffron/fast_stack/060f15dc68d2102f73f3302833b37fde357d3cde/ext/fast_stack/fast_stack.c) (older simpler version)
* [FastStack.rb](https://github.com/SamSaffron/fast_stack/blob/060f15dc68d2102f73f3302833b37fde357d3cde/lib/fast_stack.rb) (older simpler version)

### Gotchas

* If you are compiling locally over and over, it appears that the .o files from install gems will stick around. You need to gem uninstall the native gem and reinstall it to pick up your changes.


### Related Examples

* [C ext fast stacks, includes line numbers](https://github.com/SamSaffron/fast_stack)
  * [examples parsing frames](https://github.com/SamSaffron/fast_stack/blob/master/lib/fast_stack.rb) 
* [tmm1's stackprofiler](https://github.com/tmm1/stackprof)
* [tmm1's lineprof, line number profiler](https://github.com/tmm1/rblineprof)
  * [this without timing looks like what I need](https://github.com/tmm1/rblineprof/blob/master/ext/rblineprof.c) 
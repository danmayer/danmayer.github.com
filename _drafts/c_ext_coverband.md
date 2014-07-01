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
* [Your first Ruby native extension: C](https://blog.jcoglan.com/2012/07/29/your-first-ruby-native-extension-c/)
* [Working with Ruby strings in C](http://clalance.blogspot.com/2011/01/writing-ruby-extensions-in-c-part-8.html)
* [Working with Ruby numbers in C](http://yard.ruby-doc.org/stdlib-2.1.0/Num2int.html)
* [Converting Ruby Strings to C Strings](http://stackoverflow.com/questions/10210624/how-to-convert-a-string-taken-out-from-a-ruby-array-into-a-c-c-string)

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

### Perf Progress

No Coverband

Time taken for tests:   3.980 seconds /  3.999 seconds

Ruby Coverband

Time taken for tests:   31.489 seconds / 29.064 seconds

Ruby Coverband C Ext V1

Time taken for tests:   14.679 seconds / 12.033 seconds

Ruby Coverband C Ext V2 with Regex

Time taken for tests:   6.131 seconds / 6.321 seconds

### Warnings I need to fix

    make
    compiling coverband_ext.c
	coverband_ext.c:44:23: warning: incompatible pointer types passing 'void (VALUE, VALUE, VALUE, ID, VALUE)' to parameter of type 'rb_event_hook_func_t' (aka 'void (*)(rb_event_flag_t, VALUE, VALUE, ID, VALUE)') [-Wincompatible-pointer-types]
    rb_add_event_hook(trace_line_handler_ext, RUBY_EVENT_LINE, 0);
	                      ^~~~~~~~~~~~~~~~~~~~~~
	/opt/boxen/rbenv/versions/1.9.3-p448/include/ruby-1.9.1/ruby/ruby.h:1427:45: note: passing argument to parameter 'func' here
	void rb_add_event_hook(rb_event_hook_func_t func, rb_event_flag_t events,
	                                            ^
	coverband_ext.c:45:15: error: use of undeclared identifier 'bindval'
    rb_iv_set(bindval, "@tracer_set", Qtrue);
	              ^
	coverband_ext.c:53:24: warning: incompatible pointer types passing 'void (VALUE, VALUE, VALUE, ID, VALUE)' to parameter of type 'rb_event_hook_func_t' (aka 'void (*)(rb_event_flag_t, VALUE, VALUE, ID, VALUE)') [-Wincompatible-pointer-types]
	  rb_remove_event_hook(trace_line_handler_ext);
	                       ^~~~~~~~~~~~~~~~~~~~~~
	/opt/boxen/rbenv/versions/1.9.3-p448/include/ruby-1.9.1/ruby/ruby.h:1429:47: note: passing argument to parameter 'func' here
	int rb_remove_event_hook(rb_event_hook_func_t func);
	                                              ^
	2 warnings and 1 error generated.
	make: *** [coverband_ext.o] Error 1  
  
### C Extension Code examples

Working with ifdef to detect and deal with ruby version differences

    #if defined(RUBY_VM)
      #include <ruby/re.h>
      #include <ruby/intern.h>
    
      #if defined(HAVE_RB_PROFILE_FRAMES)
        #include <ruby/debug.h>
      #else
        #include <vm_core.h>
        #include <iseq.h>
        // There's a compile error on 1.9.3. So:
        #ifdef RTYPEDDATA_DATA
          #define ruby_current_thread ((rb_thread_t *)RTYPEDDATA_DATA(rb_thread_current()))
        #endif
      #endif
    #else
      #include <st.h>
      #include <re.h>
      #include <intern.h>
      #include <node.h>
      #include <env.h>
      typedef rb_event_t rb_event_flag_t;
    #endif
    
### Other Links

try with adding ALL the headers to the folder

https://github.com/banister/binding_of_caller/tree/master/ext/binding_of_caller/ruby_headers/193

plane does this as well to work on 1.9.2 and 1.9.3

https://github.com/soba1104/PLine/blob/master/ext/pline/ruby_source/1.9.3/vm_core.h

good ifdef examples as I move beyond and try to get it working on 193 and 2.1

https://github.com/tmm1/rblineprof/blob/master/ext/rblineprof.c

good book on working on ruby core code

http://ruby-hacking-guide.github.io/evaluator.html

more about trace

https://bugs.ruby-lang.org/issues/2565

WHERE LINE NUMBS COME FROM IN 1.9.3

http://rxr.whitequark.org/mri/source/vm.c?v=1.9.3-p547#888

1.9.3 set trace fun

http://apidock.com/ruby/Kernel/set_trace_func

calling a method

http://blog.x-aeon.com/2012/12/13/the-ruby-c-api-basics/#TRCAB_Calling

sharing data between C and ruby
http://www.eqqon.com/index.php/Ruby_C_Extension_API_Documentation_(Ruby_1.8)

ruby c cheet sheet
http://blog.jacius.info/ruby-c-extension-cheat-sheet/

more on set_TRace_Func

http://aphyr.com/posts/173-monkeypatching-is-for-wimps-use-set-trace-func

http://ruby-doc.org/core-1.9.3/Kernel.html#method-i-set_trace_func

http://t-a-w.blogspot.com/2007/04/settracefunc-smoke-and-mirrors.html

on creating a proc object

http://www.ruby-doc.org/core-1.9.3/Proc.html

example c code

https://github.com/tmm1/rbtrace/blob/master/ext/rbtrace.c

extending ruby

http://phrogz.net/programmingruby/ext_ruby.html

Dtrace

https://bugs.ruby-lang.org/issues/2565


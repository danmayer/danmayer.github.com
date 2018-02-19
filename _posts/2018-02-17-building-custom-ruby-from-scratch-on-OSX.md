# Building & Using Your Own Ruby

If you want to work on changes or learn more about the internals of the  Ruby language, you can alter the source and build your own from scratch. It isn't that hard or scary, you will learn a bit more about Ruby just by building it. This is a quick start to building Ruby from scratch on OSX, and using it to run your local apps.

# Get the Source

Use git or SVN to pull the source repo.

* I like git, so I forked the Ruby project.
* Then clone it: `git clone git@github.com:danmayer/ruby.git`
* go into the directory and take a look around.

# Build Trunk Before Modifying

Before you make any modifications, I recommend you get the current trunk building and test running your apps with it. Then you can create a branch and see the impact of any modifications you would like to try out.

### Building Yourself

I recommend using the Ruby-buil instructions below as I continued to hit issues with building from scatch with my own options related to SSL.

If you want to give it a shot thought, run the 4 commands below and it will compile and install Ruby from src on your system.

```
aclocal
autoconf
bash -c './configure'
make && make install
```

If you get this error about OpenSSL:

```
openssl:
	Could not be configured. It will not be installed.
	Check ext/openssl/mkmf.log for more details.
*** Fix the problems, then remove these directories and try again if you want.
```

It is a bit hard to resolve on OS X yourself, but luckily we can just use ruby-build to do the work for us, see below.

### Building via Ruby-build

[Ruby build](https://github.com/rbenv/ruby-build) will detect and use SSL from homebrew and avoid the broken OSX implementation. 

* install ruby-build: `brew install ruby-build`
* copy the current dev trunk target: `cp  /usr/local/Cellar/ruby-build/20171226/share/ruby-build/2.6.0-dev /usr/local/Cellar/ruby-build/20171226/share/ruby-build/2.6.0-mine`
* edit the file (`...ruby-build/2.6.0-mine`) to point to your fork: `... install_git "ruby-trunk" "https://github.com/danmayer/ruby.git" ...`
* build from your git to the `~/.rubies/` directory: `ruby-build 2.6.0-mine ~/.rubies/ruby-2.6.0mine`
   * run from the build dir: `/usr/local/Cellar/ruby-build/20171226/share/ruby-build` 
* make sure to open a new shell so ChRuby (or RbEnv) find the new ruby.
* you can now reference the new build in your `.ruby-version` file in any project

If you want to build from your local git to avoid pushing to a remote branch while testing this is how your build file should end up.

```
install_package "openssl-1.1.0g" "https://www.openssl.org/source/openssl-1.1.0g.tar.gz#de4d501267da39310905cb6dc8c6121f7a2cad45a7707f76df828fe1b85073af"  mac_openssl --if has_broken_mac_openssl
install_git "coverage_pause" "/Users/danmayer/projects/ruby" "feature/coverage_pause" ldflags_dirs autoconf standard_build standard_install_with_bundled_gems verify_openssl
```

If all is working as expected you should see this.

```
ruby-build 2.6.0-coverage ~/.rubies/ruby-2.6.0coverage
ruby-build: use openssl from homebrew
Cloning https://github.com/danmayer/ruby.git...
Installing coverage_pause...
ruby-build: use readline from homebrew
Installed coverage_pause to /Users/danmayer/.rubies/ruby-2.6.0coverage
```

### Playing Nice with Other Rubies?

If you are like most Rubyists you have a number of Rubies installed, beyond the default OSX Ruby, using something like RBenv, RVM, or ChRuby.

* The default OS X Ruby should be: `/usr/bin/ruby`
* If you build from scratch the default target will be installed to: `/usr/local/bin` 
   * This can cause some issues with various Ruby environment managers
   * adjust your path to target this Ruby or your normal one
   * Another reason I recommend building via ruby-build, as it will work easier with most Ruby environment managers
* Ruby build will put ruby into the ~/.rubies
   * with ChRuby it will automatically pick these up
   
Then you can reference your new custom ruby in a `.ruby-version` file at the root project directory, for example:

```
# .ruby-version
ruby-2.6.0coverage
```   

### Running an App with your Custom Ruby

After building your own Ruby and setting the `.ruby-version` you should be good to go. You can verify you are running your Ruby by adding some simple print statement. Pick a favorite Ruby method and just add a print statement like so...

`printf( "hello from my method!\n" );`

* push the change to the branch your referenced in your Ruby build steps
   * there are ways to build locally, but I have just targetted git branches 
* rebuild Ruby: `ruby-build 2.6.0-coverage ~/.rubies/ruby-2.6.0coverage`
* enter your project iwth the set ruby-version
* run `ruby -v` to make sure it matches expectations
   * if you get `chruby: unknown Ruby: ruby-2.6.0coverage` either refresh chruby or open a new terminal so it picks up the new build
* now run things as you normally would...

```
# in Rakefile
desc "call coverage running"
task :call_coverage_running do
  require 'coverage'
  Coverage.running?
end
```

```
rake call_coverage_running
hello from Coverage.running
```

In the above output, I can see that I am runnin my custom Ruby branch as I had added a print messaged to the `Coverage.running?` method.

# Testing your Custom Ruby

If you are trying to do some real work on Ruby other than exploring, you will want to be able to run the tests on files after you modify them, and add your own tests.

### Running Tests

For example to run a specific test file, you can run the below command.

```
make test-all TESTS=test/coverage/test_coverage.rb
Run options: "--ruby=./miniruby -I./lib -I. -I.ext/common  ./tool/runruby.rb --extout=.ext  -- --disable-gems" --excludes-dir=./test/excludes --name=!/memory_leak/

# Running tests:

Finished tests in 1.580204s, 12.0238 tests/s, 74.6739 assertions/s.
19 tests, 118 assertions, 0 failures, 0 errors, 0 skips

ruby -v: ruby 2.6.0dev (2018-01-13 trunk 61811) [x86_64-darwin15]
```

### Running Specs

Below we can see how to run a single specific spec file

```
make test-spec MSPECOPT=spec/ruby/library/coverage/start_spec.rb
generating x86_64-darwin15-fake.rb
x86_64-darwin15-fake.rb updated
$ /Users/danmayer/projects/ruby/miniruby -I/Users/danmayer/projects/ruby/lib /Users/danmayer/projects/ruby/tool/runruby.rb --archdir=/Users/danmayer/projects/ruby --extout=.ext -- /Users/danmayer/projects/ruby/spec/mspec/bin/mspec-run -B ./spec/default.mspec spec/ruby/library/coverage/start_spec.rb
ruby 2.6.0dev (2018-01-13 trunk 61811) [x86_64-darwin15]
[\ | ==================100%================== | 00:00:00]      0F      0E

Finished in 0.002753 seconds

1 file, 0 examples, 0 expectations, 0 failures, 0 errors, 0 tagged
```
Getting Ruby to build locally:

```
aclocal
autoconf
bash -c './configure'
make && make install
```

```
---
Configuration summary for ruby version 2.6.0

   * Installation prefix: /usr/local
   * exec prefix:         ${prefix}
   * arch:                x86_64-darwin15
   * site arch:           ${arch}
   * RUBY_BASE_NAME:      ruby
   * ruby lib prefix:     ${libdir}/${RUBY_BASE_NAME}
   * site libraries path: ${rubylibprefix}/${sitearch}
   * vendor path:         ${rubylibprefix}/vendor_ruby
   * target OS:           darwin15
   * compiler:            clang
   * with pthread:        yes
   * enable shared libs:  no
   * dynamic library ext: bundle
   * CFLAGS:              ${optflags} ${debugflags} ${warnflags}
   * LDFLAGS:             -L. -fstack-protector -L/usr/local/lib
   * optflags:            -O3
   * debugflags:          -ggdb3
   * warnflags:           -Wall -Wextra -Wno-unused-parameter \
                          -Wno-parentheses -Wno-long-long \
                          -Wno-missing-field-initializers \
                          -Wno-tautological-compare \
                          -Wno-parentheses-equality \
                          -Wno-constant-logical-operand -Wno-self-assign \
                          -Wunused-variable -Werror=implicit-int \
                          -Werror=pointer-arith -Werror=write-strings \
                          -Werror=declaration-after-statement \
                          -Werror=shorten-64-to-32 \
                          -Werror=implicit-function-declaration \
                          -Werror=division-by-zero \
                          -Werror=deprecated-declarations \
                          -Werror=extra-tokens
   * strip command:       strip -A -n
   * install doc:         yes
   * man page type:       doc

---
```

```
installing binary commands:         /usr/local/bin
installing base libraries:          /usr/local/lib
installing arch files:              /usr/local/lib/ruby/2.6.0/x86_64-darwin15
installing pkgconfig data:          /usr/local/lib/pkgconfig
installing command scripts:         /usr/local/bin
installing library scripts:         /usr/local/lib/ruby/2.6.0
installing common headers:          /usr/local/include/ruby-2.6.0
installing manpages:                /usr/local/share/man/man1
installing extension objects:       /usr/local/lib/ruby/2.6.0/x86_64-darwin15
installing extension objects:       /usr/local/lib/ruby/site_ruby/2.6.0/x86_64-darwin15
installing extension objects:       /usr/local/lib/ruby/vendor_ruby/2.6.0/x86_64-darwin15
installing extension headers:       /usr/local/include/ruby-2.6.0/x86_64-darwin15
installing extension scripts:       /usr/local/lib/ruby/2.6.0
installing extension scripts:       /usr/local/lib/ruby/site_ruby/2.6.0
installing extension scripts:       /usr/local/lib/ruby/vendor_ruby/2.6.0
installing extension headers:       /usr/local/include/ruby-2.6.0/ruby
installing default gems from lib:   /usr/local/lib/ruby/gems/2.6.0 (build_info, cache, doc, extensions, gems, specifications)
                                    cmath 1.0.0
                                    csv 1.0.0
                                    fileutils 1.0.2
                                    ipaddr 1.2.0
                                    rdoc 6.0.1
                                    scanf 1.0.0
                                    webrick 1.4.2
installing default gems from ext:   /usr/local/lib/ruby/gems/2.6.0 (build_info, cache, doc, extensions, gems, specifications)
                                    bigdecimal 1.3.4
                                    date 1.0.0
                                    dbm 1.0.0
                                    etc 1.0.0
                                    fcntl 1.0.0
                                    fiddle 1.0.0
                                    gdbm 2.0.0
                                    io-console 0.4.6
                                    json 2.1.0
                                    psych 3.0.2
                                    sdbm 1.0.0
                                    stringio 0.0.1
                                    strscan 1.0.0
                                    zlib 1.0.0
installing bundled gems:            /usr/local/lib/ruby/gems/2.6.0 (build_info, cache, doc, extensions, gems, specifications)
installing rdoc:                    /usr/local/share/ri/2.6.0/system
installing capi-docs:               /usr/local/share/doc/ruby
```

```
/usr/local/bin/ruby -v
ruby 2.6.0dev (2018-01-13 trunk 61811) [x86_64-darwin15]
```

### Rbenv and local Ruby

fix path?

```
mv /usr/local/bin/ruby /usr/local/bin/ruby_local_bak
```

### Running Tests

To run a specific test file, you can run the below command.

```
make test-all TESTS=test/coverage/test_coverage.rb
Run options: "--ruby=./miniruby -I./lib -I. -I.ext/common  ./tool/runruby.rb --extout=.ext  -- --disable-gems" --excludes-dir=./test/excludes --name=!/memory_leak/

# Running tests:

Finished tests in 1.580204s, 12.0238 tests/s, 74.6739 assertions/s.
19 tests, 118 assertions, 0 failures, 0 errors, 0 skips

ruby -v: ruby 2.6.0dev (2018-01-13 trunk 61811) [x86_64-darwin15]
```

### Running Specs

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
* [Flaky Test Detection](https://buildpulse.io/), help detect and find tests causing flakiness
* [related post from @samsaffron tests that sometimes fail](https://samsaffron.com/archive/2019/05/15/tests-that-sometimes-fail)
* [why rspec tests fail and how to fix them](https://medium.com/better-programming/why-rspec-tests-fail-and-how-to-fix-them-402f1c7dce16)
* https://www.mayerdan.com/ruby/2019/09/07/flaky-ruby-tests
* https://edgeguides.rubyonrails.org/testing.html#system-testing


# Introducing Rails Flaky Spec Examples

In this post, I want to introduce a new project [Rails Flaky Spec Examples](https://github.com/danmayer/rails_flaky_spec_examples). This project was created for an internal code clinic at Stitch Fix, to teach about common flaky test issues and how to resolve them. I am hoping that over time, I can continue to grow the example base and talk about some of the more complex flaky tests and how we could perhaps more systamatically avoid them. As I work with this project over time, I hope to make it into a good learning tool for the community.

> Gif showing both suites

# Why? One Problem with Flaky Test Posts

Many of the great flaky test posts on the web don't have runnable examples... While they might have some code snippets showing examples in the post they don't have a runnable project... Often the snippets get to simplified to show how the errors look in a real large legacy project. This project tries to be in the middle where it is still small enough to easily understand the issue, but it is part of a real runnable app that can be extended to highlight more complex Rails and JS testing issues, including browser based javascript test race conditions. While this project isn't a real world example which are the best sources of flaky specs, sometimes those are also hard to easily understand. The best source for a real codebase with tagged flay specs comes from SamSaffrom / Discources in their tagged collection of [flaky heisentest](https://review.discourse.org/tags/heisentest) which is discribed more in the excellent post, [tests that sometimes fail](https://samsaffron.com/archive/2019/05/15/tests-that-sometimes-fail).


# Project Structure

The project is designed to have two versions of every spec the flaky version, and the stable version. 

> You can see this in the folder structure each spec folder has a sub-directory `solved`

This let's me use `Rspec` tags to run either the solved or flaky specs.

```ruby
config.define_derived_metadata(file_path: Regexp.new('/solved/')) do |metadata|
  metadata[:solved] = true
  ENV['SOLVED_SPECS'] = 'true'
end
```

With these dynamic tags and a default `.rspec` with `--tag ~solved:true` we can now run either the flaky or stable suite.

* flaky: `bundle exec rspec`
* stable: `bundle exec rspec --tag solved`

# Example Solving a Flaky Spec

# Using the Project for A Workshop

* The project can be used for a workshop
   * introduce the project and the workflow
   * solve a single flaky test with the whole group mob programming style
   * break up into groups and have the groups solve flaky tests
   * regroup, and present some of the soltuions
   * talk about any flaky test experiences folks have had that were very different than what was seen in this project. 









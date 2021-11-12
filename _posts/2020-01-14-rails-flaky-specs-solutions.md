---
layout: posttail
authors: ["Dan Mayer"]
title: "Rails Flaky Spec Solutions"
image: /assets/img/flaky-wall.jpg
category: Ruby
tags: [Ruby, Testing, Rspec]
---
{% include JB/setup %}

{% unless page.image %}
![Bugs](/assets/img/flaky-wall.jpg)
{% endunless %}
> photo credit [flaky wall: pixabay](https://pixabay.com/illustrations/banner-header-plaster-cracks-old-902587/)

# Introducing Rails Flaky Spec Examples

I have written about how our teams are [dealing with flaky ruby tests](https://www.mayerdan.com/ruby/2019/09/07/flaky-ruby-tests) in legacy projects. In this post, I want to show, how we can teach about common testing pitfalls and how to avoid them.

In this post, I want to introduce a new project [Rails Flaky Spec Examples](https://github.com/danmayer/rails_flaky_spec_examples). I created the example flaky Rails spec suite for an internal code clinic at Stitch Fix. We ran it as a 1-hour workshop to teach about common flaky test issues and how to resolve them. I am hoping that over time, I can continue to grow the example base and talk about some of the more complex flaky tests and how we could perhaps more systematically avoid them. As I work with this project over time, I hope to make it into a good learning tool for the community.

![Flaky vs Stable Suite](/assets/img/flaky_specs.gif)
> Running the flaky and thens stable suite

# Why A Rails Suite? One Problem with Flaky Test Posts

While <!--more--> there are a number of great blog posts on flaky specs:

* [eliminating flaky ruby tests](https://engineering.gusto.com/eliminating-flaky-ruby-tests/)
* [why rspec tests fail and how to fix them](https://medium.com/better-programming/why-rspec-tests-fail-and-how-to-fix-them-402f1c7dce16)
* [list of flaky test practices to avoid](https://github.com/evilmartians/terraforming-rails/blob/master/guides/flaky.md)

The majority of the posts don't have runnable examples. While they might have some code snippets showing examples in the post they don't have a runnable project. You can try to paste some of the examples into a file, but they reference dependencies, like an active record model without the related migration or dependencies. Often the snippets get too simplified to show how the errors look in a real large legacy project.

Since the examples aren't runnable it makes it a bit harder to use them as a teaching tool, or show more complex tests or CI interactions. This project aims to be in the sweet spot, where it is still small enough to easily understand the issues, but it is part of a real runnable app that can be extended to highlight more complex Rails and JS testing issues. Adding things like common libraries (Faker, Capybara, etc) and different levels of tests including browser-based javascript tests and the related race conditions.

While this project isn't a real-world example which are the best sources of flaky specs, sometimes real-world examples are hard to easily understand. Many of the examples in this project were extracted from real world examples. If you really want to dive into a fully developed complex code base that has Flaky specs, the best source for that with tagged flaky specs comes from [@ samsaffron](https://twitter.com/samsaffron)/[discourse.org](https://discourse.org/) in their tagged collection of [flaky heisentest](https://review.discourse.org/tags/heisentest) which is described more in the excellent post, [tests that sometimes fail](https://samsaffron.com/archive/2019/05/15/tests-that-sometimes-fail).

This project allows devs, to run spec examples, see the failures, and try to fix the flaky specs either themselves or with a small group. If they get stuck example solutions are readily available. It should also be relatively easy to extend the project to add examples extracted from real-world projects. I would love to get some flaky test submissions for difficult flaky spec issues.

# Project Structure

The project is designed to have two versions of every spec the flaky version, and the stable version. 

![Project Structure](/assets/img/flaky_project_structure.png)
> You can see this in the folder structure each spec folder has a sub-directory `solved`

This lets me use `Rspec` tags to run either the solved or flaky specs.

```ruby
config.define_derived_metadata(file_path: Regexp.new('/solved/')) do |metadata|
  metadata[:solved] = true
  ENV['SOLVED_SPECS'] = 'true'
end
```

With these dynamic tags and a default `.rspec` with `--tag ~solved:true` we can now run either the flaky or stable suite.

* flaky: `bundle exec rspec`
* stable: `bundle exec rspec --tag solved`

# Example: Solving A Flaky Spec

Let me show the expected workflow when learning with the project...

1. Run the suite and pick a failure that looks interesting...
2. Read the Related Code
3. Modify the Spec, try to fix it
4. Compare your answer to the provided solution (remember the is more than one way to solve many of these issues)

## 1. Pick a Failure

Let's run the suite and pick a failure. In this case `spec/models/post_example_e_spec.rb`, Post ordered expect many order posts to be in alphabetical order, looks interesting.


```
bundle exec rspec
Run options: exclude {:solved=>true}

Randomized with seed 5788
...Capybara starting Puma...
* Version 4.3.1 , codename: Mysterious Traveller
* Min threads: 0, max threads: 4
* Listening on tcp://127.0.0.1:64214
...FF.FF.FFF.F.FFF

Failures:
...

3) Post post ordered expect many order posts to be in alphabetical order
   Failure/Error: alphabet.each { |el| Post.create!(title: Faker::String.random(2), body: el) }

   ActiveRecord::RecordInvalid:
     Validation failed: Title has already been taken
   # ./spec/models/post_example_e_spec.rb:12:in `block (4 levels) in <top (required)>'
   # ./spec/models/post_example_e_spec.rb:12:in `each'
   # ./spec/models/post_example_e_spec.rb:12:in `block (3 levels) in <top (required)>'
...

Finished in 10.2 seconds (files took 3.33 seconds to load)
21 examples, 11 failures

Failed examples: ...
rspec ./spec/models/post_example_e_spec.rb:10 # Post post ordered expect many order posts to be in alphabetical order
```

## 2. Read the Related Code

Let's take a closer look at the code involved. In this case, from the comments, we see this spec is flaky on its own and doesn't require the full suite to be flaky.

```ruby
require 'rails_helper'

class Post < ApplicationRecord
  validates :title, uniqueness: true

  scope :ordered, -> { order(body: :asc, id: :asc) }
end

# Classification: Randomness
# Success Rate: 80%
# Suite Required: false
RSpec.describe Post, type: :model do
  describe "post ordered" do
    it "expect many order posts to be in alphabetical order" do
      alphabet = ('a'..'z').to_a
      alphabet.each { |el| Post.create!(title: Faker::String.random(2), body: el) }
      expect(Post.ordered.map(&:body)).to eq(alphabet)
    end
  end
end
```

## 3. Modify The Spec

For the above example, since we require the title to be unique, but we are using a small random value... We can see collisions occur. There are a number of ways to solve this, perhaps we don't need randomness at all in this case!

```ruby
require 'rails_helper'

class Post < ApplicationRecord
  validates :title, uniqueness: true

  scope :ordered, -> { order(body: :asc, id: :asc) }
end

# Classification: Randomness
# Success Rate: 80%
# Suite Required: false
RSpec.describe Post, type: :model do
  describe "post ordered" do
    it "expect many order posts to be in alphabetical order" do
      alphabet = ('a'..'z').to_a
      alphabet.each { |el| Post.create!(title: el, body: el) }
      expect(Post.ordered.map(&:body)).to eq(alphabet)
    end
  end
end
```

Run the spec a few times to ensure it now always passes.

## 4. Compare Answers

Now you can look at the file in the solutions folder. It will contain a solved spec with additional details explaining why there was an issue, and how it was solved. Occasionally offering more than one solution. Now you can repeat the steps until you have no more errors in the spec suite. 

# Using the Project for A Workshop

This is how we turned the project into a code clinic or workshop. We ran it entirely remotely, scheduling multiple 1-hour sessions folks could sign up for. There was a brief set of slides, explaining the project and getting folks bootstrapped and installed. Then we used [Zoom to breakout](https://support.zoom.us/hc/en-us/articles/206476093-Getting-Started-with-Breakout-Rooms) into small groups of 4 devs, to solve the specs as a little team. Regrouping at the end to discuss and share our solutions. The workgroup format was broken down like below:

* introduce the project and the workflow (10m)
* solve a single flaky test with the whole group mob programming style (10m)
* break up into groups and have the groups solve flaky tests (30m)
* regroup, share solutions, and discussion (10m)

If you try running a workshop, let me know I would be curious how it went.

# Related Links

Here are some other helpful links related to flaky Rails tests.

* [Flaky Test Detection](https://buildpulse.io/), help detect and find tests causing flakiness
* make it easier to debug flaky tests, [5-ways to improve flaky test debugging](https://building.buildkite.com/5-ways-weve-improved-flakey-test-debugging-4b3cfb9f27c8)
* test-smells, [examples of bad JS and Ruby test patterns](https://github.com/testdouble/test-smells)
* [fixing flaky tests like a detective](https://sonja.codes/fixing-flaky-tests-like-a-detective)
* [Tips and Tricks for Dubugging and Fixing Slow/Flaky Capybara Specs](http://johnpwood.net/2015/04/23/tips-and-tricks-for-dubugging-and-fixing-slowflaky-capybara-specs/)
* [How CSS Animations Can Break Your Tests](https://marcgg.com/blog/2015/01/05/css-animations-failing-capybara-specs/)
* [Flaky Tests - A War that Never Ends](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359)

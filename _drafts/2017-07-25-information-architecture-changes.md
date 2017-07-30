---
layout: post
title: "Information Architecture Changes"
image: /assets/img/information_architecture_changes.png
category: Programming
tags: [Programming, Development, Tips, Rails]
---
{% include JB/setup %}

![image DB Schema Changes](/assets/img/information_architecture_changes.png)
> Visualizing DB Schema Changes, even at a quick glance better structures stand out 

# Information Architecture Changes

Creating a robust Data Model for your business & application is one of the most important things to get right. We still don't have great tools for discussing proposed database schema changes. Fixing a bad data model after data has started flowing on a production system is more complicated & time consuming than folks estimate. A series of not fully thought out data decisions early on project can cut a teams velocity significantly. As time is spent trying to fix bad & invalid data, adding missing [DB constraints & validations](http://naildrivin5.com/blog/2015/11/15/rails-validations-vs-postgres-check-constraints.html) where needed, and refactoring towards a more appropriate data model. 

__What can we do to ensure a more robust model from the start and increase the confidence we have in data model changes?__

## A Proposal For More Communicative Data Model Changes

Below, I will lay out a proposal we are iterating on as part of our OGE team practices.

Our Goals:

* Ability to communicate clearly across Dev, PM, & BI teams anticipated impacts
* Quickly visualize and be able to discuss changes (faster feedback loop)
* Reduce bad data models making hitting production prior to full cross functional review and understanding
* Support asynchronous communication styles that work best for our distributed team
* Ability to incremental evolve the model quickly during discussions
* Ability to see high and low level details using the same data
* Ability to focus in to only the models under discussion
* Easily integrates into our tool chain

While this does add additional overhead while working on data changes to our system. It helps us to collaborate and socialize the data model. Working towards ubiquitous language across our teams and with our stakeholders.

It is important to note this is for [data schema changes not for data migrations](https://www.mayerdan.com/programming/2016/11/21/managing-rails-migrations), which I have written about how we handle in the past.

## Data Model Change Process

The process creates some artifacts that help support a robust understanding and conversation around the data changes.

1. A PR is used to group the artifacts, description and reasoning for the change, and to focus the discussion
2. A high leveled visual asset on changes to quickly understand the lay of the land so to speak (including before and after images)
3. A low level view showing column level removals and additions to the schema, colorized via `git diff` support

### High Level Visual Assets

<img src="/assets/img/customer_phone_clean.png" alt="visual details customer cleanup" width="100%">

> A high detail visual representation of the expected end result  

The high level view are images that can include class or class and field information about the models under change. The PR will typically include both the before and after image so one can see how the classes and associations will change over type. If fields are moved you can also see a class shrinking as fields move to newly associated objects. This type of view can help see the bigger relationships and structures of the data model.

### Low Level Details

<img src="/assets/img/db_refactor_out_phone.png" alt="low level details refactoring out phone number" width="100%">

> A textual diff showing low level details when refactoring out a phone number

By building image models from a textual diagraming format (`DOT` files), one can get much more details and control for the diagrams.

The low level textual details will result in a `git diff` easily viewed as part of the PR. It makes clear specific fields and associations that are added and removed. While this might be verbose for some folks, it is the level of details needed for a developer implementing and the business intelligence analyst reviewing. Seeing the specific fields makes it clear if the data will meet their needs. It can also be very helpful to discuss low level details such as field type.

## Example Live Refactoring Your DB Model

It might be easier to understand the goal with a quick animation to show the flow, than just describing it. Here is the flow one can expect to get into when working on DB model / schema changes.

![image DB Model Change Animation](/assets/img/refactor_db.gif)

## Team Discussion Workflow

This flow allows for a quick feedback loop, where folks in a room or on a screen share meeting could quickly diagram a model together. Making quick and small edits to the textual representation and generating new versions to discuss. This flow requires some initial work by a developer to prep the original model and DOT files.

1. Discuss original model image
2. Edit DOT files during discussion
3. Generate new model image

Loop until the group is satisfied with the results

## Detailed Developer Workflow

This should walk through the steps required to implement this process on your own project. This process could easily be implemented and integrated into various frameworks, but our specific details use tooling for Ruby on Rails to further simplify the efforts of generating these artifacts.

1. Generate or update initial model on dev branch
   * generate dot file: `FOCUS=true VERBOSE=true OUTPUT=doc/customers.dot rake diagram:models:customers`
   * generate image: `neato -Tpng doc/customers.dot > doc/customers.png`
   * check in the un-edited DOT & image files 
   * commit to dev branch
   * this will serve as your before to diff against later
2. Create a feature branch to work on your changes
   * new branch: `git checkout -b feature/db_phone_change`
   * edit to reflect your changes: `open doc/customer.dot` 
   * convert updated DOT file to updated image: `neato -Tpng doc/customer.dot > doc/customers.png`
   * view PNG & Refactor until happy
   * create a PR and upload the before and after images, diff will be automatically created for the DOT file changes.

## Dependancies

Their are many tools that could do this. If you don't have the ability to automatically create diagrams from your code, or access to graphviz. You could build out much of the diagrams by hand with a tool like [draw.io](https://www.draw.io/). If you are using Rails, I recommend the below setup.

### Add to your `gemfile` in your dev/test group

We use the [Railroady](https://github.com/preston/railroady) gem to generate our initial DOT files & images.

```ruby
group :test, :development do
  gem 'railroady'
end
```

### Install `graphviz` and tools if you don't already have it

`brew install graphviz`

### Setup some rake tasks for custom focused diagrams  

By default `Railroady` has some great Model diagrams.

```
rake diagram:models:all
rake diagram:models:brief
```

They tend to be to verbose by default. You can easily customize the output to focus in on the models under discussion. Below is some quick code to highlight how to customize the output.

```ruby
namespace :diagram do
  namespace :models do

    def excluded_models
      (['PaperTrail::Version']+(ENV['EXCLUDE_MODELS'] || '').split(',')).join(',')
    end

    ####
    #
    # Convert dot files to images
    # neato -Tpng doc/customer.dot > tmp/customers.png
    #
    ####
    def generate_for_files(files, output_file)
      files = files + ['app/models/user.rb'] if ENV['WITH_USER']
      options = ENV['VERBOSE'] ? '--alphabetize' : '--brief'
      if output_file.ends_with?('dot')
        `EXCLUDED_MODELS=#{excluded_models} railroady -M -s #{files.join(',')} --show-belongs_to #{options} > #{output_file}`
        doc = File.read(output_file)
        doc = doc.gsub('\l',"\\l\n")
        File.open(output_file, 'w') {|f| f.write(doc) }
      else
        `EXCLUDED_MODELS=#{excluded_models} railroady -M -s #{files.join(',')} --show-belongs_to #{options} | neato -Tpng > #{output_file}`
      end
      puts "find the file in #{output_file}"
    end

    desc 'Generates an class diagram for all customer models.'
    task :customers do
      output = ENV['OUTPUT'] || 'tmp/customers.png'
      customer_ignores = if ENV['FOCUS']
                           %w(Tagging Tag Ticket Task).join(',')
                         else
                           ''
                         end
      ENV['EXCLUDE_MODELS'] = ENV['EXCLUDE_MODELS'].to_s + customer_ignores
      files = %w(
      app/models/customer.rb
      app/models/contact.rb
      app/models/lead.rb
      app/models/sms_notification.rb
      app/models/phone_block_list.rb
      app/models/call.rb
      )
      generate_for_files(files, output)
    end
  end
end
```

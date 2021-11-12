---
layout: posttail
authors: ["Dan Mayer"]
title: "Safely Removing Image Assets from Rails"
image: /assets/img/vacuum-cleaner.jpg
category: Ruby
tags: [Ruby, Testing, Deployment]
---
{% include JB/setup %}

{% unless page.image %}
![Bugs](/assets/img/vacuum-cleaner.jpg)
{% endunless %}
> photo <!--more--> credit [cleaning: pixabay](https://pixabay.com/photos/vacuum-cleaner-vacuuming-cleaning-268179/)

# Why Cleanup Rails Image Assets?

Why would we want to more safely delete image assets?

* a clean repo is easier to jump into and maintain over time
* cruft that isn't in use can be confusing over time
* image assets can slow down your test and deploy pipeline
  * Rails tests frequently need to dynamically or initialize building all assets, this is often a slow hit on a Rails test suite
* Deployment needs to work with assets as well, often multiple steps
  * building all assets `rake assets:precompile`
  * compressing asset bundle
  * uploading assets to a CDN

All of this time adds up, assets compilation on a large legacy Rails app still adds around 40 seconds to the build time, down from 1m30s in the past. While asset preparation and deployment before cleanup and optimization of that flow and files was adding over 3 minutes to our deploy time.

# How To Safely Delete Image Assets

OK, hopefully now you would love to delete all the images in your `app/assets/images` folder that you don't use... What images are safe to delete or out of use? I have looked at a number of ideas for this.

* grepping with various scripts
* using log aggregation search results to ensure no hits were being made of an image asset
* using Sprockets options, `unknown_asset_fallback` alone, doesn't make you entirely safe...

What I wanted was a way to delete a folder of images or a single image that I believed was no longer in use, but have the build fail if there was any reference to the image. I wanted Rails to fail in these cases:


* a page is loaded in dev mode referencing a missing asset
* tests are run against a page referencing a missing asset (ActionDispatch::IntegrationTest, request spec, etc)
* bundle exec rake assets:precompile

### Sprockets Unknown Asset Fallback

Not surprisingly, other folks have wanted this and Sprockets has a built-in option [config.assets.unknown_asset_fallback](https://github.com/rails/sprockets-rails#initializer-options), which gets close to what I wanted. From the docs, this option claims to:

> When set to a truthy value, a result will be returned even if the requested asset is not found in the asset pipeline. When set to a falsey value it will raise an error when no asset is found in the pipeline. Defaults to true.

So let's set it to false: `Rails.application.config.assets.unknown_asset_fallback = false`. Now if you have a deleted image referenced like below:

```ruby
<%= image_tag("deleted_image.svg") %>
```

You will get an error when visiting the page or running tests:

```shell
bundle exec rake

...S.......E

Error:
HomeControllerTest#test_should_get_index:
ActionView::Template::Error: The asset "deleted_image.svg" is not present in the asset pipeline.
    app/views/home/index.html.erb:6:in `_app_views_home_index_html_erb___957919561084124106_70092585694780'
    test/controllers/home_controller_test.rb:5:in `block in <class:HomeControllerTest>'
```

This doesn't make one entirely safe, as images that are referenced in your scss, css, or other styles would still not cause an error. They would silently lead to broken images.

### Patch To Force Asset Compilation To Fail on Unknown Assets

Sadly, I couldn't find any option or configuration that would cause compiling stylesheets to fail. I thought this would block my goal of being able to remove a ton of assets safely with confidence... Well, after lots of digging, I figured out how to patch `sprockets-rails` so that it will blow up and fail when it references an unknown asset.

You can apply this patch in your: `config/initializers/assets.rb`

<script src="https://gist.github.com/danmayer/96ec7c37d1a775e021deea88fd804429.js"></script>

Now if you have a file in your styles, like `app/assets/stylesheets/application.scss` reference an image, your asset pipeline will blow up when the image is missing.

```
.broken-image-demo {
  background-image: image-url('deleted_image.svg');
}
```

Depending on how your tests run, they will fail when precompiling assets, or a failure will occur when you call `rake assets:precompile` as shown below.

```
bundle exec rake assets:precompile
...
Done in 1.32s.
rake aborted!
Sprockets::Rails::Helper::AssetNotFound: path not resolved: deleted_image.svg
/Users/danmayer/projects/coverband_demo/config/initializers/assets.rb:56:in `rescue in compute_asset_path'
/Users/danmayer/projects/coverband_demo/config/initializers/assets.rb:51:in `compute_asset_path'
/Users/danmayer/.rvm/gems/ruby-2.6.2/gems/actionview-5.2.2.1/lib/action_view/helpers/asset_url_helper.rb:200:in `asset_path'
...
```

# Asset Failure Demo

If you want to see this in action, feel free to clone [coverband demo](https://github.com/danmayer/coverband_demo). Install gems and get the tests passing. Then read the comments and run tests or compile assets when uncommenting the example lines to trigger the expected errours. Key Files:

* [config/initializers/assets.rb](https://github.com/danmayer/coverband_demo/blob/master/config/initializers/assets.rb), this shows all the setuo and configuration needed
* [app/assets/stylesheets/application.scss](https://github.com/danmayer/coverband_demo/blob/master/app/assets/stylesheets/application.scss#L35), an example of stylesheets referencing a missing image
* [app/views/home/index.html.erb](https://github.com/danmayer/coverband_demo/blob/master/app/views/home/index.html.erb#L6), an example of a view file referencing a broken image


# A Final Note

On an old legacy application we were able to delete over 50% of the total asset disk size, by clearing out old unused image assets. This made it easier to find and navigate our assets folder, and it significantly sped up both our test suite and deployment. While I wouldn't expect most projects to have as much image cruft sitting around, especially with older applications, it is easy for these unused assets to really build up over time.

While the above, should make it easier to delete image assets and do housekeeping yourself, it still takes a bit of time. You need to go through a process:

* find a likely set of unused images
* delete them, run tests
* add back images that were still used
* repeat until satisfied

This obviously looks like a process that can be automated to help you clean up all your image assets automatically. That is totally true, and I will cover how to do that in a future post. This post covers what is a prerequisite to being able to automate the cleanup, ensuring that your app will properly and very loudly fail when an image was removed which is still required.
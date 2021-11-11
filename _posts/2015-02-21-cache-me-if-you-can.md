---
layout: posttail
authors: ["Dan Mayer"]
title: "Cache me if you can"
image: /assets/img/cache-me-if-you-can-poster.jpg
category: Programming
tags: [Performance, Ruby, Caching, Tips]
---
{% include JB/setup %}

{% unless page.image %}
![image](/assets/img/cache-me-if-you-can-poster.jpg)
{% endunless %}

Recently, I was looking at a few endpoints to speed up. We were expecting to send large volumes of traffic to a few URLs and wanted to make sure they were fast. While digging in, I found about 10,000 unexected requests per minute (RPM), going between one of our back end services and another. Sometimes the same internal service request was occurring multiple times in a single front end request. I thought this can't be right, what is going on? Let's take a look.

I tracked the code issue down to something like this:

    def get_object_data(object_id)
      @object_data = Rails.cache.fetch("cache-key-name-#{object_id}", expires_in: 1.minutes) {
          SomeInternalApi.getCoolObject(object_id)
      }
    end

At first glance it seems fine, it looks like this is a normal cache call and should never make the same external request twice during the same request, let alone the same minute. Do you see the issue yet?

## Remember to take special care if you need to cache nil

Looking back at the logs, I noticed this was only occurring for objects that were no longer available. A minority of requests for sure, but they would happen over and over... Because the API client was turning the 404 response into nil. Unlike the case with an object `Rails.cache.fetch` won't cache `nil`. To read a bit more about features of `Rails.cache.fetch` or how it might not match expectations read the [cache.fetch documentation](http://api.rubyonrails.org/classes/ActiveSupport/Cache/Store.html#method-i-fetch).

There are two places I see this error pop up:

* forgetting the nil case in `Rails.cache.fetch`, as was the case I just found
* forgetting the nil case in a method with Memoization (`@var ||= getVar(id)`)
remember that rails.cache.fetch

## That makes sense, how do I fix it?

There are many ways to deal with this problem. I don't know if I think one is better than another necessarily. Honestly, long as the caching method takes nil into account, I am happy. All of the solutions I have seen are pretty obvious when reading the code.


##### NullObject Solution

One nice solution, I've seen was done by [@gfmurphy](https://twitter.com/gfmurphy) (according to `git blame`). It basically creates a Null Object, which can be cached. The Null Object solution looks something like this.

      class DataGetter
        NullData = Struct.new()
     
        def get_slow_data_rails_cache
          @slow_data_or_nil = Rails.cache.fetch("cache_key_#{params[:id]}", :expires_in => 30.minutes) {
            SomeService.slow_data(params) || NullData.new()
          }
          @slow_data_or_nil.is_a?(NullData) ? nil : @slow_data_or_nil
        end
     
        def get_slow_data_memoize
          @slow_data_or_nil ||= SomeService.slow_data(params) || NullData.new()
          @slow_data_or_nil.is_a?(NullData) ? nil : @slow_data_or_nil
        end
      end

##### Existence Check 
Another solution I have seen a number of times, so I don't know who to give original credit to, I will call the existence check.
 
    class DataGetter
      # this solution only works for memoization
     
      # This will not cache nils
      def get_slow_data__bad
        @slow_data_or_nil ||= SomeService.slow_data(params)
      end
     
      # This will cache nils, hooray!
      def get_slow_data__good
        return @slow_data_or_nil if defined?(@slow_data_or_nil)
        @slow_data_or_nil = SomeService.slow_data(params)
      end
    end
 
I am sure there are many other ways to handle caching for nils. I know I have seen others, but if you have a favorite way to solve this issue send it my way. If not just wanted to share that it is something to keep in mind. I have seen this issue a lot, and I am sure I have made this mistake my fair share of times. It is an easy thing to overlook, but can have fairly large consequences if nil can be an expected response.

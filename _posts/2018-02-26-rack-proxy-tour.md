---
layout: post
title: "Rack Proxy Tour"
image: /assets/img/rack-mouse.jpg
category: Ruby
tags: [Ruby, Rails, Rack, Proxy, CORs]
---
{% include JB/setup %}


# Rack Proxy Tour

I wanted to share a quick tour of a flexible Ruby tool. I have turned to [rack-proxy](https://github.com/ncr/rack-proxy) a number of times, throughout the years. It is a tiny and super useful Rack middleware that can quickly be adapted to perform a number of useful functions. While it is a small library it is a tool that has been handy for quick and lasting workarounds a number of times. It is a sharp tool, so be careful with it... Especially because it is severely lacking documentation... Perhaps I should send a documentation PR one of these days.

![Job Challenge](/assets/img/rack-mouse.jpg)
> image from [pixabay](https://pixabay.com/en/moose-moose-rack-male-bull-animal-70254/)

### Rack Proxy Examples

Some of the various ways I have used Rack Proxy over the years, while I wouldn't recommend all of them, sometimes a quick hack is needed and Rack proxy can be a powerful tool for that.

* subdomain based pass-through to multiple apps
* useful for handling awkward redirection rules for moved pages
* fan out a single API request to multiple concurrent backend requests and merging results
* authentication / authorization prior to proxying requests to a blindly trusting backend
* avoiding CORs complications by proxying from same domain to another backend

# Example Code

In the example below we will have our rack proxy middleware, handle user authentication and authorization then make an authenticated request to another service. In this case, any request to our Rails applications host with the path `/example_service/` will pass through to the target service.

```ruby
require 'rack-proxy'

class ExampleServiceProxy < Rack::Proxy
  def perform_request(env)
    request = Rack::Request.new(env)

	 # path matches our target &&
	 # user auth (devise in this case) found a logged in user
    if request.path =~ %r{^/example_service} &&
      env['warden'] &&
      env['warden'].user

		# have a user but using CanCan check if user has needed permissions
      if env['warden'].user.can?(:access, :access_example_service)
        token = "Bearer #{Settings['service.token']}"
        service_url = Settings['service.url']

        @backend = URI(service_url)
        env['rack.backend'] = @backend
        
        # while documentation says you only need on of these,
        # I needed to set them all to have the expected results
        env['REQUEST_PATH'] = env['REQUEST_URI'] = env['PATH_INFO'] = '/api/target_service_path'
        
        # target service fails on cookies
        env['HTTP_COOKIE'] = ''
        env['HTTP_AUTHORIZATION'] = token
        super(env)
      else
        Rails.logger.info "example_service: 401 user #{env['warden'].user.inspect} denied"
        [401, {}, ['Unauthorized!']]
      end
    else
      @app.call(env)
    end
  end
end
```

Then you can just hook up the middleware as needed, using something like below (in `application.rb` for example).

```ruby
config.middleware.use(ExampleServiceProxy)
```

If you want to be able to access the devise user `env['warden'].user` you will need to make sure your middleware is inserted after the devise middleware. You can quickly check the order by printing out the Rails middleware stack.

```
> rake middleware

use Raven::Rack
use BufferedLoggingMiddleware
...
use Warden::Manager
use ExampleServiceProxy
...
use OtherExamples
```

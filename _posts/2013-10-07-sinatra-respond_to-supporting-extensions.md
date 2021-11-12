---
layout: posttail
authors: ["Dan Mayer"]
title: "Sinatra using respond_to with url extensions (.json)"
category: Ruby
tags: [Ruby, Sinatra]
---
{% include JB/setup %}

Since I work most of the time in Rails, I found that using the [Sinatra responds_to](http://www.sinatrarb.com/contrib/respond_with.html) provided in [Sinatra-Contrib](http://www.sinatrarb.com/contrib/) to be a bit confusing. It didn't match my expectations mostly in terms of setting content type based on url extensions. It worked fine when curling a url with the proper accepts settings `curl -i -H "Accept: application/json"` but not when using a browser with the .json extension on the end of the url.

I ended up solving this by setting the `request.accept` array based matching a optionally appended format on the url. 
It was also hard to use named url parameters along with a optional format parameter across all the urls I wanted to support. I saw one solution that allowed a [optional format on a url](http://stackoverflow.com/questions/9775591/required-and-optional-parameters-for-sinatra-route), but it required modifying the path of each url. I didn't want to alter each of my uris with complex regex. I eventually got everything working as I would like, with a bit of hacking.

I added a before filter that checks the current request, if it matches the extension json (although this would work for any format), I set the request.accept headers. I then remove the extension from the path_info so that the urls work with the standard Sinatra route helpers. After adding that hack, the Sinatra-Contrib respond_to works as I expected.

#### Sinatra optional format before filter

    require 'sinatra/contrib'

    before /.*/ do
      if request.url.match(/.json$/)
        request.accept.unshift('application/json')
        request.path_info = request.path_info.gsub(/.json$/,'')
      end
    end

    #...

    get '/projects', :provides => [:html, :json] do
      @projects = Project.projects
      respond_to do |format|
        format.json { @projects.to_json }
        format.html { erb :index }
      end
    end

### Is there a better way?

Perhaps I am missing something, it took me a bit to figure out a good solution to this. Normally I find Sinatra matches my expectations very well and follows the principle of least surprise. That is why I decided to share my solution and see if there was just some other more simple way to solve the problem.

Anyways, using this I was able to make the [churn-site api](http://churn.picoappz.com/index.json) pretty nice to browse over a browser. Especially if you have the [JSONview](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) chrome extension which I highly recommend.
---
layout: post
title: "Sinatra using respond_to with url extensions (.json)"
category: javascript
tags: [ruby, sinatra]
---
{% include JB/setup %}

Since I work most of the time in Rails, I found that using the Sinatra responds_to provided in Sinatra-Contrib to be a bit confusing. It didn't follow my expectations mostly in terms of setting content type based on url extensions. It was also hard to use named url parameters along with a optional format parameter across all the urls I wanted to support. I eventually got everything working as I would like.

__(The first run might take as long as 60 seconds to return a result, more on why below)__

#### Example Ruby code snippet

<div class="ruby-runner" data-sig="izI5aBu3xe1wL1C+y19Xyl4gZRw=">
  <pre class="code">
require 'sinatra/contrib'

before /.*/ do
  if request.url.match(/.json$/)
    request.accept.unshift('application/json')
    request.path_info = request.path_info.gsub(/.json$/,'')
  end
end

# ...

get '/projects', :provides => [:html, :json] do
  @projects = Project.projects
  respond_to do |format|
    format.json { @projects.to_json }
    format.html { erb :index }
  end
end
  </pre>
</div>

### Neat, How's it work?

fdsdf
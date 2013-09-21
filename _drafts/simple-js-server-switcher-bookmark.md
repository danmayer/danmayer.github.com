---
layout: post
title: "Building a bookmarklet to switch between development, staging, and production"
category: javascript
tags: [ruby, sinatra]
---
{% include JB/setup %}

tiny blog post about writing js bookmarks to jump to prod, dev, qa

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
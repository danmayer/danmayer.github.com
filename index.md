---
layout: page
title: Continuously Deployed
tagline: Dan Mayer's Dev Blog
---
{% include JB/setup %}

{% for first in site.posts limit: 1 %}
  <h3>
    {{ first.title }} <small>{{first.sub_title}}</small>
    <span>{{ first.date | date_to_long_string }}</span>
  </h3>
  <div class="row">
    <div class="span8">
      {{ first.content }}
    </div>
    <div class="span4">
      Hello, this is where I am publishing my old development blog as well as making new posts in the future. I am not that active with my blogigng these days, but perhaps with a new blog setup I will be slightly more motivated. Currently I am mostly involved with Ruby and mobile development. You can find <a href="http://github.com/danmayer">my code on github</a>.
      <hr/>
      <ul class="posts">
        {% for post in site.posts %}
          <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
        {% endfor %}
      </ul>
    </div>
  </div>
{% endfor %}

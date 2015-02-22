---
layout: page
title: 
tagline: Dan Mayer's Dev Blog
---
{% include JB/setup %}

{% for first in site.posts limit: 1 %}
  <div class="row">

    <div class="span8">
      <h3 class="index-title">
        <a href="{{ first.url }}" class="noStyle">{{ first.title }}</a> <small>{{first.sub_title}}</small>
        <span>{{ first.date | date_to_long_string }}</span>
      </h3>
      {{ first.content }}

      <a href="{{ BASE_PATH }}{{ first.url }}" class="btn index-comments" style="float:right">comments</a>
      
    </div>

    <div class="span4">
      {% include side_bar.md %}
    </div>

  </div>
{% endfor %}

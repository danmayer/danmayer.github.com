---
layout: page
title: Test 
tagline: Dan Mayer's Dev Blog
---
{% include JB/setup %}

<div class="row">
  <div class="span8">

{% for post in site.posts limit: 7 %}
     <div class="index-summary">

      <h3 class="index-title">
        <a href="{{ post.url }}" class="noStyle">{{ post.title }}</a> <small>{{post.sub_title}}</small>
        <br/><span>{{ post.date | date_to_long_string }}</span>
      </h3>
      TEST
      {{ post.excerpt }}

      <a href="{{ BASE_PATH }}{{ post.url }}" class="btn index-comments" style="float:right">comments</a>
      <hr/>
      </div>
{% endfor %}

    </div>
    <div class="span4">
      {% include side_bar.md %}
    </div>

  </div>

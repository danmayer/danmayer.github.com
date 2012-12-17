---
layout: page
title: Continuously Deployed
tagline: Dan Mayer's Dev Blog
---
{% include JB/setup %}

{% for first in site.posts limit: 1 %}
  <div class="row">

    <div class="span8">
      <h3 class="index-title">
        {{ first.title }} <small>{{first.sub_title}}</small>
        <span>{{ first.date | date_to_long_string }}</span>
      </h3>
      {{ first.content }}

      <br/>
      <a href="{{ BASE_PATH }}{{ first.url }}" class="btn" style="float:right">comments</a>
    </div>

    <div class="span4">
      {% include side_bar.md %}
    </div>

  </div>
{% endfor %}

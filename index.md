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

      {% include side_bar.md %}

    </div>
  </div>
{% endfor %}

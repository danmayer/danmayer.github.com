---
layout: taildefault
title: Dan Mayer's Dev Blog
tagline: Dan Mayer's Dev Blog
---
{% include JB/setup %}

{% include heading.html heading=page.heading %}

<main class="py-6">
  {% for post in site.posts limit: 7 %}
    {% if post.group == "draft" %}
      <!--- hidden {{ BASE_PATH }}{{post.url}}--->
    {% else %}
      <div class="mb-12">
        {% include summary.html post=post %}
      </div>
    {% endif %}
  {% endfor %}
</main>%

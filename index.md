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

      <h4>Recent Posts</h4>
      <ul class="posts">
        {% for post in site.posts limit: 5 %}
          <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
        {% endfor %}
      </ul>

      <h4><a href="http://twitter.com/danmayer">@DanMayer</a> on Twitter</h4>
      <div id="twitter_div">
        <ul id="twitter_update_list"></ul>
      </div>
<script type="text/javascript" src="http://twitter.com/javascripts/blogger.js">
</script>
<script type="text/javascript" src="http://twitter.com/statuses/user_timeline/danmayer.json?callback=twitterCallback2&count=3">
</script>

      <h4>Links</h4>
      <ul class="links">
              <li><a href="http://resume.mayerdan.com/">Dan Mayer's Resume</a></li>
	      <li><a href='http://github.com/danmayer'>Dan Mayer on Github</a></li>
	      <li><a href="http://www.erinashleymiller.com/">Erin Miller's Blog</a></li>
	      <li><a href="http://www.livejournal.com/~idq">Inscrutable Drama Queen's Blog</a></li>
	      <li><a href="http://bbrinck.com/">Ben Brinckerhoff's blog</a></li>
	      <li><a href="http://avdi.org/devblog/">Avdi's development blog</a></li>
	      <li><a href="http://www.mark-ewing.com/">Mark's Blog</a></li>
	      <li><a href="http://mymovetola.com/">My Move to LA</a> </li>
	      <li><a href="http://magneticormosaic.com/">Magnetic or Mosaic music</a></li>
	      <li><a href="http://www.foresightphoto.com/">Foresight Aerial Photos</a></li>
	      <li><a href="http://gilesbowkett.blogspot.com/">Giles Bowkett Ruby and Music</a></li>
	      <li><a href="http://devver.wordpress.com/">Archived Devver blog</a></li>
	      <li><a href="http://del.icio.us/wastedbrains">my del.icio.us</a></li>
      </ul>

      </hr>
        This weblog is licensed under a <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons License</a>.<br/>
        <a href="http://creativecommons.org/licenses/by-sa/3.0/"><img alt="Creative Commons License" src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" /></a>

    </div>
  </div>
{% endfor %}

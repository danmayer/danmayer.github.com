<img src="/assets/dan_mayer_hiking_sm.jpg" width='100%' align="center"/>
<div class="intro">
I am Dan Mayer and this is my development blog. Currently it focuses mostly on Ruby development, a side of dev process, and best practices. It also has archives of my old development posts dating back to when I was first learning programming. I contribute to a few OSS projects and often work on my own projects, You can find <a href="http://github.com/danmayer">my code on github</a>.
</div>
<h4 class="side-header"><a href="http://twitter.com/danmayer">@DanMayer</a> on Twitter</h4>

<div class="well" style="padding: 8px 0;">
  <ul class="nav nav-list">
    <li class="nav-header">
      Recent Posts
    </li>
    
    {% for post in site.posts limit: 5 %}
      <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}

    <!-- not yet functional
    <li class="nav-header">
      Possibly Related
    </li>
    {% for post in site.related_posts limit: 3 %}
      <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
    -->

  </ul>
</div>

<div class="well" style="padding: 8px 0;">
  <ul class="nav nav-list">
    <li class="nav-header">Projects</li>
    <li><a href="http://nothingcalendar.com/">Nothingcalendar: track daily your progress</a></li>
    <li><a href="http://blog2ebook.picoappz.com/">Blog2Ebook: convert blogs to Kindle ebooks</a></li>
    <li><a href="http://churn.picoappz.com">Churn: track churn of your code over time</a></li>
    <li><a href="http://picoappz.com">Picoappz, tiny side project apps</a></li>
    <li><a href="https://github.com/danmayer/sinatra_template">Sinatra Template: generator app with opinionated configuration</a></li>
    <li>more baking in the oven...</li>
  </ul>
</div>

<div class="well" style="padding: 8px 0;">
  <ul class="nav nav-list">
    <li class="nav-header">Developer Links</li>
    <li><a href="http://avdi.org/devblog/">Avdi's development blog</a></li>
    <li><a href="http://gilesbowkett.blogspot.com/">Giles Bowkett Ruby and Music</a></li>
    <li><a href="http://erniemiller.org/">Ernie Miller's dev blog</a></li>
    <li><a href="http://www.naildrivin5.com/">David Copeland's dev blog</a></li>
    <li><a href="http://chadfowler.com">Chad Fowler's blog</a></li>
    <li><a href="http://austenito.com/">Austen Ito's blog</a></li>
    <li><a href="http://devver.wordpress.com/">Archived Devver blog</a></li>
  </ul>
</div>

<div class="well" style="padding: 8px 0;">
  <ul class="nav nav-list">
    <li class="nav-header">Other Links</li>

    <li><a href="http://www.erinashleymiller.com">Erin Miller's Blog</a></li>
    <li><a href="http://www.livejournal.com/~idq">Inscrutable Drama Queen's Blog</a></li>
    <li><a href="http://bbrinck.com">Ben Brinckerhoff's blog</a></li>
    <li><a href="http://magneticormosaic.com">Magnetic or Mosaic music</a></li>
    <li><a href="http://www.foresightphoto.com">Foresight Aerial Photos</a></li>
    <li><a href="http://www.wastedbrains.com">Dan's wastedbrains</a></li>
    <li><a href="http://del.icio.us/wastedbrains">my del.icio.us</a></li>
    <li><a href='http://github.com/danmayer'>Dan Mayer on Github</a></li>
    <li><a href="http://resume.mayerdan.com">Dan Mayer's Resume</a></li>
  </ul>
</div>

<div class="well" style="padding: 8px 0;">
  <h4 class="side-header">licensed under a <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons License</a>.</h4>
  <a href="http://creativecommons.org/licenses/by-sa/3.0/">
    <img alt="Creative Commons License" src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" style="padding-left:14px;" />
  </a>
</div>
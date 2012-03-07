---
layout: post
title: "Introducing Ruby Resume, a project to create and host your resume"
category:
tags: []
---
{% include JB/setup %}
Ruby, Github, Open source, Programming, Heroku, Markdown, Tools, ResumeThe <a href="http://github.com/danmayer/Resume">Ruby Resume project</a>, is a project I started to make it easier for Ruby developers to create, host, share their resume, and keep it up to date. It is an open source project, that anyone can use to help manage their resume online. It offers a variety of options and you can take or leave any part you wish. Basically, you fork the project, alter some things for your needs, and can contribute interesting additions back to the shared Ruby Resume project.

The project uses Sinatra, Markdown, and a collection of Rake tasks to get the job done. 

What does the Ruby Resume project do?
<ul>
<li>Supports deploying your resume to <a href="http://heroku.com">Heroku</a> in a variety of formats.</li>
<li>Easily deploy your app to any Sinatra compatible host</li>
<li>Allows simple publishing of your resume to your github personal page.</li>
<li>It makes it simple to publish your resume as a gem. I got the idea for a <a href="http://groups.google.com/group/rails-business/msg/68cf8a890c0d4fc8?pli=1">personal resume gem</a> from <a href="http://twitter.com/edavis10">Eric Davis</a>.</li>
<li>It uses Markdown, which integrates well with <a href="http://github.com/blog/553-looking-for-a-job-let-github-help">Github Jobs</a></li>
<li>It currently suppots HTML, LaTeX, and Markdown. Soon it will support PDF, RTF, etc...</li>
</ul>

I built this because I had to publish and start updating my resume again after not dealing with it for 3 years. I wanted something that would simplify the whole process. I wanted my resume under git, and I wanted to be able to quickly deploy any changes online and support a large number of formats.

Anyways check out the <a href="http://github.com/danmayer/Resume">source on Github</a> and the Readme which gives simple instructions on how to use the project. Or what the video below which demonstrates how to use this project for your own resume.

Live Examples:
<ul>
<li>My <a href="http://resume.mayerdan.com">resume on Heroku</a></li>
<li>My <a href="http://danmayer.github.com">Github personal page</a></li>
<li>My personal resume gem is, <a href="http://rubygems.org/gems/danmayer-resume">danmayer-resume</a>, which can be installed using <code>gem install danmayer-resume</code>, then execute danmayer-resume</li>
</ul>

<object width="400" height="300"><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=11642402&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1" /><embed src="http://vimeo.com/moogaloop.swf?clip_id=11642402&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="400" height="300"></embed></object><p><a href="http://vimeo.com/11642402">Ruby Resume Project</a> from <a href="http://vimeo.com/danmayer">dan mayer</a> on <a href="http://vimeo.com">Vimeo</a>.</p>

<div class="zemanta-pixie" style="margin-top:10px;height:15px"><a class="zemanta-pixie-a" href="http://reblog.zemanta.com/zemified/8c8aa943-8dd9-4306-a95c-2dbff0b07c08/" title="Reblog this post [with Zemanta]"><img class="zemanta-pixie-img" src="http://img.zemanta.com/reblog_e.png?x-id=8c8aa943-8dd9-4306-a95c-2dbff0b07c08" alt="Reblog this post [with Zemanta]" style="border:none;float:right"></a><span class="zem-script more-related pretty-attribution"><script type="text/javascript" src="http://static.zemanta.com/readside/loader.js" defer="defer"></script></span></div>
---
layout: post
title: "Jekyll Ruby code formatting and running"
category: javascript
tags: [ruby]
---
{% include JB/setup %}

This post is showing how to setup Ruby code formatting for Jekyll and Github pages as well as Ruby code running.

example Ruby code snippet:


<div class='ruby-runner' data-sig="yes0Ez82as/DTibeFfh7KPzqGVE=">
{% highlight ruby %}
require 'pdfkit'

kit = PDFKit.new('http://resume.mayerdan.com/')
Dir.mkdir('./artifacts') unless File.exists?('./artifacts')
file = kit.to_file('./artifacts/temp_pdf_kit.pdf')
puts 'done'
{% endhighlight %}
</div>  

### Instructions
To make this work on github pages for your own blog basically follow the [Pygments for Jekyll instructions](http://www.recursive-design.com/blog/2010/10/12/static-blogging-the-jekyll-way/). Remember to link the generated Pygments css file in your layout file. Then I just hacked together a really quick JQuery plugin which I include on my Jekyll layout template, starting from [Jquery.exampleRunner](https://github.com/conzett/jquery.exampleRunner), I modified the plugin to find any div with class `js-runner` and insert a `run` button which will include the results. You can view the source by checking this blogs source, or view [my version of jquery.exampleRunner source](http://mayerdan.com/assets/javascript/jquery.exampleRunner.js) directly.
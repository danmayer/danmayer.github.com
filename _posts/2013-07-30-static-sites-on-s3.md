---
layout: posttail
authors: ["Dan Mayer"]
title: "Easily Pushing Static Sites to S3"
category: Programming
tags: [Programming, Ruby, Static-site, S3, Aws, Practices]
---
{% include JB/setup %}

## Simple Static Site Hosting on S3

I wanted a simple way to build and host static sites on S3. I already had various apps storing files and pulling data from S3. I figured I could whip up a tiny app to make it easy to build up a static site and deploy it to S3. I decided to go with a simple rake task that can take template ERB files along with some data and merge it with the contents of a public folder and sync that rendered static files over to S3.

The first site I am using this technique on is a collection of some of my little side projects. I called the site [PicoAppz](http://www.picoappz.com/) and plan on hosting a number of projects there as subdomains, so I don't have to buy a new domain for each of my little one off projects.

You can see the source code for [PicoAppz on Github](https://github.com/danmayer/picoappz), the code started incredibly small and has grown as I added automatically pulling the latest screenshots of my apps, rebuilding the site on deploy, and I have started to build a Sinatra based admin app which will let me control some of the meta data.

## Static Site Publishing Code

The primary piece of code you would want to look at to grok the static site generation flow <!--more--> would be [lib/pico_appz](https://github.com/danmayer/picoappz/blob/master/lib/pico_appz.rb).

__Two primary entry points called from rake__


{% highlight ruby %}
  def build
    copy_public_folder
    render_templates_to_tmp
    upload_to_s3
  end

  def preview
    copy_public_folder
    render_templates_to_tmp
    `open ./tmp/index.html`
  end
{% endhighlight %}


__Then this basically breaks down to these small 3 steps__

{% highlight ruby %}
  def copy_public_folder
    puts 'copying'
    `cp -r ./public/ ./tmp`
  end

  def render_templates_to_tmp
    puts 'building'
    Dir["./lib/views/**/*.erb"].each do |file|
      puts "processing #{file}"
      template = File.read(file)
      rendered_file = Erubis::Eruby.new(template).result({:title => "picoappz", :data => app_data, :gh_data => fetch_github_data})
      output_file = file.gsub(/\.erb/,'').gsub(/\/lib\/views/,"/tmp")
      File.open(output_file, 'w') {|f| f.write(rendered_file) }
    end
  end

  def upload_to_s3
    puts 'uploading'
    Dir["./tmp/**/*.*"].each do |file|
      unless File.directory?(file)
        mimetype = `file --mime-type -b #{file}`.gsub(/\n/,"")
        mimetype = 'text/css' if file.match(/\.css/)
        filename = file.gsub(/\.\/tmp\//,'')
        puts "uploading #{file} to #{filename}"
        write_file(filename, File.read(file), :content_type => mimetype)
      end
    end
  end
{% endhighlight %}

The trickiest bit in there is that you need to have the correct mime type to set on files when you upload them to S3. It took me a couple attempts to find something that would be safe to call on either OSX or Ubuntu, but so far this seems to work everywhere I run it.

## Setup DNS

I was a little confused after reading some of the information about configuring DNS for S3 sites. Most of the tutorials you will find are pretty good, but some are out of date particularly with respects to hosting root domains without a 'www' vs with 'www'. I was planning on hosting a number of sites on subdomains, and decided I wanted the main site to be with 'www' always on. 

I use [DNSimple](https://dnsimple.com) to manage my domains, it was easy to set up two manual entries in my DNS to cover the root and www versions of the page.

* `URL	picoappz.com	600		http://www.picoappz.com` (This is a alias that will have all root traffic forward to 'www')
* `CNAME	www.picoappz.com	600		www.picoappz.com.s3-website-us-east-1.amazonaws.com` (This CNAME points at my s3 bucket for the site.)

 
For AWS S3, you just create a new bucket and configure some settings

* Make sure to have 'Enable website hosting' turned on
* I set my index document to `index.html` which I upload as the root of the site
* Under permissions add a bucket policy similar to


        {
	      "Version": "2008-10-17",
	      "Statement": [
		    {
			  "Sid": "AddPerm",
			  "Effect": "Allow",
			  "Principal": {
				"AWS": "*"
			  },
			  "Action": "s3:GetObject",
			  "Resource": "arn:aws:s3:::www.picoappz.com/*"
		    }
          ]
        }
        
  
That should be pretty much it. Now I plan on being able to very quickly add and build out other mini-sites and side projects that I can easily host on S3. If you are interested a bit more about how it [fetches screenshots](https://github.com/danmayer/picoappz/blob/master/lib/grabzit.rb) and the code that actually handles `write_file` to [upload to S3](https://github.com/danmayer/picoappz/blob/master/lib/server-files.rb) check out the source, both are in the lib directory of the project on github. It should be pretty easy to follow, make sure you set all the require ENV variables in your environment.

## The Result

    [master][~/projects/picoappz] rake build
    copying
    building
    processing ./views/index.html.erb
    uploading
    uploading ./tmp/404.html to 404.html
    uploading ./tmp/css/application.css to css/application.css
    uploading ./tmp/css/bootstrap-image-gallery.min.css to css/bootstrap-image-gallery.min.css
    uploading ./tmp/css/bootstrap-responsive.css to css/bootstrap-responsive.css
    uploading ./tmp/css/bootstrap-responsive.min.css to css/bootstrap-responsive.min.css
    uploading ./tmp/css/bootstrap.css to css/bootstrap.css
    uploading ./tmp/css/bootstrap.min.css to css/bootstrap.min.css
    uploading ./tmp/img/Blog2Ebook-clipped.png to img/Blog2Ebook-clipped.png
    uploading ./tmp/img/Blog2Ebook-full.png to img/Blog2Ebook-full.png
    uploading ./tmp/img/Blog2Ebook-thumb.png to img/Blog2Ebook-thumb.png
    uploading ./tmp/img/blog2ebook.png to img/blog2ebook.png
    uploading ./tmp/img/blog2ebook_sm.png to img/blog2ebook_sm.png
    uploading ./tmp/img/Churn-clipped.png to img/Churn-clipped.png
    uploading ./tmp/img/Churn-full.png to img/Churn-full.png
    uploading ./tmp/img/Churn-thumb.png to img/Churn-thumb.png
    uploading ./tmp/img/churn.png to img/churn.png
    uploading ./tmp/img/churn_sm.png to img/churn_sm.png
    uploading ./tmp/img/GitHub-Mark-120px-plus.png to img/GitHub-Mark-120px-plus.png
    uploading ./tmp/img/GitHub-Mark-32px.png to img/GitHub-Mark-32px.png
    uploading ./tmp/img/GitHub-Mark-64px.png to img/GitHub-Mark-64px.png
    uploading ./tmp/img/glyphicons-halflings-white.png to img/glyphicons-halflings-white.png
    uploading ./tmp/img/glyphicons-halflings.png to img/glyphicons-halflings.png
    uploading ./tmp/img/nothing_calendar-clipped.png to img/nothing_calendar-clipped.png
    uploading ./tmp/img/nothing_calendar-full.png to img/nothing_calendar-full.png
    uploading ./tmp/img/nothing_calendar-thumb.png to img/nothing_calendar-thumb.png
    uploading ./tmp/img/nothing_calendar.jpg to img/nothing_calendar.jpg
    uploading ./tmp/img/nothing_calendar.jpg-clipped.png to img/nothing_calendar.jpg-clipped.png
    uploading ./tmp/img/nothing_calendar.jpg-full.png to img/nothing_calendar.jpg-full.png
    uploading ./tmp/img/nothing_calendar.jpg-thumb.png to img/nothing_calendar.jpg-thumb.png
    uploading ./tmp/img/nothing_calendar.pdf to img/nothing_calendar.pdf
    uploading ./tmp/img/nothing_calendar.png to img/nothing_calendar.png
    uploading ./tmp/img/nothing_calendar_sm.png to img/nothing_calendar_sm.png
    uploading ./tmp/img/NothingCalendar-clipped.png to img/NothingCalendar-clipped.png
    uploading ./tmp/img/NothingCalendar-full.png to img/NothingCalendar-full.png
    uploading ./tmp/img/NothingCalendar-thumb.png to img/NothingCalendar-thumb.png
    uploading ./tmp/index.html to index.html
    uploading ./tmp/js/application.js to js/application.js
    uploading ./tmp/js/bootstrap-image-gallery.min.js to js/bootstrap-image-gallery.min.js
    uploading ./tmp/js/bootstrap.js to js/bootstrap.js
    uploading ./tmp/js/bootstrap.min.js to js/bootstrap.min.js
    uploading ./tmp/js/jquery-2.0.3.min.js to js/jquery-2.0.3.min.js
    uploading ./tmp/js/load-image.js to js/load-image.js
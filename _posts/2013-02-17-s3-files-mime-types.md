---
layout: posttail
authors: ["Dan Mayer"]
title: "Setting mime-type / content-type when uploading files to S3"
category: ruby
tags: [s3, aws, ruby]
---
{% include JB/setup %}

I was having a issue where after uploading a file to S3, it wouldn't allow any user to view the file with a browser, but only download the file. The issue turned out to be that S3 defaults to `binary/octet-stream` as the content-type. I realized, I needed to set the content-type / mime-type when uploading files to preserve their mime-type and how they are treated in the browser for the user.

I am using the [Fog.io](http://fog.io/) library to upload files and manage EC2 servers. It turns out that the ruby std lib File object doesn't have any methods to help with mime type. While there are many gems to help with the task I didn't really want to add another gem dependency or me around with what seem to be a large list of not recently maintained gems. After some quick google-fu, I found a solution that would work well enough on any unix like system. I just shelled out and called `file -Ib` and parsed it to get a mime type.


{% highlight ruby %}
   directory = connection.directories.create(
                                              :key    => "a-bucket-name",
                                              :public => true
                                              )
   filename = './somefile.txt'
   content = File.read(filename)
   mimetype = `file -Ib #{filename}`.gsub(/\n/,"")
   file_options = {
      :key    => filename,
      :body   => content,
      :content_type => mime_type,
      :public => true
    }
    file = directory.files.new(file_options)
    file.save
{% endhighlight %}


After preserving and uploading correct mime types, the files worked as expected. If a user clicks a txt file they see the contents in browser, same with images, etc. Anyways, that solved the issue for me. I am kind of surprised S3 doesn't have some sort of auto-detect mime type option.
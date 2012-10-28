---
layout: post
title: "Fix to install Nokogiri on bitnami EC2 instance"
category: ruby
tags: [aws, ec2, ruby, bitnami, sysadmin]
---
{% include JB/setup %}

Recently I set up a ec2 server, using the great [Bitnami ruby stack](http://bitnami.org/). I used bitnami, because I wanted to avoid having to deal with a bunch of server setup just to play around with a box. It worked great, but for some reason, I couldn't get the Nokogiri gem to install on the box. After trying many many solutions, I found this post on [StackOverflow](http://stackoverflow.com) about [installing nokogiri 1.5.2 on bitnami](http://stackoverflow.com/questions/9725679/installing-nokogiri-1-5-2). This was exactly what I was looking for, so my solution came down to, running the following command, with all libs, etc explicitly passed in.  

`sudo gem install nokogiri -- --with-xml2-dir=/opt/bitnami/common --with-xslt-dir=/opt/bitnami/common --with-xml2-include=/opt/bitnami/common/include/libxml2 --with-xslt-include=/opt/bitnami/common/include --with-xml2-lib=/opt/bitnami/common/lib --with-xslt-lib=/opt/bitnami/common/lib`

Thanks StackOverflow, and thanks Bitnami
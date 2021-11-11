---
layout: posttail
authors: ["Dan Mayer"]
title: Bitnami EC2 https and environment variables setup"
category: ruby
tags: [aws, ec2, ruby, bitnami, sysadmin]
---
{% include JB/setup %}

I have a project where I am using the [Bitnami ruby stack](http://bitnami.org/). I used bitnami, because I wanted to avoid having to deal with a bunch of server setup just to play around with a box. It has worked well, but I have had some stumbling blocks, originally I had trouble [installing nokogiri on Bitnami boxes](http://mayerdan.com/ruby/2012/10/21/installing-nokogiri-on-bitnami-ec2/), after getting past that I still needed to search around for solutions to setting up environment variables on Bitnami boxes. Then finally I needed to look up configuring https for my new box so I could pass secure API keys.

Addining environment variables on Bitnami servers
---

To add Bitnami environment variables for the Bitnami user (the default login user), just update the standard users `.bashrc` located at `/home/bitnami/.bashrc`


To add environment variables for web processes and servers started by Bitnami's default boot up, add variables to `/opt/bitnami/scripts/setenv.sh`

Add environment variables the standard way to either or both configs

    export SOME_ENV_VAR='accessible to servers'
    export ANOTHER_VAR='still here'
    
    
In my case I am using a Sinatra server behind apache2 served by passenger, so I can then just access the variables with `ENV['SOME_ENV_VAR']`.



Setting up Apache2 / Passenger for https on Bitnami stack
---

Since I was passing some API keys over to my Sinatra server, I wanted to make sure I could hit the API via https. It turns out Bitnami has pretty good docs on setting up a [Bitnami Apache2 server with http enabled](http://wiki.bitnami.org/Components/Apache#How_to_enable_SSL_to_access_through_https.3f). For me basically just the few steps enabled https

    emacs /opt/bitnami/apache2/conf/httpd.conf
    #uncomment LoadModule ssl_module modules/mod_ssl.so
    #uncomment Include conf/extra/httpd-ssl.conf
    emacs /opt/bitnami/apache2/conf/extra/httpd-ssl.conf
    # update the default virtual host for https traffic listening on 442
    
    <VirtualHost _default_:443>
      ServerName www.server.com
      DocumentRoot /opt/bitnami/apps/my_sinatra_app/public
      <Directory /opt/bitnami/apps/my_sinatra_app/public>
          Allow from all
          Options -MultiViews
      </Directory>

    #   General setup for the virtual host                                                                                               
    DocumentRoot "/opt/bitnami/apps/my_sinatra_app/public"
    ServerName www.server.com:443
    ServerAdmin you@example.com
    ErrorLog "/opt/bitnami/apache2/logs/error_log"
    TransferLog "/opt/bitnami/apache2/logs/access_log"

That got me part of the way there, but the instructions on creating a self-signed cert could have been a bit better and more clear, here is what I ran to generate my cert.

    $ cd /opt/bitnami/apache2/conf
    $ openssl genrsa -des3 -out privkey.pem 1024 
    $ openssl req -new -key privkey.pem -out cert.csr
    $ openssl rsa -in privkey.pem -out server.key
    $ openssl x509 -in cert.csr -out server.crt -req -signkey server.key -days 365
    $ apachectl restart    
    
That should do it, you should now be able to reach the same Ruby app behind https that was initially running on http. This let me get to the next step of playing around with my personal project, but really I need to get all of the Bitnami box setup automated with a chef script, but that is for another time.
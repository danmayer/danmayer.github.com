---
layout: posttail
authors: ["Dan Mayer"]
title: "Apache2 integrating Tomcat 5.5 on windows"
category:
tags: []
---
{% include JB/setup %}
I have been trying to do this off and on for over a year and a half and every time i run into problems and I get pissed and quit. I have found hundreds of pages that all say different ways of how to solve the problem of integrating tomcat 5.5 with apache2. Non of them worked for me, but after combining tips from various install guides I can show you what finally worked for me. After wasting over all the time hours and hours... here is all that I did small changes to the apache configure file and small ones to tomcats... restart both of there servers and WHOOPIE it just works. Apache2 with Tomcat 5.5 on a windows server.

      httpdconf changes:    LoadModule proxy_module modules/mod_proxy.soLoadModule proxy_connect_module modules/mod_proxy_connect.soLoadModule proxy_http_module modules/mod_proxy_http.so    <VirtualHost *:80>ServerName special.myname.comDocumentRoot "C:/Program Files/Apache Group/Apache2/htdocs"    <ifmodule mod_proxy.c>ProxyRequests OnProxyPass /cool http://66.***.***.**3:8082/your/webapp/rootdir/## these are comments on the dir#C:\Program Files\Apache\Tomcat 5.5\webapps\you\webapp\rootdir\# if anyone was confused to how that would map to windows tomcat stuff#ProxyPass /*.jsp http://66.***.***.**3:8082</ifmodule>    tomcat's server.xml:        <connector acceptcount="100" disableuploadtimeout="true" enablelookups="false" connectiontimeout="20000" port="8082" maxsparethreads="75" minsparethreads="25" proxyport="80" maxthreads="150" />

    thats it... you might have to change some of your jsps for how they find local directories and get all the lookups for the local directories to match your mapping, but you got it... it should all work now. Congradulations... if that didnt work for you here are some sites I was looking at for help:

      [Apache proxy forwarding](http://www.drewnoakes.com/snippets/ConfiguringApacheToRedirectASingleHostToMultiplePorts/)    [Apache 2 tomcat 5.5](http://forum.sun.com/thread.jspa?threadID=22381&tstart=210)    best of luck post comments here and i can try to help you if they are problems i have run into before.
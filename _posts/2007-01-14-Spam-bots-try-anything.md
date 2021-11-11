---
layout: posttail
authors: ["Dan Mayer"]
title: "Spam bots try anything"
category:
tags: []
---
{% include JB/setup %}
Well I have on many of my sites had to deal with and fight the onslaught of spam bots, but I still find them amusing some times. After a bug occurred on a production machine, I was looking at the logs and ran into many errors looking like this:


      2007-01-11 18:15:05,938 [TP-Processor4395]
      ERROR com.realestate.search.core.SearchController - java.lang.NumberFormatException: For input string: "http://valtrex-gs.****.com"2007-01-11 18:15:05,980 [TP-Processor4395]
      ERROR org.apache.catalina.core.ContainerBase.[Catalina].[localhost].[/].[jsp] - Servlet.service() for servlet jspthrew exceptionjava.lang.NumberFormatException: For input string: "http://valtrex-gs.***.com"       at java.lang.NumberFormatException.forInputString(NumberFormatException.java:48)


It seems this was a pretty dumb, but probably mildly successful bot. It started some search and found tons of web pages, every time it encountered a form, it would attempt to fill out the majority of the fields with the URL hoping to make it into generated pages, most common search terms, comments, user names, or anything that would possibly link to the URL and increase the sites page rank. I found it hilarious, because somewhere on our site it was trying to fill out number, date, and other fields with the URL which we threw errors on format exceptions and probably returned them to the form with an error about that field. The bot hasn't given up, but hasn't slammed us very hard. Either way it is another amusing tale, of spam bots running amok on the web.    At least they can make me laugh sometimes...
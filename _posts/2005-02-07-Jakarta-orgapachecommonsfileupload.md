---
layout: post
title: "Jakarta org.apache.commons.fileupload"
category:
tags: []
---
{% include JB/setup %}
Using this package caused a little more problems than one would have believed, but it was by far still the best option out there. I found some other beens, but they only would successfully upload Ascii files and were not writen properly to write out image files or other binary data. After having a problem with a few other packages I went to use Jakarta's java fileupload and after figuring out multiple issues and reading alot of documentation I got all of it working as I wanted. I thought I should share th links I ended up using that were usefull and helped me get everything working.

[File upload wrapper](http://www.theserverside.com/articles/article.tss?l=HttpClient_FileUpload) take a look at ProcessFileUpload.jsp

 <a href="http://jakarta.apache.org/commons/fileupload/using.html">Jakarta's how to use the fileupload package</a>


If you have any problems let me know and I can probably help you out.
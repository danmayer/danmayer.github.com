---
layout: post
title: "Converting XML with XSLT"
category:
tags: []
---
{% include JB/setup %}
Problem: Converting XML to Excel

I had to convert some XML to sort and display as we wished in excel. After reading a bunch of articles about XML-FO and other stuff about cacoon and other Java solutions I decided to go with just using a fairly simple XSLT stylesheet and convert the XML to HTML tables with the excel extension. This is even the <a href="http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnexcl2k2/html/odc_xlflatnr.asp">recommended solution by microsoft</a> (Which is probably because excel has a bloated and often changing format.) So converting this way leads to a well and easy and nice looking excel file and has the benifeit that anyone without excel can also view the file in a standard web browser. The microsoft tutorial on <a href="http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnexcl2k2/html/odc_xlflatnr.asp">converting XML with XSTL</a> is very good. If you have any problems or need more advanced XSTL this is also another very usefull <a href="http://www.zvon.org/xxl/XSLTutorial/Books/Output/example1_ch1.html">set of XSTL examples</a>. 

The basic idea is to make the stylesheet so that it can sort and create a easy to view html table. Then you can either let excel open the XML which can find the stylesheet and apply it for the user, or you can use a program to do the conversion for your user and output excel or html files. I needed to generate the files for my users so I went with Xalan from the apache foundation. 

Xalan is a XSL stylesheet processors in Java & C++

The example is simple to modify for whatever you need. I used the example file SimpleTransform, which can be found in the installation directory at

<install>\xalan-j_2_6_0\samples\SimpleTransform

The result is simple and easy, below I will include my XSLT file to show how easy it is toe create simple large tables from a nice little XSLT file.

I couldnt include it as text cause it tried to render it so here is a link to it...
<a href="http://WWW.bandddesigns.com/ml/arch/trans.xsl">Download file</a>
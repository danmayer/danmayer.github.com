# Pairing Around the Globe

I met a number of [Ruby devs when traveling](http://www.mayerdan.com/programming/2015/01/21/ruby-in-south-east-asia/). One developer I met [Samnang Chhun](http://samnang.me/) have been keeping in touch and wanting to pair on something. We hooked up online for a bit, while chatting we thought it would be nice if github readme's had a nice table of contents. So we decided to hack something up real quick. 

![image](/assets/img/gh_toc.jpg)

<script src="https://gist.github.com/samnang/cb9515ffcf5b0ab03f8f.js"></script>

It is kind of amazing that we can meet people and setup connections online, that much later are still growing and teaching us new things. The Ruby community has always excelled at this.

Considering we only had a little bit of time, the hack was obviously something simple. It was fun to hack on something while catching up, and to take something from ID to usable code while on a single call. You can drag the bookmarklet into you nav bar to quickly add a TOC onto any github page.

[Readme TOC][1]
[1]:javascript:function tocLink(a,e,n){var s='<li class=\"tooltipped tooltipped-w\" aria-label=\"'+e+'\"><a href=\"'+n+'\" aria-label=\"'+e+'\"class=\"js-selected-navigation-item sunken-menu-item\"><span class=\"full-word\">'+e+\"</span></a></li>\";return s}var header=\"<li class='tooltipped tooltipped-w'><strong>&nbsp;Table of Contents</strong></li>\",rows=[];$(\"a[class=anchor\").each(function(a,e){$anchor=$(e),$heading=$anchor.parent(),rows.push(tocLink($heading.prop(\"tagName\").toLowerCase(),$heading.text(),$anchor.attr(\"href\")))});var template=\"<div class='repository-sidebar'><nav class='sunken-menu repo-nav' role='navigation'><div class='sunken-menu-separator'></div><ul class='sunken-menu-group'>\"+header+rows.join(\"\")+\"</ul></nav></div>\";$($(\".repository-with-sidebar.with-full-navigation .repository-sidebar\")[0]).append(template)  



[Samnang](http://samnang.me/) is a Rails developer currently looking for remote contracting or full time Ruby gig's. If you are looking for someone get in touch with him.

how to bookmarklet: http://code.tutsplus.com/tutorials/create-bookmarklets-the-right-way--net-18154
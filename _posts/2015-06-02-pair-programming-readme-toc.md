# Pairing Around the Globe

I met a number of [Ruby devs when traveling](http://www.mayerdan.com/programming/2015/01/21/ruby-in-south-east-asia/). One developer I met [Samnang Chhun](http://samnang.me/) have been keeping in touch and wanting to pair on something. We hooked up online for a bit, while chatting we thought it would be nice if github readme's had a nice table of contents. So we decided to hack something up real quick. 

![image](/assets/img/gh_toc.png)

<script src="https://gist.github.com/samnang/cb9515ffcf5b0ab03f8f.js"></script>

It is kind of amazing that we can meet people and setup connections online, that much later are still growing and teaching us new things. The Ruby community has always excelled at this. Samnang posted about [pairing on this as well](http://samnang.me/2015/pair-with-dan-mayer/).

Considering we only had a little bit of time, the hack was obviously something simple. It was fun to hack on something while catching up, and to take something from ID to usable code while on a single call. You can drag the bookmarklet into you nav bar to quickly add a TOC onto any github page.

([Readme TOC](javascript:(function(){function%20tocLink%28a%2Ce%2Cn%29%7Bvar%20s%3D%27%3Cli%20class%3D%22tooltipped%20tooltipped-w%22%20aria-label%3D%22%27+e+%27%22%3E%3Ca%20href%3D%22%27+n+%27%22%20aria-label%3D%22%27+e+%27%22class%3D%22js-selected-navigation-item%20sunken-menu-item%22%3E%3Cspan%20class%3D%22full-word%22%3E%27+e+%22%3C/span%3E%3C/a%3E%3C/li%3E%22%3Breturn%20s%7Dvar%20header%3D%22%3Cli%20class%3D%27tooltipped%20tooltipped-w%27%3E%3Cstrong%3E%26nbsp%3BTable%20of%20Contents%3C/strong%3E%3C/li%3E%22%2Crows%3D%5B%5D%3B%24%28%22a%5Bclass%3Danchor%22%29.each%28function%28a%2Ce%29%7B%24anchor%3D%24%28e%29%2C%24heading%3D%24anchor.parent%28%29%2Crows.push%28tocLink%28%24heading.prop%28%22tagName%22%29.toLowerCase%28%29%2C%24heading.text%28%29%2C%24anchor.attr%28%22href%22%29%29%29%7D%29%3Bvar%20template%3D%22%3Cdiv%20class%3D%27repository-sidebar%27%3E%3Cnav%20class%3D%27sunken-menu%20repo-nav%27%20role%3D%27navigation%27%3E%3Cdiv%20class%3D%27sunken-menu-separator%27%3E%3C/div%3E%3Cul%20class%3D%27sunken-menu-group%27%3E%22+header+rows.join%28%22%22%29+%22%3C/ul%3E%3C/nav%3E%3C/div%3E%22%3B%24%28%24%28%22.repository-with-sidebar.with-full-navigation%20.repository-sidebar%22%29%5B0%5D%29.append%28template%29%3B}());))


---

[Samnang](http://samnang.me/) is a Rails developer currently looking for remote contracting or full time Ruby gig's. If you are looking for someone get in touch with him.
---
layout: post
title: "Code Highlighting on MovableType"
category:
tags: []
---
{% include JB/setup %}
[code:ruby]
def code_highlighting
  puts "this is a highlight"
end
[/code]

I found a <a href="http://blogspot.makotokw.com/portfolio/movabletype/syntaxhighlighter/">syntaxhighlighter plugin</a>, which makes it simple to use <a href="http://alexgorbatchev.com/wiki/SyntaxHighlighter">SyntaxHighlighter</a> on Movable Type. After downloading and unzipping the plugin in your MT directory. Just add the 
[code:ruby]<$MTSyntaxHighlighterInclude$>[/code] tag to your templates and then choose the SyntaxHighlighter format when making a post.
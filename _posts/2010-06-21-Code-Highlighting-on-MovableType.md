---
layout: post
title: "Code Highlighting on MovableType"
category:
tags: []
---
{% include JB/setup %}
`def code_highlighting  puts "this is a highlight"end` I found a [syntaxhighlighter plugin](http://blogspot.makotokw.com/portfolio/movabletype/syntaxhighlighter/), which makes it simple to use [SyntaxHighlighter](http://alexgorbatchev.com/wiki/SyntaxHighlighter) on Movable Type. After downloading and unzipping the plugin in your MT directory. Just add the <pre> MTSyntaxHighlighterInclude </pre> tag to your templates and then choose the SyntaxHighlighter format when making a post.
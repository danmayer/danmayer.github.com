---
layout: post
title: "Google Closure Compiler And Ruby"
category:
tags: []
---
{% include JB/setup %}
I have repeatedly needed to compress / minify a collection of javascript files. Which I had been doing by hand with [Google's closure compiler](http://closure-compiler.appspot.com/home). I started to get annoyed with this process and went looking for a better solution. If you are using Rails, there is a great solution using [Jammit](http://documentcloud.github.com/jammit/) asset packager library for Rails. I was not using rails, and just needed something that could write the files on demand. A bit of quick searching came up withh this post [Compressing Javascript Code With Google Closure Compiler And Ruby](http://tinyhippos.com/2010/01/08/compressing-javascript-code-with-google-closure-compiler-and-ruby/). It basically met my needs, but needed to be modified a bit to take a collection of files and write that collection of compresses files back to disk.<br />Here is the solution I ended up with:<br /><script src="https://gist.github.com/1063584.js"> </script><br />
---
layout: post
title: "Ruby on Rails Gem error could not find gem"
category:
tags: []
---
{% include JB/setup %}
I got this gem error on Ubuntu 6.06 over and over then finally I followed these instructions to install Ruby on Rails,

<a href="https://help.ubuntu.com/community/RubyOnRails">Install Ruby on Rails on Ubuntu 6.06</a>

and I changed one line:

sudo gem update --system IS WRONG!!!!

run:

sudo gem update

and thing all the sudo gem installs work perfectly fine for me. Why I have no idea. I hate computers sometimes, but at least ruby and rails now work for Ubuntu 6.06 on my system.
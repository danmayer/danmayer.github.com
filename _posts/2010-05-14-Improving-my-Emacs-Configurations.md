---
layout: post
title: "Improving my Emacs Configurations"
category:
tags: []
---
{% include JB/setup %}
Emacs, Aquamacs, emacs starter kit, developmentI have been using Emacs as my default editor for awhile now. My emacs setup was a hodge podge of various plugins, code from friends, blogs, etc... It wasn't organized and was hard to maintain and fine tune. I decided it was time to get my emacs config under control, and under git so it was portable and easy to revert update etc.

I looked at a couple options for existing Emacs configuration setups for Ruby.

<a href="http://github.com/technomancy/emacs-starter-kit">Emacs Starter Kit</a>
<a href="http://github.com/topfunky/emacs-starter-kit">Topfunky's Emacs Starter Kit</a>
<a href="http://github.com/walter/aquamacs-emacs-starter-kit">Aquamacs Starter Kit</a>

In the end I ended up going with <a href="http://github.com/walter/aquamacs-emacs-starter-kit">Aquamacs Starter Kit</a>, namely because I have been a fan of Aquamacs for awhile, and already new my way around it's system pretty well. The original Starter kit, from Technomancy, doesn't play nicely with Aquamacs and leads to some issues. Some people have forks that are supposed to work better with Aquamacs, but it seems the kit built from the ground up for Aquamacs works best. Topfunky's project is based on the original emacs starter kit, but has been customized to work well with <a href="http://www.apple.com/downloads/macosx/unix_open_source/carbonemacspackage.html">Carbon Emacs</a>, which is more cross compatible than Aquamacs, so your emacs config is more likely to be portable to all unix systems as well as OS X with Carbon emacs. This looks like a really interesting option, but I decided I liked some of the nice extra sugar that Aquamacs provides. 

First install <a href="http://github.com/walter/aquamacs-emacs-starter-kit">Aquamacs starter kit</a>

There were a few things that I couldn't stand from the defaults in the Aquamacs Starter Kit and removed also some modifications that I added. 

<h3>Disabling/Removing some Starter Kit features</h3>

You likely installed your starter kit to a location like, '/Users/danmayer/Library/Preferences/Aquamacs Emacs/aquamacs-emacs-starter-kit', go there to find the files for modification. 

Disabling the emacs Twitter client, sorry I like my twitter to be entirely separate from my dev environment. 
Then edit 'init.el':
<code>
;;(autoload 'twitter-get-friends-timeline "twitter" nil t)	
;;(autoload 'twitter-status-edit "twitter" nil t)	
;;(global-set-key "\C-xt" 'twitter-get-friends-timeline)
;;(add-hook 'twitter-status-edit-mode-hook 'longlines-mode)
</code>


Disable Ruby-electric, which tries to complete various matched chars and statements as you type like ', {}. (), begin/end, if/end, etc... It drives me nuts and breaks my thought process. Edit 'misc-mode-tweaks.el':
<code>
;;(require 'ruby-electric)	
;;(add-hook 'ruby-mode-hook
;;          (lambda nil
;;            (require 'ruby-electric)	
;;            (ruby-electric-mode)
;;            (flymake-mode-on)))
</code>

<h3>Additions to Starter Kit</h3>
I saw a Emacs package to add flog score inline to ruby method scores and thought that sounded like a great addition to help keep my methods concise, so I added that, to my .emacs:

<code>
;; ruby-complexity flog scores for methods http://github.com/topfunky/emacs-starter-kit/tree/master/vendor/ruby-complexity/
(add-to-list 'load-path "~/.emacs.d/vendor/ruby-complexity/")

(require 'linum)
(require 'ruby-complexity)
(add-hook 'ruby-mode-hook
	  (function (lambda ()
		      (flymake-mode)
		      (linum-mode)
		      (ruby-complexity-mode))))
</code>

I also liked some of the options from <a href="http://github.com/defunkt/textmate.el">defunkt's Textmate minor mode</a>. First 'cd ~/.emacs.d/vendor; git clone git://github.com/defunkt/textmate.el.git' Again added to my .emacs file:

<code>
;; textmate bindings for some nicer key combos for common actions
(add-to-list 'load-path "~/.emacs.d/vendor/textmate.el")
(require 'textmate)
(textmate-mode)
</code>

I am just starting to get going with improving my Emacs setup, so I am sure I will likely be making additional changes. The current changes above are checked into <a href="http://github.com/danmayer/aquamacs-emacs-starter-kit">my fork</a> of the project, feel free to pull the above changes if you'd like. If you have any great Emacs tips, tricks, or plugins I should add let me know as I am sure it can just keep getting better, but I am pretty happy for now.

<a href="http://www.mayerdan.com/custom_aquamacs.jpg"><img src="http://www.mayerdan.com/custom_aquamacs_sm.jpg"></a>



<div class="zemanta-pixie" style="margin-top:10px;height:15px"><a class="zemanta-pixie-a" href="http://reblog.zemanta.com/zemified/e37199cb-1e97-43c9-82a8-909a8342131f/" title="Reblog this post [with Zemanta]"><img class="zemanta-pixie-img" src="http://img.zemanta.com/reblog_e.png?x-id=e37199cb-1e97-43c9-82a8-909a8342131f" alt="Reblog this post [with Zemanta]" style="border:none;float:right"></a><span class="zem-script more-related pretty-attribution"><script type="text/javascript" src="http://static.zemanta.com/readside/loader.js" defer="defer"></script></span></div>
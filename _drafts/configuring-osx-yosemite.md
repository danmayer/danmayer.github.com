---
layout: post
title: "Configuring a new OS X Yosemite development machine"
category: Programming
tags: [Programming, Development, OSX, DevOps]
---
{% include JB/setup %}

This is a update from how I setup [OS X Yosemite](http://www.mayerdan.com/programming/2013/12/01/configuring-osx-mavericks-dev-machine/) years ago. Basically, it is more for my own reference, but that post seemed to be helpful to some others.

These are the steps I took to setup a new OS X 10.10.3 (Yosemite) machine for development. I have heard on twitter that each time you setup a new machine you get 1% better and at this rate you can become good at it in a few hundred years! Ha while that seems to be true I am getting happier with the process and I am now at least trying to document it. This post won't serve as a rich tutorial on the configuration process, but should give some ideas on good ways to setup your own machine or ideas on how to fix some common gotchas I ran into with my setup.

I know this is a very opinionated approach without much explanation, so if you are new to development I recommend finding richer tutorial as a this is largely intended for my own documentation.

# new instructions

* same xcode-select --install
* install brew manually from `http://brew.sh/`
* brew install gpg
* keys slightly different `gpg -o key.tar.gz --decrypt latest_keys.tar.gz.gpg`
* `brew install zsh`
* same verify `zsh`
* got your keys working clone your dotfiles so your terminal is better: `git clone git@github.com:danmayer/dotfiles.git`
* install rbenv `git clone https://github.com/sstephenson/rbenv.git ~/.rbenv`
* install postgres http://www.postgresql.org/download/macosx/ or http://postgresapp.com/


# Initial setup steps

* verify full disk encryption
* update password on account / machine (if one was previously configured)
* install all OS X updates
* install X code (this and the updates can be slow get this started as soon as you can)
   * cmd line `xcode-select --install`

# While Xcode installs

* install chrome
* setup chome sync so it will pull your plugins like [lastpass](https://lastpass.com/)
* while X code installs install [size up](http://www.irradiatedsoftware.com/downloads/?file=SizeUp.zip), or your prefered window manager 
* install dropbox, get sync started
* get your old ssh keys (or you can make new ones and upload them to services like github)
   * `tar czf key.tar.gz .ssh/`
   * `gpg -c key.tar.gz`
   * scp it over from other machines or encypted file sync via Dropbox
   * `gpg -o key.tar.gz --decrypt latest_keys.tar.gz.gpg`
   * `tar xvzf key.tar.gz`
* download and install [virtualbox](https://www.virtualbox.org/wiki/Downloads)
* download and install [aquamacs](http://aquamacs.org/) (or your favorite editor)
* download and install [flux](https://justgetflux.com/) for light filtering

# After Xcode, install brew

* fix various SSL errors like `Faraday::SSLError: SSL_connect returned=1 errno=0 state=unknown state: certificate verify failed`
  * you need to run `brew install openssl`
  * and `brew link openssl --force`
  * re-install your rubies! Don't forget to `rbenv rehash`

* install [iterm2](http://www.iterm2.com/#/section/home)

* install zsh brew install zsh
   * change default shell to zsh `chsh -s /bin/zsh`
   * verify your running zsh after opening new terminal `ps -o comm $$`
* install Pygments `sudo easy_install Pygments` #my dotfiles use Pygments
* git clone [dotfiles](https://github.com/danmayer/dotfiles), or however you sync your environment
  * sync your non git dot files encypted via scp or pgp dropbox sync (I keep .env_extras that contains some sensative keys so it is not stored on github) 
* configure VPN (if needed)
* install [Mou](http://mouapp.com/) (markdown editor)
* install campfire client ([Propane](http://propaneapp.com/))
* install IM client, [Adium](https://adium.im/)
  * configure [Adium for gchat](https://support.google.com/a/answer/48758?hl=en)
* `brew install qt`
  * at the time required HEAD `brew update; brew install qt --HEAD`
* `gem install thrift -v '0.9.0' -- --with-cppflags='-D_FORTIFY_SOURCE=0'`
* `brew install Mysql55`
    * initialize mysql:
          
          mysql_install_db --verbose --user=`whoami` --basedir="/opt/boxen/homebrew/Cellar/mysql55/5.5.30/" --datadir=/opt/boxen/homebrew/var/mysql55 --tmpdir=/tmp
          	
* `gem install mysql2 -v '0.2.18' -- --with-mysql-dir=/opt/boxen/homebrew/opt/mysql55/`
* `brew install imagemagick`

## Get your code

* begin to git clone all the things you love
* start to rbenv install all the Ruby versions you need
* bundle install all the things
* verify tests are passing or apps start

## Updates Since installed

* [rbenv to get latest ruby 1.9.3-p484 thanks @obfuscurity](https://twitter.com/obfuscurity/status/403776103929888768)

    	cd /opt/boxen/rbenv/plugins/ruby-build
	    git pull; cd
	    rbenv install 1.9.3-p484
	    rbenv global 1.9.3-p484
	    gem install bundler
	    
* configure default global node.js `nodenv global v0.10.21`	    

## Possible Improvements

* Should I install emacs starter kit or start over? I need to fix my emacs setup
* Automated way to reset all the OS X default apps to open file types?
* Automate some of the app downloads and installs
* Automate some of the common ruby version installs
---
layout: posttail
authors: ["Dan Mayer"]
title: "Configuring a new OS X Mavericks development machine"
category: Programming
tags: [Programming, Development, Osx, Devops]
---
{% include JB/setup %}

These are the steps I took to setup a new OS X 10.9 (Mavericks) machine for development. I have heard on twitter that each time you setup a new machine you get 1% better and at this rate you can become good at it in a few hundred years! Ha while that seems to be true I am getting happier with the process and I am now at least trying to document it. This post won't serve as a rich tutorial on the configuration process, but should give some ideas on good ways to setup your own machine or ideas on how to fix some common gotchas I ran into with my setup.

I know this is a very opinionated approach without much explanation, so if you are new to development I recommend finding richer tutorial as a this is largely intended for my own documentation.

# Initial setup steps

* verify full disk encryption
* update password on account / machine (if one was previously configured)
* install all OS X updates
* install X code (this and the updates can be slow get this started as soon as you can)
   * options download install pretty much all the requested packages
   * cmd line `xcode-select --install`

# While Xcode installs

* install chrome
* while X code installs install [size up](http://www.irradiatedsoftware.com/downloads/?file=SizeUp.zip), or your prefered window manager 
* install dropbox, get sync started
* get ssh keys
   * tar czf key.tar.gz .ssh/
   * gpg -c key.tar.gz
   * scp it over from other machines or encypted file sync via Dropbox
   * gpg --output key.tar.gz --decrypt key.tar.gz.gpg 
   * tar xvzf key.tar.gz
* download and install [virtualbox](https://www.virtualbox.org/wiki/Downloads)

# After Xcode, install / run Boxen

Installing Boxen will take a long time, so you can continue any download and configuration steps while it runs although some things you want to install are dependent on Boxen completing.

* [Boxen setup steps](https://github.com/boxen/our-boxen)
    
      cd our-boxen-master/
      sudo mkdir -p /opt/boxen
      sudo chown ${USER}:staff /opt/boxen
      git clone https://github.com/boxen/our-boxen /opt/boxen/repo
      cd /opt/boxen/repo
      script/boxen

* install [iterm2](http://www.iterm2.com/#/section/home)
* install coco-emacs or Aquamacs
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
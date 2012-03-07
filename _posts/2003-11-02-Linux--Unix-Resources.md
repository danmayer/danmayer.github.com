---
layout: post
title: "Linux / Unix Resources"
category:
tags: []
---
{% include JB/setup %}
This is a collection of various tips and things I use in linux. This is actually up on the web more as a refrence to myself than anything else. I keep learning this stuff, but since I dont use it all that frequently I tend to forget how to do something exactly the next time i need to. So here are little commands I use and some tiny descriptions. If you have some tips tricks or think i am doing something the hard way please feel free to comment and share. If you have any Linux / Unix questions please feel free to post them if you think it is something I might be able to help you with. That said here is what I got...

<B>Commands:</B>
// secure copy. This allows you to copy a file to another computer over SSH
scp filename compname:~/.  (exactly like this no spaces may occur anywhere in this)

//if something is in the background or you accidently suspended it you
//can bring it back to the front by typing
fg (in the command line)

//if you have sudo access you can do about anything on the system
sudo cmd (any command you want, then it will ask for your password)

//to quickly view a file
less filename.txt

//to open and edit a file
emacs filename

//to add to your path and edit many other settings this in your home directory
emacs .cshrc

//to get to your home directory
cd (or sometimes cd $HOME)

//FTP stuff
ftp domain.com
ftp> cd directory
ftp> put filename
ftp> get otherfile
ftp> quit

//To add users to the system
sudo adduser

//edit a users password if your root or can sudo
sudo passwd username

//to change your users password while logged on the system
passwd

//to give users sudo acces
sudo visudo
//to run a program and keep the console available
program &

//if you dont have the proper permissions for a file
chmod 666 filename (this gives read and write access to everyone, so it isn't secure, man chmod if you need a specific file rights)

<B>TomCat:</B>
To start tomcat run �bin/start-tomcat� from tomcats home directory
Tomcat installs /var/tomcat/webapps
Tomcat really /usr/local/Jakarta-tomcat
---
layout: post
title: "Broken MailEnable"
category:
tags: []
---
{% include JB/setup %}
Problem: Mail Enable Bad Mail folder became HUGE! Or MailEnable Bad Mail folder filled up!    MailEnable was stuffing my hard drive with badmessages and outgoing that i didnt think it was allowed to send. Some spammers obviously found a way to attack my mail server and start making it work for them... Anyways it filled an entire 80GB hard drive with bad emails... The folders where so large that explorer would crash when trying to delete the files. So I search around and found this solution to emptying the folders.    http://support.microsoft.com/default.aspx?scid=kb;en-us;555408    After you make sure it is working remove the /s from the end of the line you wont see that it is deleting one at a time, but the process goes about 10x faster because you aren't printing between each of the deletes.    I also dissabled my entire mail server until i can figure out what the hell is going on and how to stop the spamming bastards that are trying to take over my server.    windows server 2003 too many files to delete solved.Mail Enable can open config solved.Email Spam removed from system solved.    The problem now is how slow it is going while deleting the files.
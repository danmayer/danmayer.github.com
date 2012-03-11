---
layout: post
title: "GNU tar errors on windows"
category:
tags: []
---
{% include JB/setup %}
I ran into a very odd error while running GNU tar on windows XP under dos or the cmd.exe (dos emulator). The error must be incredibly rare since i only found one other post with similiar problems. I will first explain the error and then how it was fixed or resolved.    here is the one link that I found with the similiar GNU windows tar error [tar error](http://tolstoy.newcastle.edu.au/R/help/98b/0492.htm)

      my error:C:\dev\dsmayer\sandbox\exe>tar cvf tester.tar newstar: Cannot add file news: No such file or directory (ENOENT)tar: Error exit delayed from previous errors


news was a standard directory. the error we found was occuring because we were in the `C:\dev\*.*` directory apparently dev and aux (as the other user was having that error) are some sort of key words that screw up the program, I dont know why. I do know that moving tar.ext and my directory to a folder `c:\temp` or any other `c:\*.*.\dsmayer\sandbox\exe` and it would work. So if your having any erros similiar with GNU tar I suggest changing directories and seeing if that fixes your problems. Taring under cygwin in this directory worked fine it was only a problem when taring in dos. Good luck post any questions, comments, or other issues relating to GNU tar on windows here.
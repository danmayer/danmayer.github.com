---
layout: post
title: "Ant options"
category:
tags: []
---
{% include JB/setup %}
if your running out of Java Heap space memory while running ant you probably just need to increase the memory size for ant when it is running to do this you set the enviroment variable ANT_OPTS. 

ANT_OPTS=-Xmx128M

in windows you right click my computer go to properties, and then click advanced then set new enviroment variable name ANT_OPTS value -Xmx128M. If your running cygwin you must close current instances and reopen them to get the new settings to take effect, after opening up cygwin again try >echo $ANT_OPTS which should output your setting. If you still receive the error you can go higher with your memory. I have never had to go higher than 256.
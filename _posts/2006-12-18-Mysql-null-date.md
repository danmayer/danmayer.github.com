---
layout: post
title: "Mysql null date"
category:
tags: []
---
{% include JB/setup %}
I had an issue with java and hibernate returning a null date.

java hibernate java.sql.SQLException: Value '0000-00-00' can not be represented as java.sql.Date

This just took a little longer to find the fix on a google search than I thought it should have so I post what I ended up doing to resolve the situation here:

?zeroDateTimeBehavior=convertToNull

you add this to your jdbc connection url and it will convert the 0000-00-00 to the proper type for java to work with.

More info here:

http://dev.mysql.com/doc/mysql/en/cj-upgrading.html#cj-upgrading-3-0-to-3-1

thanks to this thread, which had many other suggestions, but most of them were not helpful, but the one above saved my day.

http://forum.java.sun.com/thread.jspa?threadID=649520&messageID=3824019

you can add this on the end of your hibernate connection file, like so...
<property name="hibernate.connection.url">jdbc:mysql://{DB_IPADDRESS}:{DB_PORT}/{DB_NAME}?zeroDateTimeBehavior=convertToNull&amp;profileSql=true</property>
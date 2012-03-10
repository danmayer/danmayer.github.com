---
layout: post
title: "Cleaning up files after hacking"
category:
tags: []
---
{% include JB/setup %}
system, adminThis blog was hacked awhile ago. It was annoying, I hadn't updated my blog software for awhile and there was a security hole. It was a good learning experience of how to deal with the intrusion. It was also nice to be able to quickly whip together some scripts to help clean everything up. <br />This let me see which files were recently modified``find . -type f -mtime -3 | grep -v "/Maildir/" | grep -v "/logs/"``<br />The exploiters were modifying my .htaccess and adding a few files of their own, this deleted their files<script src="https://gist.github.com/1491781.js?file=gistfile1.txt"> </script><br />This code helped remove exploit code that was injected into all of the pages on the site.<script src="https://gist.github.com/1491783.js?file=remove_code.rb"> </script><br />After upgrading my software and installing security patches, a bit of other cleanup, and file permission fixes everything was back to normal.<br />
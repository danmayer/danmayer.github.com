---
layout: post
title: "Java Tar and problems"
category:
tags: []
---
{% include JB/setup %}
I have been working on adding a bunch of GNU tar features to java tar. I will release the source soon, but I just wanted to comment on the lack of good documentation on the format that makes it very hard to work with the GNU tar format... Simple things like regular tar takes char 32 as a null and ignored character... and so does GNUtar for the regular tar fields but in the offset field needed for multi volume tars 32 crashes the program giving you header errors. It only accepts char 48 as a null which in the other size field it accepts either 32 or 48... things like this are commented no where and i only discoved by writting and editing the GNU tar source. Which is also far under documentated in the code and very hard to follow. 

GNU Tar size field: If your working with GNU tar the size field is just like the standard tar field  in ustar... except which is no where to be found in their documentation when you support unlimited size files. If you have a file larger than 8GB to support it you must write the number as bits in twos compliment notation. Also after doing the you have to flip the sign bit (the very most left 0) to a 1. Which would normally mean you have a negative number and now if you decode this as a twos compliment you end up with a huge negative number... but not encoded it normally as a positive number and flip that bit. I only figured this out after manually reading and decoding gnu tar and stanttard ustar headers for a long time. The is nothing that talks about how the support for unlimited files was added to gnu tar... well hopefully if you are having the same problem you found this page. So upgrading GNU tar or other programs to support GNU tar should be easier.

I have added support for these gnu features to javatar:
Multi volume
verification
unlimited filesize
fast single file extraction
Tar Table of contents (xml of the files and there offsets with in the tar)

If your interested in this or have any questions about GNU tar or JAva tar feel free to send me an email and ask.
---
layout: post
title: "Space Altering"
category:
tags: []
---
{% include JB/setup %}
I ran some initial results that would tell me how closely related all the documents within a category were related. we were looking for numbers in the .75 range. The first attempt was actually returning the .339 for one category and .328 for another. These were rather low. To improve the mean of the categories we thought creating a larger space with an overall larger vocabulary would help the documents to be more related. We increased the space from 987 total documents to 1798 documents. I didn't add any documents to either of the test categories, only to the overall space (documents that were really not related to either catgory). I also added a simple stoplist filtering out some common but irrelavent words. This didn't seem to help the relational mean between the two categories. The first category lowered from .339 to .320 while the second increased from .338 to .349. Now I have to decide wether to greatly increase the space, or greatly increase the documents within the categories (which i have to do by hand so it is a slow and time consuming process.)
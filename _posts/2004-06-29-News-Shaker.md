---
layout: posttail
authors: ["Dan Mayer"]
title: "News Shaker"
category:
tags: []
---
{% include JB/setup %}
The last couple of weeks i have done alot of work on news shaker. I have done lots of testing. I all of the categories (about 12) to an approximated error average of 88%. For 12 categories this is really good. First i began by adding more and more data to the categories and rebuilding the models. This initially was increasing the percents but it ceased to help after all of the categories had about 90 documents in them. I then began to play with the weight of the positive terms. This was highly successful after increasing the weighting on all of the positive training vectors I could successfully take all of the training data and recategorize it with 88% accuracy with the remaining documents not wrongly categorized but declared to be of an unknown category. I then started real world testing giving all of my category unseen documents that were hand categorized. The results for the few real world tests i have done so far have been fairly poor, showing only 15-20% accuracy. I am not sure why that varying how the model is made dramatically increases percent of categorization of known documents but seems to have no effect on unseen documents. This currently is the problem i am working on. It is possitive to get known values accuracy for my models to range from 85% to 93%. After a little more real world testing and some other discussion i might be able to come to a conclusion as to what is going on between known and unknown examples.
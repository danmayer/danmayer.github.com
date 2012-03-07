---
layout: post
title: "SVM Mail testing"
category:
tags: []
---
{% include JB/setup %}
Today I got a chance to let SVM mail sort 252 messages that it has never seen before. The messages were moved sucessfully fromt he inbox to either my real folder, or my spam folder. Out of the 252 messages the system incorrectly categorized 8 emails. Three of the 8 were actually the same message sent out from the frienster network. I have added those messages to real training model. This means on the first really good real world test my filter achieved an 96.8% accuracy. This comparess well to the 98% estimated acuuracy of the model, by categorizing the training data 98% correctly.

The system has been through about 400 emails, and my accuracy is now at 97.25 %. I have only retrained the model once including little bits of the new info I have collected. I places all of the incorrectly identified emails in the proper categories and retrained the system. Then just to see if that would make it correctly identify those emails I recategoried them, it cut the misclassifications in half, but some where still missclassified. It seems that forwarded messages with attachments are what it will missclassify still. Other emails seem good.

I am currently not working on or extending this project because it was just a testing project for some of my code, which I am now focusing back on my News Shaker project, which is using SVM classification to create a google news like site.
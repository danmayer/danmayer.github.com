---
layout: post
title: "Converting documents to word vectors"
category:
tags: []
---
{% include JB/setup %}
After unsuccessfully searching all over the web for source that would do this, I began writting my own code to convert all of my documents to word vectors based on a overall word space. I have a program that came with LSA called Pindex that does this but for LSA and it seems to give some odd results that I am not sure if they are compatable with SVM's. (I know that the formatting is different, which I will be converting to SVMlight formatting, but I am not sure if the data is valid.) I am now making a word vector for every document that will just be its total ratio to a total spaces count of those words. I will then have a seperate java app that allows you to give it two sets of documents and it will generate the proper SVM light input file. Giving one set of documents the positive value and the other set the negative. Then I should be able to create take any new text create its word vector based on the same dictionary and then run comparisons in SVMlight. I am hoping to have the text to vector done this weekend. It shouldn't be to difficult. Then I will release it on the web since i had a next to impossible time trying to find anything like this on the web.
---
layout: post
title: "Text to vectors progress"
category:
tags: []
---
{% include JB/setup %}
I finished the basic text to vector, but in its current form it is kinda useless. It only outputs to system.out in a format that isn't usefull yet. Also it doesn't save the dictionary that it uses to generate the vectors. So you can't generate any new word vectors to run comparisons with. I will be adding in features to save the generation dictionary, to import a saved dictionary, and to output the feature word vectors in the SVM light format. I also have recently found some cool java stemming software that I will add in to my project after I get the first usable version out. If your interested in the stemming software here are the links:    [Porter Stemming Algorythm](http://www.ils.unc.edu/keyes/java/porter/)    [Lancaster Stemmer](http://www.comp.lancs.ac.uk/computing/research/stemming/paice/paicejava.htm)
---
layout: post
title: "Java Resources"
category:
tags: []
---
{% include JB/setup %}
This is a collection of various tips and things I use in Java. This is actually up on the web more as a refrence to myself than anything else. I keep learning this stuff, but since I dont use it all that frequently I tend to forget how to do something exactly the next time i need to. So here are little commands I use and some tiny descriptions. If you have some tips tricks or think i am doing something the hard way please feel free to comment and share. If you have any Java questions please feel free to post them if you think it is something I might be able to help you with. That said here is some java stuff...

First off i think the best way to work with java code and projects is using J Builder. It is available free for personal use. I highly recommend it. It is available for linux and windows. get it from <a href="http://www.borland.com/jbuilder/">Borland</a>

If your going to develop web applications I also highly recommend apache tomcat. It is a free java (JSP) server. It is also available for both windows and linux which is great. get it from <a href="http://jakarta.apache.org/tomcat/">Apache Tomcat</a>

If a java program keeps running out of memory, this is easy to fix. The java virtual machine is only given so much memory. So running:
"java -Xmx256m PROGRAMNAME" should fix the problem by giving the virtual machine 256 mb of memory. You will see this error as a java.lang.outofmemory error. If your using J builder go to project->run->Java VM parameters: and add the -Xmx256m to the parameter line.

Here's how you could rewrite that statement using the ?: operator:

System.out.println("The character " + aChar + " is " +
                   (Character.isUpperCase(aChar) ? "upper" : "lower") +
                   "case.");

The ?: operator returns the string "upper" if the isUpperCase method returns true. Otherwise, it returns the string "lower". The result is concatenated with other parts of a message to be displayed. Using ?: makes sense here because the if statement is secondary to the call to the println method. Once you get used to this construct, it also makes the code easier to read.

<B>Files:</B>
One of the first Java projects I did the source and some info on a AOL Instant messenger (AIM) chatterbot. Built using simpleaim, megahal and some of my own work. Most of the work was in combining the programs learning how they worked and such though. I did add a nice logger to it as well. This still needs alot of work to be that impressive. download <a href="./files/MegaDan.zip">MegaDan.zip</a>

A part of my machine learning, for project News Shaker. Text2SVM converts text documents into the proper format for use with SVMlight. It is fairly well commented and contains the full source code. This is a good easy way to learn to work with reading and writting files since it has alot of IO. Visit this projects own page, <a href="http://www.deadawakemovie.com/ml/archives/000138.html">Text2SVM</A>.

My edited and improved version of weblech. Weblech is a web spider. I added many features and costumized it for my own  purposes. This crawler uses google to find files that are relavant to whatever topics your working on. <a href="http://programming.wastedbrains.com">Download the improved weblech from here</a>

Links:
<a href="http://sourceforge.net/projects/weblech/">A great starting point for building a java web spider (Weblech)</a>

<a href="http://programming.wastedbrains.com">My edited and improved version of weblech</a>

<a href="http://home.clara.net/robmorton/projects/wc/">A great Java Word Counter / dictionary builder</a>

<a href="http://www.csd.abdn.ac.uk/~pgray/teaching/CS3011/prac4.html">Stop List</a>

<a href="http://www.javapractices.com/Topic87.cjp">Parsing Text</a>

<a href="http://www.javacoding.net/articles/technical/java-mysql.html"> Java MySQL tutorial</a>

<a href="http://www.ils.unc.edu/keyes/java/porter/">Java Porter Stemming Algorythm</a>

<a href="http://www.comp.lancs.ac.uk/computing/research/stemming/paice/paicejava.htm">Java Lancaster Stemmer</a>

<a href="http://www.airporttools.com/other/programming/hashsorting/"> Sorting a hash table in java</a>

<a href="http://jigsaw.w3.org/Doc/Programmer/api/org/w3c/tools/sorter/Sorter.html"> Java sort class (sorts most types)</a>

<a href="http://neuron.eng.wayne.edu/"> a great java machine learning site</a>

<a href="http://java.sun.com/developer/onlineTraining/JavaMail/contents.html"> Pretty much everything you would need to work with java Email </a>

<a href="http://www.ftponline.com/javapro/2004_01/online/javamail_kjones_01_28_04/default_pf.aspx"> How to work with multipart email messages</a>

<a href="http://java.sun.com/docs/books/tutorial/uiswing/components/example-1dot4/index.html#TextSamplerDemo">Great Java Swing Tutorials, especially the stuff on the grid bag layout</a>

<a href="http://java.sun.com/j2ee/1.4/docs/tutorial/doc/">Great webservices and java XML info</a>

<a href="http://www.manageability.org/blog/stuff/top-ten-truly-obscure-java-projects/view">The 10 best and unervalued least known about java libraries. some of these would be great to use in many projects without reimplementing there feautres yourself.</a>
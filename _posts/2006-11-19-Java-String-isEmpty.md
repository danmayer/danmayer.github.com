---
layout: post
title: "Java String isEmpty()"
category:
tags: []
---
{% include JB/setup %}
I have heard the java string class will finally get the isEmpty method in an upcoming release. Lets hope it is in 1.6, because I can't wait much longer, I can't for the life of me see why this was ignored for so long. Why have I had to put this in so many freakin if statements when this could have been fixed by adding a very easy and simple but amazingly easy to read and useful method.

String randWord;

/*
random code or back in forth between many different classes 
*/

String someFunction() {
if(randWord!=null && !randWord.equals("")) {
  /*do something*/
}

....
}

all of this could just be replaced and make the code so much more readable with the isEmpty function, becoming the following...

if( !randWord.isEmpty() ) {
  /*do something*/
}

I want this functionality and I want it now... I guess since java is now opensource I should just go override the String class to add one simple function! So much value and so simple.
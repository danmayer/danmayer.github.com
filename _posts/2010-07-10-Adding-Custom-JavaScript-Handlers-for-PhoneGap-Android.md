---
layout: posttail
authors: ["Dan Mayer"]
title: "Adding Custom JavaScript Handlers for PhoneGap Android"
category:
tags: []
---
{% include JB/setup %}

One of the advantages I mentioned about PhoneGap, was being able to write custom native code, and interface with it via JavaScript. Their Aren't great example of how to do this out there, so I figured a quick blog post was in order.    I search around for how to do this when getting started with PhoneGap, and the best example I could find was, [Native messages for Android PhoneGap](http://www.somms.net/2010/05/28/native-messages-for-android-phonegap/). Following this example, I was able to get my own Javascript interface working.    Basically you create a class (using java for android example):   

    <script src="http://gist.github.com/470919.js?file=CustomJS.java"> </script>

I create this private class in the main Java class which extends DroidGap (the class that boots up PhoneGap and creates the webview UI).    

    <script src="http://gist.github.com/470920.js?file=extendDroidGap.java"> </script>

Then in your html you can call in javascript bridged Java functions like `var myData = CUSTOM.getData();` which will return the java data (in this case a string) to the javascript. I have used the JS bride to begin new Android Activities, Close the WebView and move entirely to Native code. Background the WebUI to do something native for awhile, then return the WebView back to the front, Etc.    

    <script src="http://gist.github.com/470922.js?file=customJSPhoneGap.js"> </script>

This can be done similarly for the iPhone and Objective-C to Javascript with PhoneGap. This lets you leverage extra native flexibility while still building the majority of your app as JS, CSS, and HTML.
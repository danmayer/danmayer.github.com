---
layout: post
title: "Javascript document.addEventListener PhoneGap deviceready issues"
category:
tags: []
---
{% include JB/setup %}
I had some issues with the deviceready callback. I had seen some similar posts, and figured I could save someone some time. Basically when using document.addEventListener order matters a lot. It all comes down to exactly when this line is loaded and what is already defined.     <pre>document.addEventListener("deviceready", deviceSetup, true);</pre>    We have custom JS, and originally it was loaded second, so the deviceready event was fired before, the listener was set.     

        <script src="lscustom.js" type="text/javascript" charset="utf-8"> </script>
        <script src="phonegap.js" type="text/javascript" charset="utf-8"> </script>

After that I was still having an issue and it turns out the method you define register as the callback needs to be defined before you add the listener. So having this in our lscustom.js works.     
        var deviceSetup = function(){   console.log("Device Setup"); };
        document.addEventListener("deviceready", deviceSetup, true);
        While, the below fails. document.addEventListener("deviceready", deviceSetup, true);
        var deviceSetup = function(){   console.log("Device Setup"); };

Anyways since I ended up wasting a bit of time searching and debugging this issue, I figured I would share my debugging session. 
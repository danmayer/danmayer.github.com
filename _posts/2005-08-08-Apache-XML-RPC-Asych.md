---
layout: post
title: "Apache XML RPC Asych"
category:
tags: []
---
{% include JB/setup %}
Exception in thread "Thread-0" java.lang.NullPointerException at org.apache.xmlrpc.XmlRpcClient$XmlRpcClientAsyncThread.run(XmlRpcClient.java:271)    If your getting any similar errors while trying to run executeAsync from the XmlRpcClient (org.apache.xmlrpc.XmlRpcClient) class. The problem is this [bug](http://issues.apache.org/jira/browse/XMLRPC-62), which has been fixed by apache, but hasn't made it into the binaries or the src releases because they havent been updated fro some time. To get the fix use the anonymous cvs, or apply this [patch ](http://issues.apache.org/jira/secure/attachment/12310763/executeAsync.patch) to your src. It took me a few hours to figure out the problem with this and fix it after finding the patch.    So if you build the jars and use the xmlrpc-2.0-beta that is built as the jar you include in your project that should fix everything.
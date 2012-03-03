---
layout: post
title: "java in cygwin"
category:
tags: []
---
{% include JB/setup %}
man I had some serious problems running java in cygwin with a shell script (sh script)... So I am going to post my script to help you out... there are a couple things of note first...

java a windows program expects windows paths your cygwin script proably uses unix paths.

cygwin sh scripts treat ';' as a special character so when using multiple classpaths you must escape it '\;' to make it work as expected...

# test.sh
JAVAEXE=$JAVA_HOME/bin/java.exe
cd ../
IEP_HOME=C:\\dev\\dsmayer\\sandbox\\iep
IEP_BIN=C:\\dev\\dsmayer\\sandbox\\iep\\bin
IEP_LIB=C:\\dev\\dsmayer\\sandbox\\iep\\lib
IEP_JAR=C:\\dev\\dsmayer\\sandbox\\iep\\lib\\iepio.jar
IEP_IST=C:\\dev\\dsmayer\\sandbox\\iep\\lib\\istcustom.jar
IEPB_JAR=C:\\dev\\dsmayer\\sandbox\\iep\\lib\\backport-util-concurrent.jar
IEP_PROPS=C:\\dev\\dsmayer\\sandbox\\iep\\properties

echo java -cp $IEP_JAR\;$IEP_IST\;$IEPB_JAR RCS.example.RCSreg
echo
java -cp $IEP_JAR\;$IEP_IST\;$IEPB_JAR RCS.example.RCSreg &
java -cp $IEP_PROPS\;$IEP_JAR\;$IEPB_JAR\;$IEP_IST RCS.example.clients.ResourceClient &
java -cp $IEP_PROPS\;$IEP_JAR\;$IEPB_JAR\;$IEP_IST RCS.example.clients.UserClient &
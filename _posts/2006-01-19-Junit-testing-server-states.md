---
layout: post
title: "Junit testing server states"
category:
tags: []
---
{% include JB/setup %}
Alot of Junit docs and faq tells you that have bad design if your trying to extend test suite so that there is only one setUp() and testDown() for a whole sweet of tests, but that just isnt true when your trying to tests proper order of state changes each transaction should change the state of the server dpending on its current state, if the server is started up new for each test your only testing the start up state... my single unit tests have dependencies on previous tests that has cuased the server to be in its current state... So no where gives good documentation on how to do this the faq is un usefully short showing how to extend testSuite but not how to use it... so here is the best page for how to actually use it just ignore hte Turbine2 stuff:

<a href="http://wiki.apache.org/jakarta-turbine/Turbine2/FAQ">16. Q: How can I setup Turbine once for my JUnit Test cases?</a>

And remember that Junit executes your tests in order alphabetically and numerically after the intial keyword test.

ie

TestA will run before TestB so if you running tests in order for state make sure that you have your tests named appropriately to be sure they will run in the expected order.

hope this helps someone running into problems running Juint with a single setUp across a suite of tests.
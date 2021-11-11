---
layout: posttail
authors: ["Dan Mayer"]
title: "Rails tests gotcha with I18n.locale"
category:
tags: [Ruby, Rails, Testing]
---
{% include JB/setup %}

A example of a bad I18n rails test... Found some tests failing in a project because tests in different files would change I18n.locale, changes like this make your tests fail if the tests are not run in the standard order. since this took me awhile to track down, I thought I should share a quick example for others to find. So if you are having a issue like this remember to add a teardown method that resets I18n.locale to the default local.

    <script src="https://gist.github.com/1568648.js?file=I18n_bad_test.rb"> </script>
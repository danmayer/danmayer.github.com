---
layout: post
title: "Quick Application Diagrams with Yard"
category: Ruby
tags: [ruby, rails, yard]
---
{% include JB/setup %}

Thanks to following awesome people on twitter I learned something I didn't know about yard. That is can be used to create nice application diagrams. I saw a tweet from [Matt Aimonetti](https://twitter.com/merbist/status/336417811079495681), about generating diagrams with yard. I was interested in trying it out myself. After quickly installing [graphviz](http://www.graphviz.org/) which I apparently no longer had on my machine, I was rewarded with some nice diagrams for my rails apps. It also works well for gems as you can see from the churn graph below. Unfortunately it doesn't seem to work completely out of the box on Sinatra apps, so I might need to learn a bit more configuration.

    brew install graphviz
    gem install yard
    yard -n
    yard graph --dependencies | dot -Tpdf -o app_diagram.pdf
    
Above was all that was needed to get rails app diagrams like those below.

Churn  

![Churn Diagram](http://mayerdan.com/assets/churn_app_diagram.jpg)

Small Rails apps (Hearno followed by NothingCalendar2)

![Hearno Diagram](http://mayerdan.com/assets/hearno_app_diagram.jpg)

![NothingCalendar2 Diagram](http://mayerdan.com/assets/nothingcalendar2_app_diagram.jpg)
---
layout: posttail
authors: ["Dan Mayer"]
title: "Developer Team Onboarding Playbook"
image: /assets/img/playbook.png
category: Management
tags: [Programming, Development, Management, Process]
---
{% include JB/setup %}

> {% unless page.image %}
![image](/assets/img/playbook.png)
{% endunless %}
> 
> photo credit: [opensourceway](https://www.flickr.com/photos/opensourceway/5537336155)


# Developer Team Onboarding Playbook

I'm working on building out a plan to improve our engineering onboarding at [Offgrid Electric](http://offgrid-electric.com/). As we start to add engineers to the team at a faster pace, the cost of not getting onboarding right increases. I'm sure the playbook is slightly different from team to team, and I think it is important to note that I am developing this playbook with a distributed team in mind.

I reached out to some mentors, past & current teammates, & twitter to develop a plan. I would love further suggestions, if you feel I am missing something or breaking [Rule One of Management: First, Do No Harm](http://chadfowler.com/blog/2014/01/19/rule-one-of-management-first-do-no-harm/).

This is my current draft on building out an onboarding playbook:

* Have a home for onboarding plans, checklists, & materials
  * different pieces in git, wiki, or project management software
  * execute / improve against playbook with each hire
  * plans are available to everyone including the new hires to help improve
* Checklists
  * accounts to be setup (and who is responsible for setting them up)
  * email lists, groups, permissions to be granted (and who is responsible for setting them up)
  * things that need to happen in the first day, first week, first month
* Send welcome / Team Introduction email
* Assign a team buddy
  * helps answer questions on company, process, code, & culture
  * partner for first staging deployment
  * partner for first production deployment
  * many teams make use of a buddy, the concept is covered well in, [Make New Teammates Feel Welcome from the Start](https://zapier.com/learn/the-ultimate-guide-to-remote-working/remote-employee-evaluation/), of Zapier's guide to remote work. 
* Day one plan
  * 1-1 with hiring manager, verify basic accounts setup together 
  * get on team communication tools (Slack, Asana, etc)
  * git commit to documentation
  * time to install dev tools
  * 1-1 with buddy
* Initial getting started on the project
  * Follow project setup instructions, sending PRs for any missing, dated, or confusing information along the way
  * tests passing
  * development server success
  * mobile app builds (mobile devs)
  * mobile app can connect to dev server (mobile devs)
* Initial smaller quick win tickets for the first week(s) 
* Intro Getting Started Pairing Schedule
  * a small number of schedule pairing events in the first few weeks 
  * scheduled pairing time with buddy 
  * scheduled pairing time with team mates, help with knowledge sharing and getting to know folks 
* Schedule initial check-ins
  * with team lead 1 week, 2 weeks, 1 month, 3 months
  * with buddy
  * with business partners (if sensible)
  * with other key players (QA, etc)
* Scheduled items should be added to new dev's calendar
 
Thanks [@mariagutierrez](https://twitter.com/mariagutierrez), [@glv](https://twitter.com/glv), [@tempo](https://twitter.com/tempo), [@sonia_pdx](https://twitter.com/sonia_pdx), & [@davetron5000](https://twitter.com/davetron5000) for ideas and inspiration.

If you have ideas, please share in the comments or hit me up on twitter [@danmayer](https://twitter.com/danmayer)

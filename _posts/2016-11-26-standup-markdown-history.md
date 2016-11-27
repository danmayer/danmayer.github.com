---
layout: post
title: "Standup Markdown History"
category: 
tags: []
---
{% include JB/setup %}

It is good to be able to keep track of the daily work you do and to keep focus on important larger initiatives. While working as a team having software that supports robust communication and integrations is necessary, I find it overkill for personal daily use, quick tracking, and reflection over time.

I have instead followed a different practice for years, that I have show a few people who have also found it helpful. I keep it as simple as possible with a few Markdown files, which I check into a private git repo.

This works well because it is quick and free form. I still occasionally take notes on paper but I transfer things into my Markdown notes at the end of each day. I have different sections and templates that I can use for weekly, quarterly, and yearly tasks. Nothing is faster than a few bullet lists of todos for day to day work, which keeps me focused on what I need to get done each day. It also let's me quickly throw in anything that came up suddenly which took my attention, letting me see why any goals for today slipped to tomorrow.

These notes eventually turn into a story and keep my history, when I reflect back on OKRs each quarter, I go through these notes to pull out the bigger picture of what I accomplished for the quarter. My history of work I have captured for the last 3 or 4 years this way and can extract patterns and themes, and if I want to accomplish something over the long term build it into the short term goals to see improvements over the years.

I have refined this system for a few years and it has been the best thing at keeping me on track and focused for a long while now. I hope you can find parts of it helpful as well.

### Tools for Markdown Standups

The tools to support this kind of process is super light weight, which is one of the advantages. I can even edit these through the github editor on my phone if I am away from my computer.

* Text Editor (MacDown)
* Git (I check in files when I make significant changes or at least weekly)

### Project Structure

Having a bit of structure with multiple files and sections of your primary file can be helpful. I keep all of these notes in a single folder, `notes`, which I then have several documents that are active.

* `notes` (directory)
   * `archive` (directory)
   * `standup.md` (the primary file I work on daily)
   * `scratch.md` (a staging area for notes on anything that often gets moved to official documentation, project ReadMes, emails, google docs, code, etc at a later time)
   * `okr_q1.md`, `okr_q2.md`, etc (my quarterly goals and notes reflecting on them at the end of the quarter)
   * `random.md` various documents in progress, individual documents I use when staging something larger to be shared with the team when more complete.

### Notes Templates

I keep various levels of notes in my standup file... Here is a fairly blank template that gives the high level structure, below I will explain a few of the sections in more detail.


```Markdown
# Links

* various links
* sometimes sub link sections

# Goals

### Daily

* daily reminders
* check calendar
* share standup
* etc

### Weekly

* review Asana
* review Jira
* weekly reflection
* etc

### Monthly

* branch cleanup
* AWS usage monitoring
* etc

# Weekly Monday template
see template below, but a template to fill out each Monday

# Current

* current high level
* team goals

# Symbol Key
see template below, a key for notes

# Standup

### Monday Oct 11th

### Tuesday Oct 12th

### Wednesday Oct 13th

### Thursday Oct 14th

### Friday Oct 15th

# History
All the previous weeks standups get moved here. Then I start a clean standup.md file each year archiving the previous one. 
```

### Goals Section

This section lets me keep a short list of daily, weekly, monthly todos / goals. It is a little reminder for general pace, focus, and schedule. Often things that are recurring end up with a calendar reminder as well, but this is a quick place to check to make sure I am staying on top of things.

### Weekly Monday Template

At the start of each week I share a bit of a week's summary with the team. It is a great way to make sure people are on the same page and remind of anything out of the ordinary like Holidays in one of the countries we operate in. I fill this out each Monday and share it in our `#software-team` slack channel.

It is also a nice place to call out birthdays, kudos for something well done, link to a recent post mortem or anything else that might be worth bringing a little extra attention.


```Markdown
### Weekly Monday Template

Notes for Software Team about the coming week
* Dev first-responder: <name>
* PM Release Coordinator: <name>
* Out of office / Holidays / Vacation
   * TZ, US, Russia
   * Dev vacay's etc...
* Updates:
   * info about a big release or test planned for the week
   * dates and times for brownbags, etc
* Articles:
   * some good links
   * from recent articles
```

### Current Section

The current section lets me add some higher level goals and keep them just above my weekly standup notes, so I keep them in mind. This helps me make sure my day to day work is working and building towards some of the the larger themes and that daily tasks don't always push out larger goals.

```Markdown
### Current

* Follow up on Allware teams gathering
* Reschedule web and android quarterly walkthroughs
* Update system architecture diagrams
* Improve ETL pipeline process
```

### Symbol Key

I like to be able to check things off my list so to speak, these symbols I try to apply to my daily standup todos so I can see the status. Often if something doesn't get a checkmark, it gets copied into the next day so I can continue to make progress against it.

```
### Symbol Key

✓ : done  
☯ : progress  
♺ : continuation from previous day  
⚠ : notice, missed, didn't get to it, problems
```

### Daily Standup Section

This is the workhorse of the system. Where I put in what I plan to do for a day, but also adjust it to what I am actually doing during the day. At the start of the week I write down a few of the things I know for the full week. As the week progresses there is more and more detail and often my days get fully booked up with work scheduled to be done.


```Markdown
# Standup

### Monday Oct 11th

* meetings: Stakeholders, PM Weekly, Squad IPM, Squad Retro, 1:1/Name
* post weekly software template
* tickets
   * links to Asana tickets
   * links to Jira tickets
* permissions fix (this is likely something that came up mid-day)
* resolve Solr issues (this is likely something that came up mid-day)
* research X
* documentation for Y (link to doc)  

### Tuesday Oct 12th

* meetings: Call Center, Another Squad IPM, New Country Launch, Data Team Standup
* tickets
   * links to Asana tickets
   * links to Jira tickets
* recruiting followups
* schedule interviews
* review large PR (this is likely something that came up mid-day)

### Wednesday Oct 13th

* etc
* ...
```

### Final Thoughts

The markdown system is fast and flexible. When ever I need a new section or to quickly organize thoughts around a project, I just create a header and start writing, when the section is no longer useful in the day to day I pull it out. Sometimes you have a full day planned out and something blows up and the entire standup gets updated, that is OK it is quick and easy to roll today's tasks into tomorrow section. The ability to very quickly see an overview and modify it is really where this wins. I can't move 6 tickets in Asana and Jira from one day to another without about 20 clicks, but I can do that in seconds in my Markdown file. 

Obviously, this will need to be adjusted to your needs. It has worked very well for me with few changes over the last few years. Previously, I even kept the whole file in a organization public git repo so anyone at the company could see what I was up to. The scratch file actually became useful to several folks and I got PRs updating sections, which had become little references for folks. I believe the `git tips / cool git one-liners` sections was one that had some milage. Also, the list of links I had built up to all sorts of resources became useful to others over time. I currently keep this all in a private repo, in part as I do more management, my notes often include thoughts and feelings of the team that I keeping in mind. So to keep my system as useful as possible to me, I don't share it out so I don't have to worry about what notes I take. 

If you have any suggestions or other organizational tips feel free to share. I hope this will be helpful to a few other folks as it has been to me over the years.
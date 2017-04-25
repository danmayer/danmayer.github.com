# Distributed Team Tips

A awhile ago a developer friend [@Qrush](https://twitter.com/qrush) asked folks for thoughts on how distributed teams should work on twitter. He asked specific questions, I responded and thought it might be helpful to share the slightly cleaned up answers with others.

## How Distributed?

A quick note to make the tips a bit more relevant. Our company is highly distributed across timezones, cultures, and languages. This means some things that work for people just dealing with East Coast and West Coast, don't work so well when handling from Denver to Tanzania. Obviously, keep it simple and if you don't need as many processes around managing timezones, don't worry about it.

## What’s one unique thing you feel your team does differently than other orgs to work better with everyone across different timezones/asynchronously?

At [Offgrid Electric](http://offgrid-electric.com/) we have done a couple things, I don't think there is any one magic bullet but it is a combination of efforts that helps to make a highly distributed team work.

* __Time Zone Management Guidelines__: I wish I could take credit for this, but it was started and created above my pay grade. The company had group discussions, surveys, and maintains a shared doc. The doc covers tips and examples to help folks with time zone etiquette and best practices.
	* It also manages a company calendar showing the 'recommended' hours for cross time zone meetings.
* __Maker Day Wednesday (No Meeting Wednesday)__: This is on the company calendar for all the groups that are software stakeholders (operations, finance, PM, etc).
	* This is frequently people's favorite day of the week and often when they get the most done.
* __Encourage Async Communications__
     * conversations should be in tickets (Asana/Jira), documents (lots of google docs attached to tickets with comments, screen shots, etc), or github (PRs)
     * slack is for more real time questions, not to record decisions, prioritize work, or cover details.
* Meetings 
     * Have a document outlining some meeting best practices the company encourages. 
     * Our company doc pushes "core meeting hours". Tuesday and Thursday have core hours that work for nearly all timezones, the bulk of meetings should be scheduled during these hours.
     * Record meetings, don't expect everyone in every time zone will always be able to make meetings that are on weird hours, record the video and let them watch async
     * Add most people to calendar invites as optional unless they have an active role to play, otherwise they can catch up via the recording Async. This let's people know the priority of making a meeting that might be at a difficult time.
     * In general the company outlines the types of meetings and suggests sending materials for meetings 24 hrs in advance. This is less for team standups and more for sharing with exec or wider audiences.
     * I also have a __quarterly reminder__ to go over all my meetings particularly recurring ones... Cut, reduce, shorten, whatever you can.
* __Respect Cultures Holidays__: We have all the countries holidays on our calendars, don't schedule meetings important to someone during one of their countries holidays.
* __Shared Team Calendar__: The team should add anything on it that would impact their ability to work during normal hours...
	* It is really helpful to just know someone is out for an afternoon, if you had planned to sync up with them and miss because of timezones when they are out that is frustrating and can delay decisions by 24hours or more.
* __In Person Time Matters__: Try to get together small groups a couple times a year and everyone at least once a year.
	* Remember when budgets get tight the first thing cut is travel. If you are highly distributed this is going to hurt more than you think. Protect it if you can, explain the importance to execs and anyone pushing back on budgets.
	* I know some folks that build travel cost into salary hidden away in the budget so it can't really be taken away later.
* __Documentation__: Maintain lots of documentation...
	* Software Team Docs: We try to keep FAQs, expensing policies, travel policies, etc in Git... Want to change things, send a PR.
	* Cross Org Docs: Our team shares lots of documentation with other groups, these docs we keep in google docs. This is more accessible and easier to work with other groups.
	* Templates: Have a useful format for something? Make a template, then copy, rinse, and repeat.
	* Organize, Prune, Archive, Comment, Share, and do whatever to try to keep things up to date and useful.
* __Microhubs__: Try to get 2 people in cities were you hire... While we are all over we tend to have little clusters of a handful of people. It makes it nice to send that group out to dinner for the holidays, just have something in person.
* __Default Time Zone__: Pick the __COMPANY__ timezone. At our company all hours are given in EAT (East African Time), folks know to adjust from where they are to that time when there are any announcements.
	* Google Labs has an awesome calendar feature to have 2 timezones display on your calendar at all times.
	* We store all dates in UTC as most devs, but most of our tools (New Relic, Sumologic, etc) display data in EAT.  
* __Distributed Bonding__: It is hard but do what you can to let distributed folks just get to know each other and stay engaged.
	* We do lots of brownbags, some more serious, some just kind of fun and interesting... Keep it light but encourages time to get folks chatting.
	* Slack / Team Jokes, I am sure folks love GIFs if they are distributed.
	* Emoji :)

## Whats your main method of communication? Chat/email/something else? If you could change anything about how that works to help remote folks: what would it be?

Slack, it is our primary comms, and it is a bit noisy... I would encourage people to turn it off a bit more often for focus work. 

Make sure there is a agreed on video conferencing software for the company, that it is known to work well in the locations you operate. We have found that Zoom works very well for us and works even with low bandwidth connections.
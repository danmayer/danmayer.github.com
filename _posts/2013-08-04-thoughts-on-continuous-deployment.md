---
layout: posttail
authors: ["Dan Mayer"]
title: "Thoughts on Continuous Deployment"
category: Programming
tags: [Programming, Development, Deployment, Practices]
---
{% include JB/setup %}

## Manual Continuous Deployment vs. Automated Continuous Deployment

Recently there has been discussion around continuous deployment where I work. I have always liked the practice. I strongly believe in quick and small changes to production apps leading to the most value for the users and being the safest way to quickly iterate towards a larger goal. However our primary project has always practiced a looser version of continuous deployment, a manual continuous deployment. The manual but continual deploy process suites the current state of our project, while still giving us many of the advantages. I believe there are some times when following strictly automated continuous deployment should be considered dangerous, and I thought it would make sense to explain my concerns a bit.

First let me describe two different continuous deployment processes

__Manual Continuous Deployment:__

* Manually trigger by developers, not automated by CI servers
* Commiter / Deployer, follows a checklist of basic deploy guidelines
* In general any significant change is deployed nearly immediately after merging to masters, sometimes this means commits go out in clusters or groups 

__Automated Continuous Deployment:__

* Automated by CI server, deploys after non failing test suite run
* Each commit is tested individually and deployed individually

At first look every developer is probably thinking clearly automated deploy is the way to go. We should remove repetitive processes from the developer flow! Trusting developers with check lists is error prone, it is hard to coordinate deploys. I would agree that in the ideal project with a perfect infrastructure, that is the correct choice. The reality is most large projects have some baggage and state of the project means it might not be the best or a realistic choice for every project.

## Issues associated with automated continuous deployment

There are many nice befits of having a fully automated continuous deployment system. I'm skipping over arguments about never automating deploys and moving forward with the assumption, that for most web applications which don't require high levels of human testing, have large security implications, or have lives at stake that it should be a goal. Even with the  goal of automated continuous deployment, there are still some primary problems that can make a project not yet ready for automated continuous deployment. Below is a list that I would consider requirements for automating deployment.

* Deploys have no negative impact on system and end users
* Fast tests
* Fast deploys
* A developer, usually the code author should be present during deploy
* Easy safe override of continuous deployment
* Clear dashboard around the deploy queue, continuous deployment status, manual deployment interruptions
* Strong application monitoring and alerting

### Deploys have no negative impact

There are still projects out there that have brief downtime during deploys. Others just have negative performance issues for users. Projects might experience a brief blip of exceptions or temporary slow down related to breaking many large caches. All of these impact how often you want to deploy. Until you can safely deploy without having any negative impact you still likely want to have a developer batch up deploys that make sense. Developers should still want to deploy the smallest change possible to effect any of the server and business metrics, but likely don't need to deploy every test, copy, and minor tweak as it is merged into master. Regardless of automated continuous deploys or not, solving this limitation is highly recommended.


### Fast Tests and Fast Deploys

Fast tests and Fast deploys are fairly similar. Both impact the total throughput of commits and deploys possible during a day for automated deploys. If you have a 50 minute test suite and a 10 minute deploy, it effectively will take 1 hour for a commit to hit production. For automated continuous deployment you really want to deploy each commit that passes CI individually. One of the large gains from a system like this is that each commit goes out one at a time so that monitoring and issues can be traced back to the initial deploy that caused a change.

Let's pretend developers all work in one time zone and only work a 8 hour day (Ha). That would impose a limit that only be 8 individual commits to the project a day, or the team ends up facing a backlog queue of deployments (some of which occur outside of normal working hours). That is a a bad idea, and if this is something a project enforces, quickly developers will 'hack' around the rule to do bad things like bundling many unrelated changes per commit just to get it through the deploy queue.

Both Fast Tests and Fast Deploys are very importantly related to the next important issue…

### A developer should be present for deploy

Automated tests don't catch everything. Even if there are no exceptions you might have performance regressions, unexpected behavior, or other issues. Deploying when no one is around and isn't aware their feature just went live is a bad idea. Preferably the code author and code reviewer, should be present and monitoring systems they expect to be impacted.  Occasionally only one of the two, really needs to be there depending on the magnitude of the change.

If you have slow tests or a slow deploy, quickly you will see a problem where 40+ commits are merged on a single day, because you have a big team that knows small safe changes is a best practice. Many of the commits will related to improving tests, developer only tools, minor copy changes, and other simple 'safe' changes. These changes are treated the same by a completely automated system and when mixed with larger features, developers end up checking in code and having it deploy a undetermined time later.

Our deployment checklist notes developers should be around after a deployment of their code for around 20 minutes in case any issues arise. In a automated world, with long times between commits and deployment this becomes a very tricky issue. This issue alone is the biggest blocker of moving to automated deployments. Until your tests and deployments are super fast, allowing humans to filter what to deploy when adds tremendous value.

### Manual overrides, and dashboards

When a project is running automated continuous deploys, at some point unexpected exceptions will start to occur. Exceptions either from a data change, external api issue, or simple a bad commit automatically deployed. At this point developers should have the ability to react quickly if deemed necessary. 

This means possibly doing a rollback deploy of the last commit, or quickly making a change and committing that into the project. Either a rollback or manual commit should be able to be deployed by a developer. It should automatically freeze future continuous deployments. It should make that clear on the applications deployment dashboard. The dashboard should make clear 'automated deploys disabled because of deploy rollback of commit SHA', or 'automated deploys disabled manual override deploy by user X with commit SHA'.

A single one button click on the dashboard should reenable automated continuous deployment, but it should be a smart re-enable, either asking the user which she to begin deploying again with, or immediately moving to HEAD on master and skipping any previous commits queued up. Obviously if someone manual deploys a fix you don't want to go back and deploy commits prior to it, or redeploy the same commit that user deployed themselves.

Related if there are special tests going on the dashboard should allow one click disabling of continues deploy which could be temporarily necessary while debugging or isolating a single system. These dashboards should also make it clear the expected deploy time for commits currently pushed to the project. Even if there is a fast test / deploy cycle. Developers might not want to push 2 or 3 commits at the end of the work day if there are already 10 commits queued up.

### Strong application monitoring and alerting

Really for production applications having good monitoring and alerting in place is important. I think because of the ability for a deploy queue to get backed up and occasionally trigger outside of a developers expectations, that monitoring becomes even more of a importance. Not just on simple things like response time, exception rate, but deeper business metrics like successful logins, purchases, and other important metrics. You will want to clearly see which deploy accidentally effected a metric and trigger alerts as a developer might not be able to as closely watch each individual commit being deployed. 

## Choosing which is right for your team and project

After considering some of the real world implications of automated continuous deployment. I didn't feel it was right for our team on most of our projects at the moment. Both because we would need a bit of additional tooling around deployment and dashboards, and because our tests are far to slow. For each project the team should be able to discuss and work towards automating continuous deployment, removing any problems that might be a blocker. Removing any of the blockers will be a big win for improving the development process on the project.

Some projects accepting certain deployment shortcomings might be acceptable. For instance manual overrides, freezes and intelligent restarting of automated deploys isn't much of an issue for a project with a 20 second test suite. Which will generally finish faster than one could realistically debug any production issue. I'm personally hoping we can successfully move more of our projects towards fully automated systems, but I think it is important to know how it impacts a project and balance the value of the automated system vs the risks for a given project. I hope we can eventually have all our project's to a place where automated continuous deployment makes sense.

## Additional Reading

[Etsy](http://www.etsy.com/) has some great processes around deployments. I recommend checking out a couple of their posts / slides.

* [Continuous deployment, a tale of two approaches](http://www.slideshare.net/beamrider9/continuous-deployment-at-etsy-a-tale-of-two-approaches)
* [Quantum of Deployment](http://codeascraft.com/2010/05/20/quantum-of-deployment/)
* [How Etsy manage's development and operations](http://codeascraft.com/2011/02/04/how-does-etsy-manage-development-and-operations/)

Non Etsy articles further discussing continuous deployment.

* [Startup lessons learned, continuous deployment](http://www.startuplessonslearned.com/2009/12/continuous-deployment-for-mission.html)
* [Another look at continuous deployment](http://java.dzone.com/articles/another-look-continuous)
* [Continuous Delivery: the value proposition](http://www.informit.com/articles/article.aspx?p=1641923)


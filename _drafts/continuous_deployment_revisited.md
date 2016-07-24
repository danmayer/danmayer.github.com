# Team Deployment Processes

The ideal web software deployment process lets you quickly deploy features as they are ready and tested. I previously wrote about [continuous-deployment](http://www.mayerdan.com/programming/2013/08/04/thoughts-on-continuous-deployment/) previously, and most of those thoughts remain. I do think that continuous deployment can have some other challenges beyond automated testing that make it a challenge.

1. Manual QA
2. Stakeholder feedback
3. Long running branches (either large groups of features or 3rd party integrations)

In each of the cases above. There is a time where you want a deployment, which is deployed and available to some set of users (beyond the developers machine). This really gets beyond the basic continuous deployment of a single branch (master) to production.

# Staging Servers

The first thing people often do for QA/Stakeholders is setup a staging server. When a feature is done, you can merge it to staging and deploy for feedback. This works fine for a small number of features and developers. It runs into issues as you scale the team. 

* Staging has a mix of features that are in various stages of QA or getting feedback from stakeholders.
* The code changes start to pile on top of each other, and can't be cleanly applied to master
* the entangled features and the fixes now can't be released until all that has been merged into the staging branch are stakeholder & QA approved.
* Long running branches that won't be ready for weeks really can't be merged in at all
* When QA is working on testing one feature they are often running into bugs for another feature complicating testing and debugging.
* Training? We have a lot of internal tools that can't be released until users are informed and trained on the new system. This can block features for weeks.

At this point sometimes folks setup multiple staging servers or use tools like [xip.io/](http://xip.io/) to share developers boxes. These solutions are really bandaids for what you want. In the end you want to be able to take any branch and dynamically standup a deployed environment.

# Feature Branch Staging

With the cloud and all various tools, it isn't that much harder to go from Continuous Deployment to dynamic branch based staging servers. We do this with Docker and AWS tools, but there are many ways to automate configuring an entire deploy, I will cover some of the challenges a bit later.

### What does it look like?

A developers starts a feature branch from `master`. They work on the feature say `feature/new_cool_page`, and check it in to git. CI is already running the tests on each commit. At some point the developer(s) is ready to share and get external feedback from stakeholders, PM team, or QA. They can run some command `create_branch_staging`. This will stand up a new server deployment with their branch and return a URL based on the branch name `new_cool_page.staging-domian.com`. From then on future git pushes can deploy to the feature branch if CI sees one exists, or you can continue to deploy to the feature staging server manually.

At this point there can be a lot of feedback and discussion among the team. Often PRs with comments from devs can link to issues on the feature staging server. When everything is finally ready to go, you merge the branch to `master` and deploy to production. Destroy the feature staging environment and move on. We still manage a "shared" staging server as well for any features that might need to sit and bake with some usage for awhile (think major library updates, or infrastructure changes), alternatively in that case the feature branch is just collapse to our old `staging`.

The flow given by being able to stand up multiple environments dynamically, solves for most of the issues with a shared staging server. It additionally has other nice benefits.

* forcing function to fully automate your infrastructure
* basically requires devops
* easy to test infrastructure changes separately from code changes (ha-proxy, nginx config, different memory CPU and instances, etc)
* depending on how you solve some of the data replication challenges (mentioned shortly), it is built in testing for backup and restore
* Discover bottlenecks in your infrastructure earlier prior to production
* Helps force environment simplification

# Challenges

While this sounds great, it does bring up some additional challenges from just having traditional CI deployments to a staging environment. It isn't quite as simple as it was deploy to a server that was often setup manually. Think about all the dependancies that go into running your app and how they relate to one another, such as how you seed your staging environment data. Here are some of the challenges we faced.

* __Seed Data:__ our staging uses and old snapshot of production with additional QA data layered on top
  * __our solution:__ daily snapshots of staging. Each feature branch starts with the most recent RDS (AWS Postgres) snapshot to dynamically create a new DB. Then any migrations since the snapshot are applied on top. (We can easily pull of production snapshots as well if we need to debug something with user data)
* __Multiple Data Sources:__ We have Postgres, Redis, and Solr and each need data seeded per environment
  * __our solution:__ each data store has it's own requirements.
     *  Postgres: RDS snapshots as mentioned above for Postgres 
     *  Solr: we trigger a snapshot of staging Solr, and script creating a new Solr namespace from the snapshot for each server.
     *  Redis: We treat as a rebuildable store, it can start empty for any given instance. We spin up a new Redis for each server, but you could leverage Redis namespaces for this.
* __Multiple Services:__ Where do things point by default to related staging dependancies, make sure it is configurable ;) Also, goes for multiple executables webserver, background jobs, cron server 
  * __our solution:__ By default all feature-stagings point to our other staging services. Where they point is controlled by environment variables ([12 factor app](http://12factor.net/)) for any staging deployment you can alter the ENV to point to a specifically deployed alternative.
* __Additional Cost__: You still want to be careful about the number of staging, but also how you decide to share resources.
  * __our solution:__ We approach this a number of ways
      * shared resources: you can deploy feature-staging-lite (code only but uses `shared-staging` data sources. This is great for UI only changes and requires far less resources. 
      * shared servers: Beyond just sharing actual data sources. We sometimes spin up full new servers like a new RDS, but for Solr, we just utilize namespaces. Allowing a single Solr server to host __ALL__ the feature branches search indexes.
      * reduced hardware: While we run `shared-staging` very close to production. We run far less web-workers, with less CPU and memory for most of our dev stacks. We can adjust if needed. 
      * __Staging Sweeper__: Cleaning up after staging environments, you don't want an infinitely growing list of servers and databased sitting around. We monitor staging servers and they self-destroy after 3 days of inactivity.
* __Additional Monitoring:__ you will need to monitor some of your staging tools... Pretty important that things like staging sweeper keep running.
* __Exception Overload:__ Managing multiple exception streams, can be confusing. 
   * __our solution:__ We keep exceptions in very clear `production`, `shared-staging`, `feature-staging` streams at the very least, often including `BRANCH_NAME` for any metrics / alerts
* __Scaling Staging:__ At first people might be cautious using feature staging, but it becomes so useful next thing you realize you could be maxing out your staging infrastructure.
   * __our solution:__ We had to build in auto-scaling up and down based on the demand for the number of branch-staging servers. If someone deploys and there aren't enough servers in the cluster it adds more... It will shrink back down to size as staging servers are destroyed.
* __Custom Tooling:__  When you have a single staging folks just connect to it and do what they need. Now it can be hard to find where your service is running and what is going on.
   * __our solution:__ where you can avoid tooling, using things like log aggregation. You don't need to connect to staging to view logs. If you need a console we have a script `docker:console` which will create a docker task and connect it to your environment and SSH you over.  

# Our Approach

We worked with the very talented [Trek10](https://www.trek10.com/), to develop our production and staging infrastructure. We leveraged a number of technologies and solutions, some open source, some standard AWS tooling, and some customer scripts or services we wrote.

The basic tech stack:

* __CloudFormation:__ This lets us manage all the related resources and services together as one.
  *  __ECS__: Easy way to have multiple services and tasks in our environment. 
     *  __Docker__: This makes it easy to package up our app and dependancies... Easy to CI as well as scale out as multiple services and tasks.
  *  __RDS__: We can create copies from snapshots of any given database for other branches
  *  __Elastic-Cache:__ Similar to RDS the tools around using Redis from elastic cache makes it super easy to manage
  *  __AWS-lambda:__ If we need to do anything fancy (say scale our production DB size to something more cost effective for staging). We can script that in AWS lambda and CloudFormation will trigger our events and wait for their results. Anything CloudFormation can't handle out of the box, we can handle this way.
  *  __Route-53:__ You will need easy to integrate dynamic DNS to go this route. We are always adding and tearing down DNS names.
  *  __ELB:__ Less required for feature staging but a piece we use for production high availability.
  *  __Ruby:__ We have some simple Ruby glue scripts we kick off to interact with all of this stuff ;)

As for the detailed specifics, we will save that for another post.  Hopefully something our partners [Trek10]() will cover in much more detail soon. 
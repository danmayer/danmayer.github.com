# Continuous Deployment for Feature Branches 

The ideal web software deployment process lets you quickly deploy features as they are ready and tested. I previously wrote about [continuous-deployment](http://www.mayerdan.com/programming/2013/08/04/thoughts-on-continuous-deployment/) previously, and most of those thoughts remain. I do think that continuous deployment can have some other issues beyond automated testing that make it a challenge, in this post I want to focus more on the human feedback loop opposed to the automated one.

1. Human QA
2. Stakeholder feedback
3. Long running branches (large groups of related features, 3rd party integrations, etc)

We had each of the above cases, at [Offgrid-Electric](http://offgrid-electric.com/). All the cases point towards a staging environment. In normal feature development flow is a time where you want share your work, which should be deployed and available to some set of users. Let's explore how a single staging doesn't solve everything.

# Staging Servers

The first thing people often do for QA and stakeholders is setup a staging server. When a feature is complete, you can merge it to staging and deploy for feedback. While this flow works fine for a small number of features and developers, it runs into issues as you scale the team. 

* Staging has a mix of features that are in various points of QA or getting feedback from stakeholders.
* The code changes start to pile on top of each other, and can't be cleanly applied to `master`
* Entangled features and iterations of fixes now can't be released until all that has been merged into the staging branch are stakeholder & QA approved.
* Long running branches that won't be ready for weeks, can't be merged in at all, where do you get feedback for those?
* When QA is working on testing one feature they are often running into bugs for another feature complicating testing and debugging.
* Training? We have a lot of internal tools that can't be released until users are informed and trained on the new system. The feedback loop on training, can block features for weeks.

At this point sometimes folks setup multiple staging servers or use tools like [xip.io/](http://xip.io/) to share developers boxes. These solutions are bandaids for and only solve small pieces of the problem. In the end, you want to be able to take any branch and dynamically create a deployed environment and keep it around as needed. This gets beyond the simple continuous deployment of `dev` branch to the staging server and `master` to production. How do you scale continuous deployment?

# Feature Branch Staging

With the cloud and related tools, it isn't much harder to go from continuous deployment of staging and production to dynamic branch based staging servers. We do this with Docker and AWS tools, but there are many ways to automate configuring an entire environment and deployment. I will cover some of the challenges a bit later, as there are a number of "gotchas". 

### What does it look like?

A developer starts a feature branch from `master`. They work on the feature say `feature/new_cool_page`, and check it into git. The team CI (Continuous Integration) server is already running the tests on each commit. At some point, the developers are ready to share and get external feedback from stakeholders, PM team, and QA. The developers can run some command `create_branch_staging`. Which will stand up a new server deployment using their branch and return a URL based on the branch name `new_cool_page.staging-domian.com`. From then on future git pushes can deploy to the feature branch if CI finds a matching staging environment, or you can continue to deploy to the feature staging server manually.

Once you have a feature on a viewable staging branch, there can be a lot of feedback and discussion among the team. Often PRs with comments from devs will link to issues on the feature staging server. When everything is finally ready to go, you merge the branch to `master` and deploy to production. Destroy the feature staging environment `destroy_branch_staging` and celebrate another victory!

We still manage a "shared" staging server as well, this is for any features that might need to sit and "bake" with additional usage for awhile (think major library updates or infrastructure changes), alternatively in that case the feature branch is just collapsed to our old `dev` branch and deployed to staging.

The process enabled by being able to create multiple environments dynamically solves most of the issues with a shared staging server. It significantly increased our velocity. Increased the confidence of our smaller deploys, and made it simpler to prototype and throw away ideas. Beyond the developer process. It additionally has other nice benefits.

* Forcing function to fully automate your infrastructure (encouraging DevOps), basically [immutable infrastructure](https://blog.codeship.com/immutable-infrastructure/).
* Easy to test infrastructure changes independantly from code changes (ha-proxy, Nginx config, different memory CPU and instances, etc.)
* Depending on how you solve some of the data replication challenges (mentioned shortly), it is built in testing for backup and restore
* Discover bottlenecks in your infrastructure earlier before production
* Helps force environment simplification and understanding.

# Challenges

While this sounds great, it does bring up some additional challenges from having a more traditional CI deployments to staging and production environments. It isn't quite as simple as the prior case of deploying to single environment that was often configured by hand and had it's data smoothed over the ages. Think about all the dependencies that go into running your app and how they relate to one another, such as how you seed your staging environment data. Here are some of the challenges we faced.

* __Seed Data:__ our staging uses and old snapshot of production with additional QA data layered on top
  * __our solution:__ daily snapshots of staging. Each feature branch starts with the most recent RDS (AWS Postgres) snapshot to dynamically create a new DB. Then any migrations since the snapshot are applied on top. (We can easily pull our production snapshots as well if we need to debug production data issues)
* __Multiple Data Sources:__ Our app requires Postgres, Redis, and Solr and each needs data seeded per environment
  * __our solution:__ each data store has its individual requirements.
     * __Postgres__: RDS snapshots as mentioned above 
     * __Solr__: we trigger a snapshot of staging Solr, and script creating a new Solr namespace from the snapshot for each server.
     * __Redis__: we treat Redis as a rebuildable store, it can start empty for any given instance. We spin up a new Redis for each server, but you could leverage namespaces for this.
* __Multiple Services:__ Where do you point to your other services? By  make sure it is configurable
  * __our solution:__ By default, all feature-stagings point to our other staging services. Where they point is controlled by environment variables ([12-factor app](http://12factor.net/)) for any staging deployment you can alter the ENV to point to a specifically deployed alternative.
* __Additional Cost__: You still want to be careful about the number of staging, but also how you decide to share resources.
  * __our solution:__ We approach this a few ways
      * __shared resources__: you can deploy feature-staging-lite (webapp only deploy (no data sources, crons, or background workers). Instead it uses `shared-staging` data sources. This is ideal for UI only changes and requires far fewer resources. 
      * __shared servers__: Beyond just sharing actual data sources. We sometimes spin up full new servers like RDS, but for Solr, we just utilize namespaces. Allowing a single Solr server to host __ALL__ the feature branches search indexes.
      * __reduced hardware__: While we run `shared-staging` very close to production. We run far fewer web-workers, with less CPU and memory for most of our dev stacks. We can adjust if needed. Along with Docker we run multiple deployments on the same servers.
      * __staging sweeper__: Cleaning up after staging environments, you don't want an infinitely growing list of servers and databases sitting around. We monitor staging servers and they self-destroy after 3 days of inactivity.
* __Additional Monitoring:__ you will need to monitor some of your staging tools. For example, it's important that things like staging sweeper keep running.
   * __our solution:__ Most of our monitoring and metrics are build with server environment names in mind.  
* __Exception Overload:__ Managing multiple exception streams, can be confusing. 
   * __our solution:__ We keep exceptions in very clear `production`, `shared-staging`, `feature-staging` streams at the very least, often including `BRANCH_NAME` for any metrics / alerts
* __Scaling Staging:__ At first people might be cautious using feature staging, but it becomes so useful next thing you realize you could be maxing out your staging infrastructure.
   * __our solution:__ We had to build in auto-scaling up and down based on the demand for the number of branch-staging servers. If someone deploys and there aren't enough servers in the cluster, it adds more. It will shrink back down to size as staging servers are destroyed.
* __Custom Tooling:__  When you have a single staging server, folks just connect to it and do what they need. Now it can be hard to find where your service is running and what is going on.
   * __our solution:__ where you can avoid tooling, using things like log aggregation. You don't need to connect to staging to view logs. If you need a console we have a script `docker:console` which will create a docker task and connect it to your environment and SSH you over. Also, keep it simple we rely on a lot of battle tested AWS tooling.

# Our Approach

We worked with the very talented [Trek10](https://www.trek10.com/), to develop our production and staging infrastructure as well as our deployment process. We leveraged a few technologies, some open source, some standard AWS tooling, and some custom scripts or services we or Trek10 developed.

The basic tech stack:

* __CloudFormation:__ This lets us manage all the related resources and services together as one.
  *  __ECS__: Easy way to have multiple services and tasks in our environment. 
     *  __Docker__: This makes it easy to package up our app and dependencies... Easy to CI as well as scale out as multiple services and tasks.
  *  __RDS__: We can create copies from snapshots of any given database for other branches
  *  __Elastic-Cache:__ Similar to RDS the tools around using Redis from elastic cache makes it super easy to manage
  *  __AWS-lambda:__ If we need to do anything fancy (say scale our production DB size to something more cost effective for staging). We can script that in AWS Lambda and CloudFormation will trigger our events and wait for their results. Anything CloudFormation can't handle out of the box, we can handle this way.
  *  __Route-53:__ You will need easy to integrate dynamic DNS to go this route. We are always adding and tearing down DNS names.
  *  __ELB:__ Less required for feature staging but a piece we use for production high availability.
  *  __Ruby:__ We have some simple Ruby glue scripts we kick off to interact with all of this stuff ;)

As for the detailed specifics, we will save that for another post.  Hopefully, something our partners [Trek10](https://www.trek10.com/) will cover in much more detail soon.

### The Perfect Staging

In a perfect world, you would never have to think about this stuff and environments would just appear when and how you need them. With no concern for the cost and complexity of getting there. That isn't the case but depending on your project and how early you start to automate away manual tasks, it is easier than ever to get pretty close to the ideal. You need to look at your project to see if it makes sense, how often are you having a real issue with features getting in each other's way, does your organization have significant stakeholder feedback or Human QA against features? If you haven't shipped anything and aren't worried about zero downtime deployment, again not worth your time. I think the cost of getting this kind of staging and development process was too high a few years ago, but it can be built out for many projects in a cost effective manner with enormous benefits. Is it the holy grail, no, but it is something I would have a hard time living without anymore.

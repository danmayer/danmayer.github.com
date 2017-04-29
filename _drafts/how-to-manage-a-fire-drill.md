# How to Manage a Fire Drill

![image](/assets/img/Medical-Vehicle.png)
> credit: [maxpixel](http://maxpixel.freegreatpicture.com/Emergency-Ambulance-Fire-Drill-Medical-Emergency-1057706)

At some point a fire drill will happen, people will scramble and rush. When you are small really that is all that can or needs to happen. As organizations grow. Being able to plan, organize, manage, and learn from fire drills is increasingly important.

In the past I learned a lot from [Aaron B](https://twitter.com/abatalion) managing fire drills when we were a small team of less than 10 engineers. Getting all the devs together and quickly discussing and pushing out solutions. Often then I was just watching and occasionally throwing in a thought. Later quickly implementing something to get a quick visual review before deploying out a solution. As the organization grew more often Patrick J taught me a lot about managing a larger and increasingly remote team during fire drills, at this time I was often intimately involved often taking a roll in a piece of the solution. Since then I have managed some fire drills on my own but often the largest and most complex I have helped develop solutions or manage solutions under Doug R and Muness. In my time at LivingSocial I have learned a lot about how to handle fire drills and we have improved the process as we have grown. I think it is something hard to learn and often overlooked in the startup / software blogging world. So I wanted to to cover some things I have learned along the way.

### Steps

We didn't have or need all of these processes from the beginning, but as we have grown and problems have grown in complexity I think this ideal we have ended up with at the moment.

* Stay calm, don't play the blame game. Shit happens, you can get into what went wrong in the postmortem. Often it is much depend than the simple X person forgot Y thing… Remember the whole 5 whys, also remember these are your colleges you should like them and will work with them for a long time so keep it pleasant. No one needs extra drama when something is going wrong
* Start a time line. We often use a google doc that multiple people can edit. It doesn't really matter what you used, but you want to track when things happened who is one what… and what you learn. If you learn something that is wrong that is fine the timeline can correct a earlier statement… resist the urge to delete earlier mistakes in the timeline. It is recording the resolution process.
* Establish communication channels.
   * We have a primary campfire room where all major issues normally would start.
   * If it is a larger issue often a campfire room for the emergency might start up, other secondary rooms might focus on subtasks
   * If there is a lot of cross team, remote collaboration, or very quickly changing situations establish a real time communications channel. For this we prefer a google hangout which is running in the background. If part of the group is busily talking about only a specific issue they can mute themselves but leave the line open for others to interrupt with updates and questions.
   * For those in the same location move away from the crowds and take over a conference room or 'war room' for rapid collaboration

* If this is obviously becoming a long running emergency that will last well past normal hours. Make a plan:
    * If someone is critical to the solution make sure they can be available. If they really really can't be like getting on a plan figure something out or ways to check in with them. Perhaps they are away from a computer but could answer questions on the phone in a emergency.
    * Get a plan that a group agrees to and set up shifts. If the team needs to work round the clock to fix something, you need someone fresh at various points. Figure out natural break points and get some people to bed early, to wake later. Plan for a good amount of hand off time. If their is really a few people that aren't going to sleep you still want fresh eyes to pair with them and help catch silly mistakes that happen when you are loosing sleep.
    * Try to always plan on little groups. Don't leave anyone alone for the long overnight shifts a partner will always be helpful. Even if they don't know the systems as well.
    
* Redundancy. Seriously, if something liked his happened often there are multiple ways to solve the issue. Everyone really hopes the right way to solve it works, but if it is going to take a long time get a team on plan B and possibly plan C while you work on the primary solution.

* split and conquer, If something went terribly wrong and no one knows why? Perhaps after a few minutes realizing the what happened question is going to be hard to answer split up. Get one team working to fix the issue, and another breaking down why that issue occurred in the first place. Note that you still want to know enough about why something happened before blindly fixing it in a way it will just happened immediately again.


* Determine what is the acceptable recovery. Seriously if something catastrophic occurred… It might be awhile until you can fix EVERYTHING. what is the acceptable first recovery step. Make sure others agree. Then back to split and conquer, have someone on the quick fix and someone on the real fix

* Follow up… Really… I mean like follow up more than you think you should
   * An event halted a bunch of peoples normal work flow, do a postmortem. At least share what went wrong and what you learned with your team
   * Something really really went wrong, share what went wrong, how to prevent it and steps to make sure it is less likely to ever occur again.
     * If one follow up takes based on the recommendations of a postmortem aren't followed, it hurts the value of the execs and can demoralize a team
     * Sometimes accept the costs to prevent a specific failure might be to high… It is still good to document but not everything can always be top priority.
     
 * understand the normal processes can and should be interrupted by a exceptional event. Normally a team TDD's, with continuous deployment to write code… Might need to just go with the visual check to get this fixed fast.
 
 * Build a burn down list. If there is a list of multiple things that need to happened to resolve a problem and get back to normal. Create a list with the issues, then who is working on it. what the plan is. If there are backup plans what and who. Then if there is a solution link to the code, data, commit, etc for reference as well as a time. etc
 
 * Testing / verified checklist either on the timeline, turndown list or its own doc. If you think everything is back to normal have dev, project, or product owners sign off that they verified things are back to normal. Often quickly fixing on major issues results in several smaller issues that need to be handled.
 
 * If any normal processes needed to be suspended make sure to let all the teams know what process is out of whack and why. When it is OK to go back to normal let people know that while there might be some remaining issues it is OK to resume normal processes.
 
 * Be nice… Extra nice even, people are stressed, tired, and putting in extra effort. Go team go, not Debbie downer.
 
 
     



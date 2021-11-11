---
layout: posttail
authors: ["Dan Mayer"]
title: "Research, Proof of Concept, Pilot template"
category: Tech Management
tags: [Programming, Development, Management, Process, Planning]
---
{% include JB/setup %}

# Learning Project Template

When we start a small project to learn and answer questions for the organization. It is good if we can be clear about the type of project and the specific learning goals of the project. This template aims to help create a path towards focused learning.

# Project Name

Start with a small paragraph describing the project. List the specific limitations, simplifications, and assumptions in the project. What is roll out / testers / pilot usage if planned, or approach to research if no initial rollout planned. State explicitly if this is a research, proof of concept, or pilot project.

* timeline for research / POC / Pilot
   * timebox: before check-in / extension
* involved contributors

__Research__: This often is documenting, searching, having discussions, proposing plans and alternative approaches. Research may include small code samples that explore or verify if something works as expected or is a viable option. Most often is used to drive the discussion further.

__POC (Proof of concept)__: This would be a step deeper than pure research. It tries to proof out an idea in a way that answers goals of the project under more real-world conditions. POCs aren't necessarily for end users, often just for the developers. POCs, unlike pure research should be trying to work with real world business data/conditions opposed to lab conditions of research only.

__Pilot__: Pilots are often intended for release to a small group of initial users. While pilots are tests of the underlying code and architecture, it is also often testing the business value, UX, performance and usability in real-world conditions. A pilot can be ongoing for a time to allow close contact with a small group of users to iterate towards a solution.

__Current Status Quo__

We are probably doing this project because we have no solution, or the existing solution has known flaws. Let's give a brief statement on the current state, which could be as simple as "does not exist."

__Goals__

A list of defined things we are trying to learn from the project. Below are just some examples that might be relevant to different levels of learning projects.

* Research
  * What questions are we trying to answer?
  * What decisions do we want to be able to discuss or make as a result of this research?
  * Can we identify and reduce the scope of unknowns with this research?
  * Is it faster, cheaper, better to do any of the proposed solutions?
* POC
  * What are we proving out? (or what existing challenge does this solve)
  * What alternatives are we skipping to focus on this POC?
  * What does this replace if there is an existing solution? 
  * Level of effort:
     * Did the POC level of effort match expectations?
     * Cost more / less?
     * expose flaws in our assumptions?
  * Should we continues to pursue this approach?
  * We halted the POC early due to learning X, causing us to abandon the approach. Often this result would still answer many of the questions above.
* Pilot
  * We are working to prove this works for our users? 
  * The new way is better by X% than the existing way.
  * Does this work in a real world scenario?
  * Are there flaws in our assumptions before we fully build this out for all users?
  * Can we support this at scale?
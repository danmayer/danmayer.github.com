---
layout: posttail
authors: ["Dan Mayer"]
title: "Revisiting Front-Ends"
image: /assets/img/max_sla.png
category: Javascript
tags: [Javascript, Front-End, Learnings, Career, Development, Practices, Learning]
---

{% include JB/setup %}

# Revisiting Front-Ends

I have been a 'full-stack' developer for a long time. These days depending on where you work and how your org works being full-stack isn't really viable anymore. Given the growing complexity of both the front-end and back-end end systems, it is more and more required to specialize. That being said, I feel like there are good reasons to understand and think across the front-end boundaries. For example, if you care about user performance how you design backend APIs and deploy front ends can have a massive impact. From fully supporting and leveraging CDNs, pre-fetching, cached API-queries, and more. Anyways, as my front-end skills fell further behind and some exciting changes have been occurring in the front-end world it was a good time to spend a little time refreshing my knowledge and sharpening my tools.

# Where I started

I decided to look at a couple of different projects and ways to explore the space. This hasn't brought me fully up to speed with the amazing front-end folks I work with, but I have learned a lot and enjoyed working in a bit more visual space.

* I worked on a side project modernizing its look and design updating [Semantic-UI](https://semantic-ui.com/)/[Fomantic-UI](https://fomantic-ui.com/) designs.
* I picked up, [Modern Front-End Development for Rails](https://pragprog.com/titles/nrclient/modern-front-end-development-for-rails/) and worked through some exercises.
* I dug into CDNs, caching, and compression options ([Brotli](https://github.com/google/brotli))... modernizing our setup at work
* I helped automate and setup [lighthouse](https://github.com/GoogleChrome/lighthouse-ci) tracking on projects at work, and fixed some low hanging fruit
* I played around with [hotwire](https://hotwired.dev/)
* I picked up [Tailwind CSS](https://tailwindcss.com/) for a few toy projects
* I converted my blog to Tailwind CSS from an old customized Twitter bootstrap theme
* I started working on some visualizations in [D3.js](https://d3js.org/), diagramming network traffic, failure rates, and org/system structures.
* I built a presentation as a Tailwind / D3 microsite vs a slide show

Some of the next things coming up?

* I will likely convert over the Semantic-UI/Fomantic-UI site to Tailwind
* I am helping support our frontend team on efforts to decouple our Front End deployment from Rails
* I will be digging into our custom react design system a bit more at work and porting over a few pages to it* Adding some more visualizations directly to this blog

# Tailwind 

After trying out a few frameworks including a bit of a deep dive on [Semantic-UI](https://semantic-ui.com/)/[Fomantic-UI](https://fomantic-ui.com/). I wasn't satisfied, the growing buzz around Tailwind pulled me in. I still have a lot to learn and a ways to go, but it is better matching my needs/desires for front-end support than anything has in a long time. As I played with Tailwind, I needed a few projects to drive a bit more real-world usage.

## Converting the Blog to Tailwind

This blog you are reading moved from Twitter Bootstrap now supports Purge CSS for the various pages, has Tailwind layouts, templates, and dev support. Nothing too complicated, but I feel it looks much better than it did. Simpler header, more readable font / white space. Dropped most of the sidebar, etc... I had to reformat some of my Markdown and post tags, I [wrote a conversion script](https://github.com/danmayer/danmayer.github.com/blob/main/Rakefile#L47) to reformat my post history.

![Bootstrap vs Tailwind](/assets/img/tailwind_blog.png)

## Tailwind Learning Sources

There are a lot of great resources out there and I wanted to share a few. I have also been using Tailwind on some test Rails projects, so some of the links are more Rails -> Tailwind specific.

* Learning & Exploring
  * [Tailwind Play](https://play.tailwindcss.com/), this real time configurable exploritory playground for Tailwind is a great way to quickly fool around with ideas and see results. I used this a lot before working on templates and files. You can also share ideas.
  * [Center elements with Tailwind CSS](https://daily-dev-tips.com/posts/center-elements-with-tailwind-css/)
  * [Tailwind breakout grid](https://play.tailwindcss.com/MjQpzw58WW)
  * [Tailwind preflight](https://tailwindcss.com/docs/preflight), I recommend understanding what preflight does and what it 'resets'
* Rails & Tailwind
  * [tailwindcss-rails](https://github.com/rails/tailwindcss-rails)
  * [Tailwind CSS JIT in a Rails project to compile styles 20x faster](https://evilmartians.com/chronicles/set-up-tailwind-css-jit-in-a-rails-project-to-compile-styles-20x-faster)
  * [Install Tailwind CSS v2.0 and PostCSS 8](https://v2.tailwindcss.com/docs/upgrading-to-v2#install-tailwind-css-v2-0-and-post-css-8)
* Tailwind Blogs / Jekyll (My templates are heavily based on some of the below, but customized a bit)
  * [Setting up docs with Tailwind CSS & GitHub Pages](https://blog.frankdejonge.nl/setting-up-docs-with-tailwind-css-and-github-pages/)
  * [Tailwind Docs](https://github.com/frankdejonge/tailwind-docs-example)
  * [purpletual-blog-theme (Tailwind & Jekyll starter kit)](https://github.com/chrisrhymes/purpletual-blog-theme)
  * [Jekyll Starter Tailwind](https://github.com/taylorbryant/jekyll-starter-tailwind)
  * [jekyll-atlantic theme](https://www.zerostatic.io/theme/jekyll-atlantic/) - This is the base of my theme

# Other Learning Projects

Other than the blog, a few other examples from my recent front-end exploration exploration.

![Coverband Semantic](/assets/img/coverband_Semantic-UI.png)

> Coverband Web built in Semantic-UI

<div style="margin-left: -300px">
{% include micro_service_request_failures.html %}
</div>

> D3 Network request flow chart


![Org / System Relationships](/assets/img/org_preview.png)
> Presentation breaking down org charts, team / system relationships, and network request flows (D3 and Tailwind)

![D3 SLA Chart](/assets/img/max_sla.png)
> D3 Request Max SLA Calculator (interactive visualization)

# Final Thoughts

It is good to revisit and resharpen skills in an area even if you aren't planning to be an expert. While I don't really do full-stack work in my daily workflow anymore, I am often heavily influencing our system design and architecture as it relates to microservices, mobile, and the future of our front-ends. I want to ensure I am still looking closely enough to know what questions to ask and understand when folks are sharing ideas and concerns... I want and need to know the landscape, so to speak, including some of the toolchains, pain points, and benefits over older styles of development. A quick bit of focused exploratory work can help one stay fresh while also not slowing down or getting in the way of the experts doing the real front-end work where I work. I am able to be a better and more capable partner in discussions and designs.

As I continue learning more about Tailwind and Visualization tools, please share any good links with me.
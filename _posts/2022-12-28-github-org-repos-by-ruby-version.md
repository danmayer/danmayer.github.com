---
layout: posttail
title: "Github Organization Repositories by Ruby Version"
image: /assets/img/repos_by_version_clean.png
category: Software
tags: [Software, Ruby, Github, Visualization]
---
{% include JB/setup %}

Every year as Ruby releases a new version at Christmas, and many folks adjust their supported versions of Ruby. Where I work adjusting the supported versions of Ruby, deprecating older versions.
This means folks have a window of time to find and update the offending older gems and microservices that would no longer be supported. This primarily relies on teams that have ownership of apps following the guidance and eventually folks nudging teams before we deprecate the Docker container that enables deployment of those versions.

I thought it would be nice to pull this out as a burndown list or a chart that can show all the repositories and group them by the Ruby version. This isn't something I could figure out how to easily do via GitHub code search, but with a bit of work, I could get the data I needed via Github's GraphQL API. Let's take a look at how to do that and how we can visualize it.

# Displaying Repositories Grouped By Ruby Version

This is what is looks like when you have a valid [github personal access token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) added to the notebook. 

[![Repositories Grouped by Ruby Version](/assets/img/repos_by_version.png)](https://observablehq.com/d/c046053c399b40b6)

You can also filter in to find only repos matching a specific Ruby version.

![Select Input Showing Count Repos by Ruby version](/assets/img/ruby_version_selection.png)

# Querying Organization Repositories including Ruby Version

This does rely on the fact that our company generally requires a `.ruby-version`, but the same approach could be adjusted to pull the version out of a `Dockerfile`, `CI file`, or deployment scripts.

The basic Github GraphQL Query is below, note the `object(expression: "main:.ruby-version")` section:

```javascript
async function get_repos(lang, first, after) {
  let lang_filter_line = " ";
  if (lang !== "*") {
    lang_filter_line = ` language:${lang} `;
  }
  let query_line = `query: "org:${githubOrganization} ${lang_filter_line} archived:false sort:updated-desc", type: REPOSITORY, first: ${first},`;
  if (after !== null) {
    query_line += ` after: "${after}"`;
  }

  return await github4`query {
  search(${query_line}) {
    repositoryCount
    pageInfo {
        endCursor
        hasNextPage
    }
    edges {
      node {
        ... on Repository {
          name
          nameWithOwner
          collaborators(first: 20) {
            nodes {
              name
            }
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          stargazers {
            totalCount
          }
          object(expression: "main:.ruby-version") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
}`;
}
```

There are several functions to pull things like the organization's teams, tags, etc. The basic pattern can be extended to find gems, deprecated projects, projects without a team, projects with invalid codeowners files, or more. Once you have data for a file like the `.ruby-versions` file, you can process it to make it friendly for display, this is the snippet I use to process each repository.

```javascript
  node.ruby_version =
    node?.object?.text?.trim()?.replace("ruby-", "") || "unknown";
```

# Visualizing & Sharing the Tool

I have been using [Observable](https://observablehq.com/) for visualizing and sharing things like that recently. I have a number of internal company notebooks, and shared out [A Observable notebook displaying Trends](/ruby_trends) on [Ruby.Social](https://ruby.social) a few days ago.

You can [clone the notebook from here yourself](https://observablehq.com/d/c046053c399b40b6), to make a private version for your organization.

<iframe width="120%" height="1500" frameborder="0"
  src="https://observablehq.com/embed/c046053c399b40b6@726?cell=*"></iframe>
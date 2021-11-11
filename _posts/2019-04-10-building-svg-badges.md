---
layout: posttail
authors: ["Dan Mayer"]
title: "Building SVG Badges in Ruby"
image: /assets/img/example.svg
category: Ruby
tags: [Ruby]
---
{% include JB/setup %}

# Building SVG Badges in Ruby

A while ago I needed to create a simple dynamic SVG. After a bit of tinkering, it was easy enough to build a simple Ruby class to do what I needed to do. 

{% unless page.image %}
![Example Badge](/assets/img/example.svg)
{% endunless %}
> SVG created from the below code

It was a super quick thing to put together and solved a problem I was having. I was reminded of that today when I had another quick issue that I wanted to resolve. I wanted to pull some data not available by a services APIs, the data I needed was easily accessible to me in their webviews, so I quickly hacked together a web scraper, pulling the data I needed into a google sheet.

## Being a Developer, Unblocks You

A thing I have always loved about being a developer is you can solve your own problems. You have to be careful to not get sucked into it and wasting a bunch of time, but you also aren't blocked just because something you need isn't already available. If you build a quick hack ensure it is just that a quick hack and that you won't regret putting it into your workflow. The below SVG example was a tiny helper for devs, while today' journey helped pull metrics on CircleCI related to metrics I want to pull for myself monthly. In either case, if it breaks it is no issue and can be fixed in a few minutes.

Being able to solve the problems you run into along the way is one of the great parts of being a developer.


### Full Ruby SVG Badge Code

```ruby
class SvgFormatter
  def initialize(output = nil)
    @output = output || STDOUT
  end

  def format(result)
    percentage = SOME_DATA_SOURCE.round(1)
    File.open('badge/results.svg', 'w') { |f| f.write(template(percentage)) }
  rescue RuntimeError => e
    @output.puts e.message
    @output.puts 'SvgFormatter was unable to generate a badge.'
  end

  private

  def template(percentage)
    file_content = <<~SVGTEMPLATE
      <?xml version="1.0"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="90" height="20">
        <linearGradient id="a" x2="0" y2="100%">
          <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
          <stop offset="1" stop-opacity=".1"/>
        </linearGradient>
        <rect rx="3" width="90" height="20" fill="#555"/>
        <rect rx="3" x="51" width="39" height="20" fill="#007ec6"/>
        <rect rx="3" width="90" height="20" fill="url(#a)"/>
        <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
          <text x="24.5" y="15" fill="#010101" fill-opacity=".3">Title</text>
          <text x="24.5" y="14">Title</text>
          <text x="68.5" y="15" fill="#010101" fill-opacity=".3">#{percentage}%</text>
          <text x="69.5" y="14">#{percentage}%</text>
        </g>
      </svg>
    SVGTEMPLATE
    file_content
  end
end
```
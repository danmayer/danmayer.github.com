If you ever have a need to convert a bunch of markdown or html files to confluence it is really easy. Their Rest-API is pretty clean and if you use Ruby there is a small [Confluence API gem](https://github.com/amishyn/confluence-api-client) to make it even easier.

# Why Move To Confluence?

Why would we move our documentation from Markdown in a git repo, to Confluence? Well our team is growing and we interact with more and more non developers, who could benefit and contribute to our documentation. While some of our documentation was very technical much of it wasn't. It would be helpful to our Support, IT, Project Management, and Stakeholders. Markdown and git aren't the best way to get other folks comfortable reading or contributing to our documentation.

* Increased colaboration
* Simplified access control to read
* Ability to mix ticketing, widgets, and wiki docs

That was enough for us to decide on moving our documentation over.

# Bulk Conversion & Upload

I didn't want to take the time to move over 80+ documents by hand. So I wrote a script to help. I created a page in our confluence space for imported docs. I set that as a parent page and then just converted all of the Markdown to HTML and uploaded it in a single step. Linking to the original document in case anything was lost in translation. Now we can pull content and link to the old content, but start building out newer documentation on our confluence space.

# Show Me the Code

```ruby
#!/usr/bin/env ruby

require 'rubygems'
require 'confluence/api/client'
require 'kramdown'


username = 'your@email.com'
password = 'your_pass'
url      = 'https://your_co.atlassian.net/wiki'
space    = 'DP'
# if you don't want your files at the root give a parent page to nest them under
parent_page_id = 5564541
path     = '/Users/danmayer/projects/DevDocuments'
original_root_path = 'https://github.com/OffgridElectric/DevDocuments/blob/master'

###
# see https://github.com/amishyn/confluence-api-client for usage
###
client = Confluence::Api::Client.new(username, password, url)

errors = []
files = Dir.glob("#{path}/**/*")
converted = 0

files.each do |file|
  if file.to_s.match('.md')
    converted += 1
    next if converted <= 3
    relative_path = file.to_s.gsub("#{path}/",'')
    title = file.to_s.gsub("#{path}/",'').gsub('/','_').gsub('.md','')
    content = File.read(file)
    content += "\n\n\n [original document](#{original_root_path}/#{relative_path})"
    html_content = Kramdown::Document.new(content).to_html

    puts "creating #{title}"
    page = client.create({type:"page",
                      title: title,
                      space: {key: space},
                      ancestors:[{id: parent_page_id}],
                      body: {storage:{value: html_content,
                                      representation: "storage"}}})
    errors << page if page['statusCode'].to_i > 200
  end
end

puts "converted #{converted}"
puts "errors:"
puts errors.inspect

puts 'done'
```
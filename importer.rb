require 'rake'
require 'nokogiri'
require 'ruby-debug'
require 'time'
require File.join(File.dirname(__FILE__), "downmark_it")

desc "Start jekyll server"
task :start_server do
 `jekyll --server`
end

namespace :importer do

  desc "Import blog posts into jekyll"
  task :from_file do
    data = File.read('Movable_Type-Backup.xml')
    doc = Nokogiri::XML(data)
    missing = 0
    doc.root.children.select{|e| e.name=='entry'}.each do |node|
      #puts " - #{ node['authored_on'] } ( #{ node['title'] }: #{ node.text })"
      date = Time.parse(node['authored_on'])
      date = date.strftime("%Y-%m-%d")
      title = node['title']
      unless title
        missing+=1
        title = "no title #{missing}"
      end
      title_url = title.gsub(' ','-').gsub(/(!|:|\/|\.|\+|\?|#|\(|\))/,'')
      #_posts/2012-10-30-hello-world.md
      local_filename = "_posts/#{date}-#{title_url}.md"
      output = <<EOF
---
layout: post
title: "#{title}"
category:
tags: []
---
{% include JB/setup %}
EOF

      output << convert_output(node.text)

      #manually edit 2010-10-13, 2010-06-21, 2007-01-14 2006-01-19 2006-05-03
      #2005-03-10 2005-02-08 2005-02-07 2004-09-09 2004-04-13 2004-04-13 2003-11-02
      skip_dates = ['2003-07-14', '2004-09-02', '2007-09-23', '2011-12-31', '2010-10-13','2010-06-21', '2007-01-14', '2006-01-19', '2006-05-03', '2005-03-10', '2005-02-08', '2005-02-07', '2004-09-09', '2004-04-13', '2004-04-13','2003-11-02']
      unless skip_dates.include?(date)
        if Time.parse('2000-01-01') <  Time.parse(date)
          puts local_filename
          File.open(local_filename, 'w') {|f| f.write(output) }
        end
      end
    end
    puts "done"
  end

  def convert_output(body)
    #weird bug in JS parsing from github gists
    body = body.gsub('></script>','> </script>')
    body = body.gsub('_url','\_url')
    body = body.gsub("\n\n","\n\n  \n\n  ")

    #replace code: sections
    while(foundcode = body.match(/\[code:.*?\](.*?)\[\/code\]/m)) do
      if foundcode && foundcode[0] && foundcode[1]
        body = body.sub(/\[code:.*?\](.*?)\[\/code\]/m, "<pre>#{foundcode[1]}</pre>")
      end
    end

    #update image links and assets
    body = body.gsub(/http\:\/\/www\.mayerdan\.com\/assets_c\/\d+\/\d+\//im,'/assets/')
    body = body.gsub(/http\:\/\/www\.mayerdan\.com\//im,'/assets/')
    body = DownmarkIt.to_markdown(body)
    body
  end

end

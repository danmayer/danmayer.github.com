require "rubygems"
require 'rake'
require 'yaml'
require 'time'

#enable just for importing
#require './importer'

desc "remove symbolic link used to serve when editting local"
task :remove_link do
  #ls -la _posts/assets
  #lrwxr-xr-x  1 danmayer  staff  6 Nov 20  2019 _posts/assets -> assets
  `rm _posts/assets`
end

desc "add symbolic link used to serve when editting local outside of jekyll serve"
task :add_link do
  `ln -s assets _posts/assets`
end

desc "Start jekyll server"
task :start_server do
  `bundle exec jekyll build`
  `npm run prod`
  `bundle exec jekyll serve`
end

desc "Start jekyll build"
task :build do
  `bundle exec jekyll build`
  `npm run prod`
  puts "open files from _site/index.html"
end

SOURCE = "."
CONFIG = {
  'version' => "0.2.8",
  'themes' => File.join(SOURCE, "_includes", "themes"),
  'layouts' => File.join(SOURCE, "_layouts"),
  'posts' => File.join(SOURCE, "_posts"),
  'post_ext' => "md",
  'theme_package_version' => "0.1.0"
}

# 
namespace :port do
  desc "port from older template to jekyll tailwind templates "
  task :posts do
    # TODO: later
    # put back discus? #maybe later
    # is CSS compression working? YES
    # clean up tags? 
    # clean up categories?
    # remove all old jekyll bootstrap stuff

    # TODO: before go live  
    # convert first image to the image:tag
    # move image credit to image credit:tag
    # add description to meta data, like: Learn how to use Markdown to write blog posts. Understand front-matter and how it is used in templates.
    # add author to meta data
    #authors: ["Dan Mayer"]
    # layout: posttail
authors: ["Dan Mayer"]
    Dir.glob('_posts/*.md').select { |file| File.file? file }.each do |file|
      data = File.read(file)
      unless data.match('layout: posttail')
        data.gsub("layout: post\n", "layout: posttail\n")
      end
      unless data.match('authors: ["Dan Mayer"]')
        data.gsub("layout: posttail\n", "layout: posttail\nauthors: ["Dan Mayer"]\n")
      end
      File.open(file, 'w') { |f| f.write(data) }
    end
  end
end

# Path configuration helper
module JB
  class Path
    SOURCE = "."
    Paths = {
      :layouts => "_layouts",
      :themes => "_includes/themes",
      :theme_assets => "assets/themes",
      :theme_packages => "_theme_packages",
      :posts => "_posts"
    }

    def self.base
      SOURCE
    end

    # build a path relative to configured path settings.
    def self.build(path, opts = {})
      opts[:root] ||= SOURCE
      path = "#{opts[:root]}/#{Paths[path.to_sym]}/#{opts[:node]}".split("/")
      path.compact!
      File.__send__ :join, path
    end

  end #Path
end #JB

# Usage: rake post title="A Title" date="2012-02-09"
desc "Begin a new post in #{CONFIG['posts']}"
task :post do
  abort("rake aborted: '#{CONFIG['posts']}' directory not found.") unless FileTest.directory?(CONFIG['posts'])
  title = ENV["title"] || "new-post"
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  begin
    if ENV['date']
      date = Time.parse(ENV['date'])
    else
      date = Time.now
    end
    date = date.strftime('%Y-%m-%d')
  rescue Exception => e
    puts "Error - date format must be YYYY-MM-DD, please check you typed it correctly!"
    exit -1
  end
  filename = File.join(CONFIG['posts'], "#{date}-#{slug}.#{CONFIG['post_ext']}")
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end

  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/-/,' ')}\""
    post.puts "category: "
    post.puts "tags: []"
    post.puts "---"
    post.puts "{% include JB/setup %}"
  end
end # task :post

# Usage: rake page name="about.html"
# You can also specify a sub-directory path.
# If you don't specify a file extention we create an index.html at the path specified
desc "Create a new page."
task :page do
  name = ENV["name"] || "new-page.md"
  filename = File.join(SOURCE, "#{name}")
  filename = File.join(filename, "index.html") if File.extname(filename) == ""
  title = File.basename(filename, File.extname(filename)).gsub(/[\W\_]/, " ").gsub(/\b\w/){$&.upcase}
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end

  mkdir_p File.dirname(filename)
  puts "Creating new page: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: page"
    post.puts "title: \"#{title}\""
    post.puts "---"
    post.puts "{% include JB/setup %}"
  end
end

#Load custom rake scripts
Dir['_rake/*.rake'].each { |r| load r }

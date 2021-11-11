---
layout: posttail
authors: ["Dan Mayer"]
title: "Executable Ruby in embeddable widgets and other terrible ideas"
category: javascript
tags: [ruby, javascript]
---
{% include JB/setup %}

I want to first say that all that follows is basically a terrible idea, but I enjoy building evil projects once in awhile. If you are looking for a nice solution to running Ruby from the web checkout [repl.it](http://repl.it/languages/Ruby), [TryRuby](http://tryruby.org/levels/1/challenges/0), or [codepad](http://codepad.org/).

In this post I show examples of how I setup Ruby code that can be executed on my statically generated blog. This is sort of a Ruby follow up to [Javascript formatting and highlighting on Jekyll and Github pages](/javascript/2012/12/15/js-formatter-and-runner/). Although, it doesn't show how to setup your own version as that wouldn't be very safe or secure.

Once I had javascript code execution working, I really wanted to be able to do the same with Ruby. I could even envision some real world use cases for running Ruby from a page. I happened to be working on another project that seemed like a good fit to making Ruby from JS happen. I am going to start with some examples before getting into how the remote Ruby runner works.

__(The first run might take as long as 60 seconds to return a result, more on why below)__

#### Example Ruby code snippet

<div class="ruby-runner" data-sig="izI5aBu3xe1wL1C+y19Xyl4gZRw=">
  <pre class="code">
require 'test/unit'

class Client
  attr_accessor :name, :age
  
  def initialize(name, age)
    self.name = name
    self.age = age
  end

  def can_drink?
    age > 21
  end

end

ClientTest = Class.new Test::Unit::TestCase do

   def test_can_drink
     client = Client.new('bruce', 20)
     assert_equal false, client.can_drink?
   end

end
  </pre>
</div>


#### Example Ruby code snippet that results in a file artifact

<div class="ruby-runner" data-sig="qwfsvQGKZk77dBfNDz8KSaj5laQ=">
  <pre class="code">
require 'pdfkit'

kit = PDFKit.new('http://www.reddit.com/')
Dir.mkdir('./artifacts') unless File.exists?('./artifacts')
file = kit.to_file('./artifacts/temp_pdf_kit.pdf')
  </pre>
</div>

### Neat, How's it work?

The Ruby script running is based on a couple projects that I am not really ready to release. I can explain the basic functions and components, but I am not saying this is a good idea. I also wouldn't take this as a template for how anyone should try to embed Ruby examples into a blog. I must say that for just running some simple Ruby code this is in fact huge overkill. The pieces of my code running system are built to handle much more than simple script requests, I just realized it would be a simple feature to add to my other project for fun. Here are the steps taken to run Ruby from a static HTML site.

1. A Javascript library sends Ruby code to my Heroku app called [deferred-server](http://git-hook-responder.herokuapp.com/).
2. The deferred-server verifies the code is trusted based on the signature (code can only be signed by valid users of deferred-server)
3. If the code is trusted the app launches a deferred-server (a sleeping ec2 instances, but could basically be any cloud provider)
4. On booting the deferred-server starts a instance of [server-responder](https://github.com/danmayer/server_responder), which handles various requests to a deferred server, either script based or project based.
5. The deferred-server app sends the script payload to the now running server, hitting the configured server-responder with a package of work to do and where to store the `future_result`.
6. The Javascript at this point knows where to look for the `future_result` and is polling for completed results.
7. When the JS finds completed results it pulls down the results as a JSON package and can handle them for the given situation (In this case the ruby-runner displays the results and provides a link to any run artifacts).
8. After X amount of time of inactivity the deferred-server is put back to sleep saving on cost and resources. 

### That is insane, I want to try it!

Unfortunately, the code for this isn't really ready for general use. In fact it is quite a mess. I won't get into why for now, but I can say that I have been playing around with many different development ideas and styles on my side projects and some really didn't work well at all! I also have yet to come up with a security model that would make this really safe to share.

As mentioned earlier it can take a long time for the first request to respond. This is because I am not just hitting one server that is ready to handle my Ruby request. I am hitting a go between server which actually manages other servers and boots them up on demand. Once the script-responder server is up and running the response time is actually pretty good even with the go between server.

I could modify and combine small pieces of the two projects to allow anyone to easily setup a Heroku instance to execute arbitrary Ruby code. Which might be the best way to release and share this functionality. If there is any interest in being able to quickly and easily embed Ruby example code on blogs, let me know and I can likely whip that up. Just being able to run code on Heroku, wouldn't satisfy my needs as I wanted to run code which couldn't be installed onto Heroku systems.

### Other examples of running Ruby code

I will post more on deferred-server and server-responder at some point in the future. For now you can read more about the [deferred-server script runner](http://git-hook-responder.herokuapp.com/examples) in the examples section.

Also, you can check out my first real world usage to run custom Ruby on a static page. It uses a custom JS script on my resume, which runs embedded JS to [on the fly build a PDF](http://resume.mayerdan.com/) of my resume (click the PDF link to see it in action, view the page source to see how it works). This has been running 'in production' for months without issue. The source for custom Ruby on the page is pretty hilarious.

    <div class="ruby-runner-custom" style="display:none;" data-sig="IhFw4kpAHfpiBkbNv0s4ALR8tjc=" data-auto-init="false">
      <pre class="code">
        require 'pdfkit'
        kit = PDFKit.new('http://resume.mayerdan.com/?no_pdf=true')
        file = kit.to_file('./artifacts/dan_mayer_resume.pdf')
      </pre>
    </div>
    <script src="http://git-hook-responder.herokuapp.com/javascript/code-runner.js" type="text/javascript"></script>
    <script>
    var addPDFLink = function(currentPluggin) {
      var element = '#formats';
      $('#formats').append(' | <a class="run-button" href="#">PDF</a>');
	  $(element).find('.run-button').click(function(e) {
	    $(element).find('.run-button').text('generating...');
	    currentPluggin.runExample();
            e.preventdefault;
	    return false;
	  });
    };
    $('.ruby-runner-custom').codeRunner({'initialize_method' : addPDFLink, 'follow_files' : 'true'});
    </script>

I also use the deferred code running functionality in a slightly different way with a Ruby project. It follows the same basic flow, but opposed to JS the Ruby app can make requests to itself running on a deferred server. I use that functionality on my [blog2ebook](http://blog2ebook.herokuapp.com/) project to perform tasks that aren't allowed or would take to long on Heroku, like running kindlegen to generate ebooks. This allows a app to serve as a front end on Heroku while doing larger backend tasks on a more robust server. 

I will keep playing around with these systems and hopefully be sharing more and putting the to good use soon.
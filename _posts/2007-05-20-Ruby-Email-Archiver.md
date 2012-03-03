---
layout: post
title: "Ruby Email Archiver"
category:
tags: []
---
{% include JB/setup %}
Checking and receiving email via ruby.

If you need to get emails and check emails via a ruby script this should get you started in the right direction. I needed to copy down about six thousand emails from my pop server, so I wrote up this little script.  Ruby makes email simple, you just need to know where to look and unfortunately most searches result in finding a 3rd party library that costs a pretty penny for email actions in ruby. What you really need is the <a href="http://www.ruby-doc.org/stdlib/libdoc/net/pop/rdoc/classes/Net/POP3.html ">Net::POP3</a> or the <a href="http://www.ruby-doc.org/stdlib/libdoc/net/imap/rdoc/classes/Net/IMAP.html">Net::IMAP</a>. After going through the quick documentation and seeing some of the available code examples, writing the code is straightforward. This is just a very simple example, with hardly any error checking.

Download the source to <a href="http://WWW.bandddesigns.com/ml/arch/RubyEmail.zip">Ruby Email Archiver</a>

<pre>
require 'net/pop'

Net::POP3.start('pop.yourdomain.com', 110,
                    'userName', 'myPass') do |pop|
  if pop.mails.empty?
    puts 'No mail.'
  else
    i = 0
    pop.each_mail do |m|   # or "pop.mails.each ..."
      subject = m.header.split("\r\n").grep(/^Subject: /)[0]
      subject = subject.gsub("Subject: ","")
      subject = subject.gsub(":","")
      subject = subject[0,10] if(subject.length > 10)
      File.open("/archive/#{i}-#{subject}.txt", 'w') do |f|
        f.write m.pop
      end
      #if you want to delete msg after archive
      #m.delete
      i += 1
    end
    puts "#{pop.mails.size} mails popped."
  end
end
</pre>
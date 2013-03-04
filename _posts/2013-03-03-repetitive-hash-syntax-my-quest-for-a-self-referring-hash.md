---
layout: post
title: "Repetitive Hash Syntax, My quest for a Self Referring Hash"
category: ruby
tags: [ruby, code-quality]
---
{% include JB/setup %}

For years a tiny code style issue has bothered me in Ruby. I find myself frequently building up a set of variables and then building a Hash where the keys all match the variables. It is a small nit-pick, and never wastes much time, but it has always annoyed me. The wasted duplication to have `{:some_key => some_key}` for a long list of variables, when the key and the variable are named the same. Convention over configuration and all that. Ruby is a beautiful and flexible language. Why can't we make it simpler and cleaner to create a Hash based of some locally defined variables. It turns out more complicated than one would think, because of trying to bind to the current variable scope.

In the end what I wanted was a way to create a hash that would looks something like this, which I like to call a SelfReferringHash


{% highlight ruby %}

    calculation = 7
    word        = "a word"
    data        = "more data"
    
    {:calculation <=, :word <=, :data <=}
    #in this new fake syntax I imaged '<=' to mean points to self

    #or perhaps being able to call a method on a array
    [:calculation, :word, :data].bind_into_hash

    #or perhaps something a bit more normal
    Hash.build_from_vars([:calculation, :word, :data])
    
    #all methods would have the same result of a hash like below
    {:calculation => 7, :word => "a word", :data => "more data"}
    
{% endhighlight %}


###Inspiring a solution

I mentioned this annoyance years ago to [Ara Howard](https://github.com/ahoward), and he whipped up a [example very quickly](http://drawohara.com/post/151193800/ruby-symbol-to-hash), but it didn't feel quite right. Ara proposed a [few iterations](https://gist.github.com/ahoward/157787) with various syntax's `:result.to_h{}` or `[:a, :b, :c].to_h{}` but the syntax was distracting. So I kind of forgot about the issue and forgot about the issue for awhile.

I then recently came across this post [Playing Around with Ruby Hashes](http://alex.nisnevich.com/blog/2012/07/30/fun_with_ruby_hashes.html). Where Alex wants to add various features such as setting a arbitrarily deep value on the Hash without all the intermediate checks and creation of empty hashes

{% highlight ruby %}

    hash[player][:stats][category][statistic] = value
    
    #without littering my code with a bunch of lines like

    hash[player] ||= {:stats => {}}
    hash[player][:stats][category] ||= {}
    
{% endhighlight %}   

The post build some fun features onto Ruby's Hash and the post inspired me to play around with building a cleaner solution.

###Attempting a solution

While one of Ara's [symbol to hash solutions](https://gist.github.com/ahoward/157787) was pretty close to what I wanted, it Monkey patched the Array and and Symbol I wanted to avoid that. I decided that I should make a new object and subclass Hash opposed to tacking my code onto any existing objects in the system. 

{% highlight ruby %}

    class SuperHash < Hash

      def initialize(*args, &context)
        if args && args.first.is_a?(Array) && context
          super()
          hash = SuperHash.from_array(args.first, &context)
          hash.each_pair{|key, value| self[key]=  value}
        elsif args && args.first.is_a?(Array) && context.nil?
          raise "requires context block for binding"
        else
          super()
        end
      end

      def self.from_array(array, &context)
        raise "requires context block for binding" if context.nil?
        array.flatten.inject(SuperHash.new){|h, val| h.update({val => (eval(val.to_s, context))}) }
      end

    end

    calculation = 7
    word        = "a word"
    data        = "more data"

    my_hash = SuperHash.from_array([:calculation, :word, :data]){}
    puts my_hash.class
    puts my_hash.inspect

    my_hash = SuperHash.new([:calculation, :word, :data]){}
    puts my_hash.class
    puts my_hash.inspect

    begin
      my_hash = SuperHash.new([:calculation, :word, :data])
      puts my_hash.class
      puts my_hash.inspect
    rescue => err
      puts err
    end

    my_hash = SuperHash.new()
    puts my_hash.class
    puts my_hash.inspect

{% endhighlight %} 

Running that code results in the following output, with the `SuperHash.new([:calculation, :word, :data]){}` ending up being the 'cleanest' way to invoke the code.

{% highlight ruby %}

    SuperHash
    {:data=>"more data", :calculation=>7, :word=>"a word"}
    SuperHash
    {:data=>"more data", :calculation=>7, :word=>"a word"}
    requires context block for binding
    SuperHash
    {}
    
{% endhighlight %} 

In the end, this might be interesting if I had some other things to patch onto the Hash object. Unfortunately it seems like this still isn't really that useful and it is a bit to awkward. I could never avoid the primary issue I had with Ara's examples of having to awkwardly pass the context. All solutions seem to require you to  pass a empty block to be able to bind to the context and access the variables at that time. Having a initializer or a class method which requires `{}` just seems to awkward to be useable. So after all this time I am still left feeling, unsatisfied. While this is a very simple problem to understand and Ruby is a very flexible language. The issues of binding to a context and variable scoping makes building a more beautiful and usable version of a self referring Hash out of my reach.


If anyone has suggestions or ideas on how to build something that is a bit cleaner or closer to my goal and doesn't resort to passing a empty block, I would love to see any other solutions. Perhaps, I am missing some more interesting way to bend Ruby to fit my mind.
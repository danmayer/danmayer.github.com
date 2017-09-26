---
layout: post
title: "Most Valuable Code"
image: /assets/img/obama_code.jpg
category: Programming
tags: [Programming, Development, Tips, Rails]
---
{% include JB/setup %}

![image detect](/assets/img/obama_code.jpg)
> Obama writing JS with [code.org](https://twitter.com/codeorg/status/541997370356269057?ref_src=twsrc%5Etfw&ref_url=http%3A%2F%2Fmashable.com%2F2014%2F12%2F09%2Fpresident-obama-code%2F).

# The Value of Code

While both of the below examples are obviously a bit exaggerated they do capture the point. The code we write has value because it solves some challenge.

> The Best Code is No Code At All  
> -[Jeff Atwood](https://blog.codinghorror.com/the-best-code-is-no-code-at-all/)

or

> Programming is a means to an end, not an end in itself. You should be trying to do as little of it as possible to make the thing that you want.  
> -[Jake Levine](http://www.niemanlab.org/2013/03/jake-levine-why-learning-to-code-isnt-as-important-as-learning-to-build-something/)

# Most Valuable Code I've Written

Given that I think the most valuable code I have currently ever
written is a stupid and simple method. This is a recreation of the
method below avoiding un-important internals.
<!--more-->

```ruby
def ensure_safe
  begin
    yield
  rescue Exception => exception
    message_exception = exception.exception("ensure_safe rendered the page, saved exception: #{exception.message}")
    message_exception.set_backtrace(exception.backtrace )
    if Rails.env.production?
      ExceptionReporter.report(message_exception)
    else
      Rails.logger.error "******* Error *******"
      Rails.logger.error "error safe render, on production this would report the error, but render nothing"
      Rails.logger.error "error: #{message_exception.class} #{message_exception.message}\n  #{message_exception.backtrace.join("\n ")}"
      raise exception
    end
    return ''
  end
end
```

The above method when added to `application_helper.rb` could be called in view wrapping a render method. 

```
<div>
 <%= ensure_safe { render 'show_results', results: data } %>
</div>
```

When used on important pages, it would generally result in all the primary content being rendered. Then it would silently return an empty partial to the user, while reporting the exceptions up to our developer team. Often the bug was in a navigational, promotional, advertising, or upsell element. Many times the error would only occur in specific data combinations which is why it wasn't caught in testing. It prevented many smaller error from ever taking down our primary content or purchase flow ever again, which was huge. In total this probably prevented hundreds of thousands of errors from ever reaching our end users eyes.

# Stands the Test of Time

My thoughts about this particular piece of code isn't new. In face below is what I had to say about it when I moved on from LivingSocial a few years ago in a email farewell to fellow engineers.

> ensure_safe: I still consider this the most valuable piece of code I have ever written. Luckily, the era of frequent exceptions and downtime has passed, but back when we were pushing 12+ minute deploys and we didn't have ls-deploy rollback when a bug went live we would often have 20+ minutes of purchase flow downtime. Knocking out deals#show or a purchase page would halt all revenue for about 20 minutes while we scrambled to revert and redeploy. The silly method would let some portions of the view safely explode while sending us exceptions but keeping the site running. It often headed off 10-30K exceptions per incident often with no users the wiser that an issue occurred. I wish there was a graphite stat counter on how many times that method saved the site from going down ;)

# What Piece of Code Surprised you?

What silly piece of code has surprised you over the years? Something that was perhaps thought of as a quick fix or temporary solution that has stood the test of time of proved so valuable that it has endured? I am sure other folks have some great examples of the method that has become a myth or perhaps infamous for it's craziness.

---
layout: posttail
authors: ["Dan Mayer"]
title: "Simplifying new gemset creation for RVM"
category:
tags: []
---
{% include JB/setup %}

Ruby, environment, developmentI found myself annoyed that each time I created a new project I had to go through the same steps to create and setup my gemset. I am also trying to be better about automating things I do over and over. I decided I should put something in my .bash_profile to simplify my frequent task of making a new gemset on a brand new project.     The manual way I ended up creating gemsets in the past, was:* cd to project_directory* rvm use ree (my preferred local ruby run time)* rvm gemset create projectGemSet* echo 'rvm use ree@projectGemSet' > .rvmrc* cd ../* cd project_directiory* agree to trust the .rvmrc file    That is pretty simple, but gets a bit annoying to do over and over. I figured I could very quickly whip up a solution in my bash profile. Unfortunately, due to my shell scripting skills kind of sucking, I ended up using Ruby.    Basically after adding my new ruby script to my .bash_profile, I can now just type 'init_gemset newgemset', and I will be left in my project using my new gemset. The final script is below.
    
        <script src="https://gist.github.com/1257690.js?file=init_gemset.rb"> </script>

One thing to note is the time saved with automating a repetitive task vs. time spent to automate it. In the end because of spending a decent amount of time trying to write this as a shell script without using Ruby. I likely spent more time getting this script working, than it will ever save me. It also isn't even fully reusable for other people in it's current state (the .bash_profile function needs a full path to the ruby script in it, and my preferred RVM ruby is hard coded). It could be made more easily reusable / sharable (likely making it a gem, or sending a pull request to RVM itself with this as a feature). Doing this the fully 'right' way would just add more time spent, on something I initially did to save a few moments.    I wanted to get back to what I was originally working on, and I had something that would work for me. So I will leave it here as a simple gist. Working on this also made me think about what is worth spending time automating. In terms of savings this likely wasn't worth much, but there are many times that a repetitive task is really begging for automation.
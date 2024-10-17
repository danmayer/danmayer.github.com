---
layout: post
title: "Creating Consistent Characters Across Images"
category: Programming
tags: [Programming, Development, APIs]
---
{% include JB/setup %}

I have been creating children's books with my kids using AI for awhile now. I recently was talking to someone and they where doing the same thing, but using just the ChatGPT bot and creating a single image for a short story. I was going to cover some of my more recent progress working on this side project, and some of the methods I use.

## The Text Isn't the Problem

Early on, generating amusing enough stories for the kids was super easy. My daught would request something like, "I want a book about me being a puppy doctor." Some simple prompt trial and error and parsing would easily make a cute book of any desired length, and could even adjust the vocabulary to the appropriate reading level. One could even go for specific styles with rhymes, humor, first person, etc... I will cover the text generation in another post some time, but once I had a good short story, I would try to generate images.

## Early Image Problems

The first books images, were hilariously bad... They were so bad that it was part of the humor, we would all laugh at the incredibly silly images, but immediately my kids would start to point out all the inconsistencies of the images on each page. 

* Why doesn't the Sasha look at all like her?
* Why does she have long brown hair on one page, short on another, and orange hair somewhere else?
* Why do the clothes change on every single page?
* Why does the age, height, etc vary constantly?

EARLY_IMAGES

## Early Attempts to Improve the Images

I started trying a few methods to improve

### Improved and Consistent Image Prompts

My first attempts to resolve were just improved prompts. I would add a trick that would regularlize the image prompt with additional details describing the character when ever they were to be in the illustration. This was slightly better, but not by much...

__BETTER__IMAGE__

### Image2Image Support

I next allowed the book creator to select and upload images that would be used along with image2image and prompts to generate semi-recognizable images that where stylized across the book. This had several problems:

* You really end up wanting an image per page
* The closer the inital image is to the actual desired content the better qualtiy
* If the photos aren't consistent neither is the output
* The output quality was hit and miss
* It was extremely time consuming, now resulting in photo shoots just to seed the book generation
* I don't really want to upload a bunch of pictures of my kids to any of the cloud AI companies, so I run it all locally on my own machine

I was stuck at this for awhile.

__IMAGE2_IMAGE2s

# Training LORA models

Eventually, I learned how to take a small collection of high quality images of one of my kids and train a Lora model. The tools for local training are a bit hard to work with, but they also can be run in the cloud flairly easily. After some trial and error. I was able to build Stable Diffusion 1.5 or XL models that could fairly frequently build regonizable characters in any sort of situation. The quality of any given image varied a lot and the older Stable Diffusion models couldn't set scenes in the books very well. It was close, but not good enough to really take the quality of the books to the next level. Combining this technique along with custom Stable Diffusion models that better match the scene / theme of the book would help, but only a little and was a lot of work.

# Flux LORA Models

The next big breakthrough came when Flux dev was released. This image model was far superiour in build scenes from prompts, so you could put characters in any scene the book would require... The trick of detailed descriptions of a character along with a scene actually also went a long way. Although, now I had scene how regonizable and good a trained LORA model could look with image models... I needed a way to generate Flux LORA models, but on my RTX 4080 graph card that has 16GB of RAM (or I could get it all running in the cloud). The tooling for training local Flux LORAs initially needed 24GB, but folks kept tweaking things and layering various improvements, I believe it is slow but folks are training models on 8GB graphic cards these days.

I can now take a small high quality collection of photos of my subject, and generate a pretty good Flux LORA in about 1 hr on my local machine.

| A few images like these | Generates Output like these |
| -------- | ------- |
| IKGM     | output  |
| February | $80     |
| March    | $420    |


# Consistent Characters

Now after spending a bit more time and getting better at training lora models as well as the tools getting better, I can fairly easily build a model for any character I want. I generally just need 30-40 images and a bit of time cropping and adjusting the image inputs. You can do this quickly, but the better you input images are the better your model turns out, I am sure I can improve my process of collecting the input images, but the output quality is already good enough for making fun and easily recognizable consistent characters across one of my kid's book ideas. You can get consistent outfits with a few details in the prompt, you can get wildly imaginative scenes. It is easy to generate various styles 2-d, 3d, photo realistic, cartoon, water color, etc...

I now have LORA models of the whole family and can generate funny and silly images, the kids enjoy just requesting silly images and not even full books now.

_IMAGES

# A prompt across LORA Models

To give a bit more of an idea of how the training works and the output it gives. Here are a few sample prompts and the output images.

COWBOY

ASTRONAUGHT


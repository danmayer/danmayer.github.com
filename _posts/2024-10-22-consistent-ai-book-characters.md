---
layout: posttail
title: "Creating Consistent Characters Across Images"
image: /assets/img/fun_family.webp
category: Programming
tags: [Programming, Development, APIs, AI, Stable-Diffusion]
---
{% include JB/setup %}

I have been creating children's books with my kids using AI for a while now. I recently talked to someone, and they were doing the same thing but using just the ChatGPT bot and creating a single image for a short story. I will cover some of my recent progress working on this side project, as well as some of the methods I use.

## The Text Isn't the Problem

Early on, generating amusing enough stories for the kids was super easy. My daughter would request something like, "I want a book about me being a puppy doctor." Some simple prompt trial and error and parsing would easily make a cute book of any desired length and could even adjust the vocabulary to the appropriate reading level. One could even go for specific styles with rhymes, humor, first person, etc... I will cover the text generation in another post sometime, but once I have an excellent short story, I will try to generate images.

## Early Image Problems

The first book's images were hilariously bad. They were so bad that it was part of the humor. We would all laugh at the incredibly silly images, but immediately, my kids would start to point out all the inconsistencies of the images on each page. 

* Why doesn't the book's Sasha look at all like her?
* Why does she have long brown hair on one page, short on another, and orange hair somewhere else?
* Why do the clothes change on every single page?
* Why do the age, height, etc, vary constantly?

![Images From Sasha and the 3 little pigs](/assets/img/early_sasha_book.webp)
![Image From Theo and the Squirrels](/assets/img/a_theo2_squ.png)
> These images were from Dalli-2 and early stable diffusion. I covered some of the processes in a post, [Ai Book Building](fun/2022/12/20/ai-book-building).

## Early Attempts to Improve the Images

I started trying a few methods to improve the quality of the images created.

### Improved and Consistent Image Prompts

My first attempts to resolve this were just improved prompts. I would add a trick that would regularize the image prompt with additional details describing the character whenever they were to be in the illustration. This was slightly better, but not by much. Most of the quality improvements were from improved Stable Diffusion models.

![Theo The Astronaut](/assets/img/theo_promots.webp)
![A Purple Wizard](/assets/img/purple_wizard.webp)
![Wilbur the Whale](/assets/img/whale_mountains.webp)
> Prompts included consistent characters Theo the astronaut, a purple good wizard, and Wilbur the Whale

### Image2Image Support

I next allowed the book creator to select and upload images that would be used along with image2image and prompts to generate semi-recognizable images that were stylized across the book. The Img2Img technique had several problems:

* You end up wanting a unique image per page
* The closer the initial image is to the actual desired content, the better quality
* If the photos aren't consistent, neither is the output
* The output quality was hit-and-miss
* It was extremely time-consuming, now resulting in photo shoots just to seed the book generation
* I don't want to upload a bunch of pictures of my kids to any of the cloud AI companies, so I run it all locally on my own machine

I was stuck at this for a while, so I made a post about the process of using [img2img to make book covers](/software/2023/02/27/making-book-covers-with-img2img). Combining this with different Stable Diffusion models and styles can get good results, but sometimes it takes many iterations or is difficult to get a cartoon or children's book illustration-like style while also still being recognizable as the character.

![img2img results](/assets/img/dr_sasha-COLLAGE.webp)
> While time-consuming, this technique allowed me to put my kids into their books finally

# Training LoRA models

> "A LoRA diffusion model is a type of model that uses Low-Rank Adaptation (LoRA) to fine-tune a diffusion model for a specific domain, character, style, or concept"
-- [LoRA Models can be trained in the cloud](https://civitai.com/articles/2099/lora-models-and-how-to-use-them-with-stable-diffusion-by-thinkdiffusion)

Eventually, I learned how to take a small collection of high-quality images of one of my kids and train a LoRA model. The tools for local training are a bit hard to work with, but they also can be run in the cloud fairly quickly. Making a LoRA model for use to generate images on a local machine takes about one hour of machine time on my RTX 480. After some trial and error, I can build Stable Diffusion 1.5 or XL models that could fairly frequently build recognizable characters in any situation. The quality of any given image varied a lot, and the older Stable Diffusion models couldn't set scenes in the books very well. It was close, but not good enough to take the quality of the books to the next level. Combining this technique and custom Stable Diffusion models that better match the scene/theme of the book would help, but only a little, and it was a lot of work. These could occasionally produce very good results, but a large number of image generations per page were required.

![img2img results](/assets/img/lora-COLLAGE.webp)
> Training local LoRA models, was a pretty big breakthrough in terms of more easily making repeatable recognizable characters

I will post on how to train LoRAs on your local machine sometime easily, but you can check out [Flux Gym](https://github.com/cocktailpeanut/fluxgym) to get started.

# Flux LoRA Models

The next big breakthrough came when Flux dev was released. This image model was far superior in building scenes from prompts, so you could put characters in any scene the book would require... The trick of detailed descriptions of a character and a scene also went a long way. However, now I have seen how recognizable and good a trained LoRA model could look with image models. I needed a way to generate Flux LoRA models, but on my RTX 4080 graph card with 16GB of RAM (or I could get it all running in the cloud). The problem was that tooling for training local Flux LoRAs required 24GB, but folks kept tweaking things and layering various improvements. It is slow, but folks are training models on 8GB graphic cards these days.

I can now take a small, high-quality collection of photos of my subject and generate a pretty good Flux LoRA in about 1 hour on my local machine. Example images for input are below.

![Sasha Images](/assets/img/sasha_images.webp)
> Example training set of images, this trains a person model with a focus mostly on the face, but will capture basic size / age

# Consistent Characters

Now, after spending a bit more time and getting better at training LoRA models and improving the tools, I can fairly easily build a model for any character I want. I generally just need 30-40 images and a bit of time cropping and adjusting the image inputs. You can do this quickly, but the better your input images are, the better your model turns out; I am sure I can improve my process of collecting the input images, but the output quality is already good enough for making fun and easily recognizable consistent characters across one of my kid's book ideas. You can get consistent outfits with a few details in the prompt, you can get wildly imaginative scenes. It is easy to generate various styles: 2d, 3d, photo-realistic, cartoon, watercolor, etc.

I now have LoRA models of the whole family and can generate funny and silly images. The kids enjoy just requesting silly images, not even full books now. The styles for the image outputs are very flexible, from oil paintings to movie animation styles.

![Random Lora Images](/assets/img/fun_family.webp)
> A bunch of random LoRA images showing the variety

# A prompt across LoRA Models

To give a bit more of an idea of how the training works and the output it produces, here are a few sample prompts and the output images showing my family inserted into book themes.

![img2img results](/assets/img/ai_cowboy.webp)
> Prompt "ultra-realistic photo of ((MODEL_TARGET_NAME dressed in a cowboy hat and jeans)), hyper detail, cinematic lighting, magic neon, Canon EOS R3, Nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K"

![img2img results](/assets/img/family_space.webp)
> Prompt "a colorful cartoon image of ((MODEL_TARGET_NAME as an astronaut in space)), hyper detail, cinematic lighting, colorful, 8K"

I build all of these books using a custom Rails app that can use local or remote text and image generators. I will like share some more posts on some of the scripts and code that makes it easier to automate all these processes.
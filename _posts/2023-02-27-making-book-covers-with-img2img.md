---
layout: posttail
title: "Making Book Covers with Img2Img"
image: /assets/img/wizard_progress.png
category: Software
tags: [Software, Fun, Tips, Learning, AI, Books, Stable Diffusion, Art]
---
{% include JB/setup %}

I have been having fun making [children's books with my kids using AI](https://www.mayerdan.com/fun/2022/12/20/ai-book-building). I have been working on some techniques to make them even more personalized. I have recently been building some of the images for the books using image-to-image. I will describe a bit of the process and some of the options I use.

# Examples

Below are some examples of the kinds of image options I get when working from photos to make images for the books.

[![A young girl as a puppy doctor](/assets/img/aDocSashaCollage.jpeg)](https://www.amazon.com/dp/B0BW3G1491)  
[![A young boy wizard](/assets/img/aboywizard-collage.png)](https://www.amazon.com/dp/B0BV3732Y8)

# Book Cover Process

If you want to make a similar stylized book cover or image, my basic outline is below.

1. Get a good description of the image you want. In my example, "A young boy pointing a magic wand and casting a spell."
2. Capture a photo that will fit the theme
  * This is a fun part with my kiddos. We might dress up with Halloween costumes, setup some scenery or backgrounds
  * the closer the original image is to what you are looking for the better you will be able to bring your kid into the book
3. either use a local stable diffusion img2img script or an online free tool
  * I have been using Ruby scripts to run stable diffusion batch jobs locally
  * You can also often find a [free hugging face stable diffusion web-ui model and use the img2img tab](https://huggingface.co/spaces/DucHaiten/webui)
4. Generate several images adjusting the "Denoising strength" to be more or less like your original image
5. Photoshop or edit to adjust any other details

![Example using huggingface web-ui](/assets/img/awizardhuggingface.png)
> example of generating options while using the huggingface free web ui models

# What does adjusting Denoising strength do?

Stable Diffusion Denoising Strength is documented as:

> Determines how little respect the algorithm should have for image's content. At 0, nothing will change, and at 1 you'll get an unrelated image. With values below 1.0, processing will take less steps than the Sampling Steps slider specifies.

As it states, the closer to zero the more like the original image it will be, by the time it is 1, you are just getting images based on the text prompt you provide. The input image will be ignored. I personally find that `0.4 - 0.6` is the best range for my use cases.

![The impact of a wizard image when increasing the enoising Strength](/assets/img/wizard_progress.png)
> the original image with a few examples of images generated while adjusting the denoising strength

# What's next?

I am looking at ways that I can improve the continuity of the style and look of the characters across pages. If I could seed a book with 3-4 photos of my kids possibly in custom for the theme, could I have all pages make not just a little boy who is an astronaut, but make them all look like the same little boy, etc?

If you want to see any of the completed books, the links below are to the amazon pages for the books. As I am still new to this, the later books, I believe to be better than the first few. I have a couple more that are nearly ready to be published.

* [Theo & The Three Squirrels](https://www.amazon.com/dp/B0BPG9GNFL)
* [Sasha & The Three Little Pigs](https://www.amazon.com/dp/B0BHSZF1QG)
* [Theo the Great: The World At Sleep](https://www.amazon.com/dp/B0BV3732Y8)
* [Sasha The Puppy Doctor](https://www.amazon.com/dp/B0BW3G1491)
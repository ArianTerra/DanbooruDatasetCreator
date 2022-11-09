## About

I created this app so I could easily crop images from danbooru to form a dataset for Stable Diffusion training.

I was too lazy to crop images in photoshop and copy-paste tags from danbooru so I spent 3 days creating this program lol.

It can download images from danbooru/safebooru. Also it loads image tags to tag field. Tags from this field are written to txt file next to the cropped images. You can also load an image from your PC, but you have to add tags for it manually.

All images are cropped to 512x512px. They're stored in wwwroot/images folder.

Why ASP .NET? Because I'm bad at Python and I developed this project for myself. Also I cannot launch automatic1111 stability diffusion webui on my PC, so idk how to develop a plugin for it.

## Checklist

- [x] Basic cropping functionality
- [x] Tag loading from danbooru post
- [ ] Default image (there's a cat picture for now)
- [ ] Checkboxes for removing image author from tag field and meta tags like 'absurdres'
- [ ] Rotating and mirroring image
- [ ] Setting custom crop size
- [ ] Better manual tag input
- [ ] Download all files in zip
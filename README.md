# hexo-lazyload

**hexo-lazyload** is a hexo plugin which is use IntersectionObserver api to improve the performance of lazy-load images.


## Install

```bash
$ npm install hexo-lazyload --save

// or

$ yarn add hexo-lazyload
```

## Usage

First add configuration in `_config.yml` from your hexo project.

```yaml
lazyload:
  enable: true
  className: #optional e.g. .J-lazyload-img
  loadingImg: #optional eg. ./images/loading.png
```

**loadingImg**
- default: '/js/lazyload-plugin/loading.svg'
- If you want to customize the image, just fill the path. don't forget to copy the image to your themes folder.

**className**
- by default, lazy-load all post images.
- if not null, only lazy-load the images with this className. (hexo && markdown support html syntax.)


Run hexo command.

```bash
$ hexo clean && hexo g
```

## Demo

[robin-front.github.io](https://robin-front.github.io)

# hexo-lazyload | [简体中文](#简体中文)

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
  # className: #optional e.g. .J-lazyload-img
  # loadingImg: #optional eg. ./images/loading.png
```

**loadingImg**
- default: '/js/lazyload-plugin/loading.svg'
- If you want to customize the image, just fill the path. don't forget to copy the image to your themes folder.

**className**
- by default, lazy-load all post images.
- if not null, only lazy-load the images with this className(with '#' for ID or '.' for className). (P.S. hexo && markdown support html syntax.)


Run hexo command.

```bash
$ hexo clean && hexo g
```

## Demo

[robin-front.github.io](https://robin-front.github.io)

## TODO

- [x] lazy-load
- [ ] medium effect

# 简体中文

**hexo-lazyload** 是一个 hexo 插件，使用 IntersectionObserver API， 并附加了 polyfill, 在现代浏览器的环境下，要比传统 lazyload 写法具有更高性能。

## 安装

```bash
$ npm install hexo-lazyload --save

// or

$ yarn add hexo-lazyload
```

## 使用

首先在你的 hexo 项目下的 `_config.yml` 添加配置

```yaml
lazyload:
  enable: true
  # className: #可选 e.g. .J-lazyload-img
  # loadingImg: #可选 eg. ./images/loading.png
```

**loadingImg**
- 默认路径: '/js/lazyload-plugin/loading.svg'
- 如果需要自定义，添填入 loading 图片地址，如果是本地图片，不要忘记把图片添加到你的主题目录下。

**className**
- 默认会延迟加载文章中的所有图片。
- 如果不为空，请填入 ID（带 # 号）， 或 css 类名(带 . 号)【ps. hexo 和 markdown 语法支持 html 语法】


运行 hexo 命令

```bash
$ hexo clean && hexo g
```

## Demo

[robin-front.github.io](https://robin-front.github.io)

## TODO

- [x] lazy-load
- [ ] medium effect


# hexo-lazyload | [english doc](./readme.md)

**hexo-lazyload** 是一个 hexo 插件，使用 IntersectionObserver API， 并附加了 polyfill, 在现代浏览器的环境下，要比传统 lazyload 写法具有更高性能。

特点：

- 自动生成缩略图（150x150）(包括远程图片和本地图片)
- 使用 IntersectionObserver API（自带polyfill）实现 lazyload
- medium effect

![](./assert/hexo-lazyload.gif)

## 安装

这个包依赖 `gm` 来生成缩略图，所以请先安装相关依赖 [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/)。如果是 mac,可以使用以下命令：

```bash
brew install imagemagick
brew install graphicsmagick
```
然后，安装本 npm 包：

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
  # thumbPath: '/images/thumb'
  # className: #可选 e.g. .J-lazyload-img
  # loadingImg: #可选 eg. /images/loading.png
```

**thumbPath**
- 缩略图路径（绝对路径，根目录为 `public/`）

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
- [x] medium effect
- [x] generate thumbnail(local & remote)
- [x] hash thumbnail name
- [x] custom thumbnail path

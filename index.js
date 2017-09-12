'use strict';
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp')

const config = hexo.config;
const lazyload = config.lazyload;

if (!lazyload || !lazyload.enable) { return; }

const defaultImagePath = path.resolve(__dirname, './lib/default-image.json');

lazyload.loadingImg = lazyload.loadingImg||'/js/lazyload-plugin/loading.svg';

const addScript = (src, content) => content + `<script src="${src}"></script>`
const addStyle = (src, content) => content + `<link rel="stylesheet" href="${src}">`

const existFile = path => new Promise((resolve, reject) => fs.exists(path, (exists) => resolve(exists)))

const mkdir = dpath => new Promise((resolve, reject) => mkdirp(path.dirname(dpath), err => err? reject(err): resolve(dpath)))

const copyFile = (origin, dest) => fs.createReadStream(origin).pipe(fs.createWriteStream(dest))

const copyFileInExist = (origin, dest) =>
  existFile(dest).then(exists => {
    exists? null : mkdir(dest).then(() => copyFile(origin, dest))
    }
  )

const copyAssets = (libPath, pluginPath) => {
  copyFileInExist(path.join(libPath, 'lazyload.intersectionObserver.min.js'), path.join(pluginPath, 'lazyload.intersectionObserver.min.js'));
  copyFileInExist(path.join(libPath, 'loading.svg'), path.join(pluginPath, 'loading.svg'));
}

const transformHTML = source => {
  const className = lazyload.className;
  if (className) {
    const $ = cheerio.load(source);
    $(className).each((i,s) => {
      transformImg($(s));
    });
    return $.html();
  } else {
    return source.replace(/<img([^>]+)?>/igm, s => transformImg(s));
  }
}

const transformImg = s => {
  const $ = cheerio.load(s);
  const $img = typeof s === 'string' ? $('img') : s;
  const attr = $img.attr('src');
  $img.attr('src', lazyload.loadingImg);
  $img.attr('data-original', attr);
  return $.html('img');
}

const lazyloadPlugin = data => {
  const baseDir = hexo.base_dir;
  const libPath = path.resolve(__dirname, 'lib');
  const pluginPath = path.resolve(hexo.base_dir, 'public/js/lazyload-plugin');

  copyAssets(libPath, pluginPath)
  data.content = addScript('/js/lazyload-plugin/lazyload.intersectionObserver.min.js', data.content);
  data.content = transformHTML(data.content);
  return data;
}

hexo.extend.filter.register('after_post_render', lazyloadPlugin);

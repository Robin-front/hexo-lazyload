'use strict';
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');
const gm = require('gm');
const request = require('request');
const crypto = require('crypto');
const url = require('url');
const async = require('async');

const config = hexo.config;
const lazyload = config.lazyload;

if (!lazyload || !lazyload.enable) {
  return;
}

const loadingImgPath = lazyload.loadingImg || '/js/lazyload-plugin/loading.svg';
const thumbPath = lazyload.thumbPath || './images/thumb';
const thumbTargetFolder = path.resolve(hexo.base_dir, 'public/', thumbPath);
const assetsList = ['lazyload.intersectionObserver.min.js', 'loading.svg'];

const error = err => hexo.log.error(err);
const log = err => hexo.log.info(err);
const debug = err => hexo.log.debug(err);
const addScript = (src, content) => content + `<script type="text/javascript" charset="utf-8">!function(){var r=document.querySelectorAll("script");if(Array.prototype.some.call(r,function(r){return r.src&&-1!=r.src.indexOf("${src}")}))return!1;var e=document.createElement("script");e.setAttribute("src","${src}"),document.body.appendChild(e)}();</script>`
const addStyle = (src, content) => content + `<link rel="stylesheet" href="${src}">`

const isRemotePath = str => str.indexOf('http') !== -1;

const isImg = str => /\/([^/]+\.(?:png|jpg|jpeg|gif|bmp))/i.test(str);
const getHashFileName = fpath => {
  const extname = path.extname(url.parse(fpath).pathname);
  const hash = crypto.createHash('md5').update(fpath).digest("hex");
  return hash + extname;
};

const existFile = path => new Promise((resolve, reject) => fs.exists(path, (exists) => resolve(exists)));

const mkdir = dpath => new Promise((resolve, reject) => mkdirp(dpath, err => err ? reject(err) : resolve(dpath)));

const copyFile = (origin, dest) => fs.createReadStream(origin).pipe(fs.createWriteStream(dest));

const copyFileInExist = async (origin, dest) => {
  const exists = await existFile(dest);
  if (!exists) {
    await mkdir(path.dirname(dest));
    copyFile(origin, dest);
  }
};

const copyAssets = () => {
  const libPath = path.resolve(__dirname, 'lib');
  const pluginPath = path.resolve(hexo.base_dir, 'public/js/lazyload-plugin');
  for (let file of assetsList) {
    const origin = path.join(libPath, file);
    const dest = path.join(pluginPath, file);
    copyFileInExist(origin, dest).catch(err => error('copyAssets error:', err));
  }
};

const transformHTML = source => {
  const className = lazyload.className;
  if (className) {
    const $ = cheerio.load(source);
    $(className).each((i, s) => {
      transformImg($(s));
    });
    return $.html();
  } else {
    return source.replace(/<img([^>]+)?>/igm, s => transformImg(s));
  }
};

let waitForThumb = [];
const transformImg = s => {
  const $ = cheerio.load(s);
  const $img = typeof s === 'string' ? $('img') : s;
  const attr = $img.attr('src');
  if (!isImg(attr)) {
    return s;
  }
  if (waitForThumb.indexOf(attr) === -1) {
    waitForThumb.push(attr);
  }
  $img.attr('src', loadingImgPath);
  $img.attr('data-original', attr);
  $img.attr('data-thumb', path.join('/', thumbPath, getHashFileName(attr)));
  $img.css('position', 'absolute');
  $img.css('left', '0');
  $img.css('right', '0');
  $img.css('z-index', '1');

  const parent = $('<div style="position:relative;"></div>')
  $img.wrap(parent);
  return $.html();
}

const generateThumb = async (originPath) => {
  if (!originPath || !isImg(originPath)) {
    return false;
  }
  const hashFileName = getHashFileName(originPath);
  const targetPath = path.resolve(thumbTargetFolder, hashFileName);
  const exists = await existFile(targetPath);
  if (!exists) {
    return await gmAsync(originPath, targetPath);
  };
}

const gmAsync = async (originPath, targetPath) => await new Promise((resolve, reject) => {
  gm(getOriginImage(originPath))
    .thumbnail(200, 200)
    .quality(8)
    .write(targetPath, function (err, res) {
      if (err) {
        error('gm: ' + 'fail to generate thumb of ' + originPath);
        error(err);
        reject(err);
      } else {
        log('gm: ' + originPath + ' generate thumb successed');
        resolve(targetPath);
      }
    });
});

const getOriginImage = originPath => {
  if (isRemotePath(originPath)) {
    return request(originPath);
  } else {
    return path.join(hexo.base_dir, 'source', originPath);
  }
}

hexo.extend.filter.register('before_post_render', async function (data) {
  await mkdir(thumbTargetFolder);
});

hexo.extend.filter.register('after_post_render', function (data) {
  copyAssets();
  data.content = addScript('/js/lazyload-plugin/lazyload.intersectionObserver.min.js', data.content);
  data.content = transformHTML(data.content);
  return data;
});

hexo.extend.filter.register('after_generate', async function loopPipe() {
  log('start processing thumb');
  return await async.mapLimit(waitForThumb, 5, async function (url) {
    const response = await generateThumb(url);
    return response;
  }, (err) => {
    if (err) throw err;
    // results is now an array of the response bodies
    // console.log('results', results)
    log('All thumb process successed !');
  });
});
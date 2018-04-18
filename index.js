"use strict";
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const url = require("url");
const cheerio = require("cheerio");
const mkdirp = require("mkdirp");
const gm = require("gm");
const request = require("request");
const QueueMaplimit = require("queue-maplimit");

const config = hexo.config;
const lazyload = config.lazyload;

if (!lazyload || !lazyload.enable) {
  return;
}

const concurrency = lazyload.concurrency || 5;
const loadingImgPath = lazyload.loadingImg || "/js/lazyload-plugin/loading.svg";
const thumbPath = lazyload.thumbPath || "/images/thumb";
const thumbTargetFolder = path.join(hexo.public_dir, thumbPath);
const assetsList = ["lazyload.intersectionObserver.min.js", "loading.svg"];

const error = err => hexo.log.error(err);
const warn = err => hexo.log.warn(err);
const log = err => hexo.log.info(err);
const debug = err => hexo.log.debug(err);

const isRemotePath = str => str.indexOf("http") !== -1;
const isImg = str => /\/([^/]+\.(?:png|jpg|jpeg|gif|bmp))/i.test(str);
const getHashFileName = fpath => {
  const extname = path.extname(url.parse(fpath).pathname);
  const hash = crypto
    .createHash("md5")
    .update(fpath)
    .digest("hex");
  return hash + extname;
};

const existFile = path =>
  new Promise((resolve, reject) => fs.exists(path, exists => resolve(exists)));

const mkdir = dpath =>
  new Promise((resolve, reject) =>
    mkdirp(dpath, err => (err ? reject(err) : resolve(dpath)))
  );

const copyFile = (origin, dest) =>
  fs.createReadStream(origin).pipe(fs.createWriteStream(dest));

const copyFileInExist = async (origin, dest) => {
  const exists = await existFile(dest);
  if (exists) {
    return;
  }

  await mkdir(path.dirname(dest));
  copyFile(origin, dest);
};

const copyAssets = () => {
  const libPath = path.resolve(__dirname, "lib");
  const pluginPath = path.resolve(hexo.public_dir, "js/lazyload-plugin");
  for (let file of assetsList) {
    const origin = path.join(libPath, file);
    const dest = path.join(pluginPath, file);
    copyFileInExist(origin, dest).catch(err => error("copyAssets error:", err));
  }
};

const collectImages = source => {
  const className = lazyload.className || "img";
  const $ = cheerio.load(source);

  const waitForThumb = [];

  $(className).each((i, s) => {
    const attr = $(s).attr("src");
    if (isImg(attr) && waitForThumb.indexOf(attr) === -1) {
      waitForThumb.push(attr);
    }
  });
  return waitForThumb;
};

const generateThumb = async originPath => {
  if (!originPath || !isImg(originPath)) {
    return;
  }

  const hashFileName = getHashFileName(originPath);
  const outputPath = path.resolve(thumbTargetFolder, hashFileName);

  const exists = await existFile(outputPath);
  if (exists) {
    return;
  }

  const targetRelativePath = path.join(thumbPath, hashFileName);
  return await gmAsync(originPath, outputPath, targetRelativePath);
};

const gmAsync = async (originPath, outputPath, targetPath) =>
  await new Promise(async (resolve, reject) => {
    try {
      const input = getOriginImage(originPath);
      let size;
      // if (typeof input === "object") {
      //   setTimeout(() => {
      //     input.abort();
      //     reject();
      //   }, 10000);
      // }
      gm(input)
        .size(function(err, result) {
          if (err) {
            reject(err);
          } else {
            size = result;
          }
        })
        .thumbnail(60, 60)
        .write(outputPath, function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve({ originPath, targetPath, size });
          }
        });
    } catch (err) {
      reject();
    }
  });

const getOriginImage = originPath => {
  if (isRemotePath(originPath)) {
    return request({ url: originPath, timeout: 5000 }).on("error", err => {
      if (err.code === "ETIMEDOUT") {
        warn("request remote img fail because timeout " + originPath);
      } else {
        warn("request remote img fail " + originPath);
      }
    });
  } else {
    return path.join(hexo.source_dir, originPath);
  }
};

const dealWithContent = (html, thumbMap) => {
  const className = lazyload.className || "img";
  const $ = cheerio.load(html, { decodeEntities: false });
  $(className).each((index, el) => {
    const $el = $(el);
    const src = $el.attr("src");
    let thumb;
    const hasThumb = thumbMap.some(obj => {
      if (obj === undefined) {
        return false;
      }
      if (obj.originPath === src) {
        thumb = obj;
        return true;
      }
      return false;
    });
    if (hasThumb && thumb.size) {
      const { size, targetPath } = thumb;
      $el
        .attr("class", "progress-images--original")
        .attr("src", loadingImgPath)
        .attr("data-original", src)
        .attr("data-thumb", targetPath);
      const parent = $(
        `<div class="progress-images" style="width:${size.width}px"></div>`
      );
      $el.wrap(parent);
      const sizeRate = size.height * 100 / size.width;
      const placeholder = $(
        `<div class="progress-images--placeholder" style="padding-bottom: ${sizeRate}%;"></div>`
      );
      $el.before(placeholder);
    }
  });
  return $.html();
};

const queue = new QueueMaplimit(concurrency);
const afterPostRender = data =>
  new Promise(resolve => {
    let imgArr = collectImages(data.content);
    queue
      .add(imgArr, async function(url) {
        return await generateThumb(url).catch(err => {
          warn("generateThumb fail " + url);
          return null;
        });
      })
      .then(thumbMap => {
        thumbMap = thumbMap.filter(obj => !!obj);
        resolve(thumbMap);
        debug(data.source + "All thumb process successed !");
      });
  })
    .then(thumbMap => {
      data.content = dealWithContent(data.content, thumbMap);
      return data;
    })
    .catch(err => {
      error("after_post_render error ", err);
      return data;
    });

const afterGenerate = () => {
  const route = hexo.route;
  var routes = route.list().filter(path => path.endsWith(".html"));
  const map = routes.map(path => {
    return new Promise((resolve, reject) => {
      const html = route.get(path);
      let htmlTxt = "";
      html.on("data", chunk => (htmlTxt += chunk));
      html.on("end", () => {
        const $ = cheerio.load(htmlTxt, { decodeEntities: false });
        $("body").append(
          `<script type="text/javascript" charset="utf-8" src="/js/lazyload-plugin/lazyload.intersectionObserver.min.js"></script>`
        );
        resolve({ path, html: $.html() });
      });
    });
  });

  return Promise.all(map).then(res =>
    res.map(obj => {
      route.set(obj.path, obj.html);
    })
  );
};

hexo.extend.filter.register("before_post_render", async function(data) {
  await mkdir(thumbTargetFolder);
});
hexo.extend.filter.register("after_post_render", afterPostRender);
hexo.extend.filter.register("before_generate", function(data) {
  copyAssets();
});
hexo.extend.filter.register("after_generate", afterGenerate);

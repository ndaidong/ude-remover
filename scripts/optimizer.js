// scripts / optimizer

const {
  readdirSync,
} = require('fs');

const {
  extname,
  basename,
} = require('path');

const {execSync} = require('child_process');

const {
  createId,
} = require('bellajs');

const {load} = require('cheerio');
const mkdirp = require('mkdirp').sync;

const {
  info,
} = require('./logger');

const readFile = require('./readFile');
const writeFile = require('./writeFile');

const extractHTML = require('./extractHTML');
const minifyJS = require('./minifyJS');
const minifyCSS = require('./minifyCSS');
const minifyHTML = require('./minifyHTML');

const optimizeJS = (jsfiles) => {
  return jsfiles.map((file) => {
    return readFile(file);
  }).map((content) => {
    return minifyJS(content);
  }).join('\n');
};

const optimizeCSS = (cssfiles) => {
  return cssfiles.map((file) => {
    return readFile(file);
  }).map((content) => {
    return minifyCSS(content);
  }).join('\n');
};

const optimizeHTML = (input) => {
  let {html, jsmin, cssmin, file, source, dest} = input;

  let cssDir = `${dest}/css`;
  let jsDir = `${dest}/js`;

  mkdirp(cssDir);
  mkdirp(jsDir);

  let rev = createId();
  let $ = load(html);

  let fileName = basename(file, '.html');
  let outputHTMLFile = `${dest}/${fileName}.html`;

  if (cssmin) {
    let outputCSSFile = `${cssDir}/${fileName}.min.css`;
    writeFile(outputCSSFile, cssmin);
    let styleTag = `<link rel="stylesheet" type="text/css" href="css/${fileName}.min.css?rev=${rev}">`;
    $('head').append(styleTag);
  }

  if (jsmin) {
    let outputJSFile = `${jsDir}/${fileName}.min.js`;
    writeFile(outputJSFile, jsmin);
    let scriptTag = `<script type="text/javascript" src="js/${fileName}.min.js?rev=${rev}"></script>`;
    $('body').append(scriptTag);
  }

  let sHTML = minifyHTML($.html());

  writeFile(outputHTMLFile, sHTML);

  execSync(`cp -R ${source}/images ${dest}/images`);

  let manifest = readFile(`${source}/manifest.json`);
  let json = JSON.parse(manifest);
  json.content_scripts[0].js = [`js/${fileName}.min.js`];

  json.background.scripts.map((f) => {
    execSync(`cp -R ${source}/${f} ${dest}/${f}`);
  });
  writeFile(`${dest}/manifest.json`, JSON.stringify(json));
};

const optimize = (source, dest) => {
  return readdirSync(source).filter((file) => {
    return extname(file) === '.html';
  }).map((file) => {
    let f = `${source}/${file}`;
    let html = readFile(f);
    return {data: extractHTML(html, source), file};
  }).map(({data, file}) => {
    let {html, js, css} = data;
    info(js, css);
    let jsmin = optimizeJS(js);
    let cssmin = optimizeCSS(css);
    return optimizeHTML({html, jsmin, cssmin, file, source, dest});
  });
};

module.exports = {
  optimize,
};

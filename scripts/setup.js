#!/usr/bin/env node

const {
  existsSync,
} = require('fs');
const exec = require('child_process').execSync;
const mkdirp = require('mkdirp').sync;

const {
  info,
} = require('./logger');

const download = (file) => {
  let {
    src, dest,
  } = file;
  info('Downloading %s ...', src);
  exec(`wget -O ${dest} ${src}`);
  info('Downloaded %s', dest);
};

const setup = () => {
  let {builder} = require('../package');
  let {vendorDir, css, javascript} = builder;

  if (!existsSync(vendorDir)) {
    mkdirp(vendorDir);
  }

  let cssDir = `${vendorDir}/css`;
  let jsDir = `${vendorDir}/js`;

  let cssFiles = [];

  for (let k in css) {
    if (css[k]) {
      cssFiles.push({
        src: css[k],
        dest: `${cssDir}/${k}.css`,
      });
    }
  }

  let jsFiles = [];
  for (let k in javascript) {
    if (javascript[k]) {
      jsFiles.push({
        src: javascript[k],
        dest: `${jsDir}/${k}.js`,
      });
    }
  }

  if (cssFiles.length > 0) {
    if (!existsSync(cssDir)) {
      mkdirp(cssDir);
    }
    cssFiles.map(download);
  }

  if (jsFiles.length > 0) {
    if (!existsSync(jsDir)) {
      mkdirp(jsDir);
    }
    jsFiles.map(download);
  }
};

setup();

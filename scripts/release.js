#!/usr/bin/env node

const {
  existsSync,
  writeFileSync,
  readFileSync,
} = require('fs');
const exec = require('child_process').execSync;
const mkdirp = require('mkdirp').sync;

const updateVersion = (file, version) => {
  let manifest = readFileSync(file, 'utf8');
  let json = JSON.parse(manifest);
  json.version = version;
  return writeFileSync(file, JSON.stringify(json), 'utf8');
};

const release = () => {
  let releaseDir = 'releases';

  if (!existsSync(releaseDir)) {
    mkdirp(releaseDir);
  }

  let {version} = require('../package');
  let dest = `${releaseDir}/v${version}`;
  if (existsSync(dest)) {
    exec(`rm -rf ${dest}`);
  }
  exec(`cp -R src ${dest}`);

  updateVersion(`${dest}/manifest.json`, version);
};

release();

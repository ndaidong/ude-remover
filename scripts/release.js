#!/usr/bin/env node

const {
  existsSync,
} = require('fs');

const {execSync} = require('child_process');

const mkdirp = require('mkdirp').sync;

const {
  optimize,
} = require('./optimizer');

const readFile = require('./readFile');
const writeFile = require('./writeFile');

const updateVersion = (file, version) => {
  let manifest = readFile(file);
  let json = JSON.parse(manifest);
  json.version = version;
  return writeFile(file, JSON.stringify(json), 'utf8');
};

const release = () => {
  let releaseDir = 'releases';

  if (!existsSync(releaseDir)) {
    mkdirp(releaseDir);
  }

  let {version} = require('../package');
  let dest = `${releaseDir}/v${version}`;
  if (existsSync(dest)) {
    execSync(`rm -rf ${dest}`);
  }
  let tmpDir = `${releaseDir}/temp`;
  if (existsSync(tmpDir)) {
    execSync(`rm -rf ${tmpDir}`);
  }
  execSync(`cp -R src ${tmpDir}`);

  updateVersion(`${tmpDir}/manifest.json`, version);

  optimize(tmpDir, dest);
};

release();

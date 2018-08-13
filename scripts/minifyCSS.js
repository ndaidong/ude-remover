// utils / minifyCSS

const {processString} = require('uglifycss');

const minifyCSS = (css) => {
  return processString(css, {uglyComments: true});
};

module.exports = minifyCSS;

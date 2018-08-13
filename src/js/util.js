/**
 * util.js
 * @ndaidong
 */

((name, factory) => {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    let root = window || {};
    if (root.define && root.define.amd) {
      root.define([], factory);
    } else if (root.exports) {
      root.exports = factory();
    } else {
      root[name] = factory();
    }
  }
})('util', () => {
  let getDomainFromURL = (url) => {
    let u = new URL(url);
    return u.hostname.replace('www.', '');
  };

  let getPatternsByDomain = (domain) => {
    return store.load(domain);
  };

  return {
    getDomainFromURL,
    getPatternsByDomain,
  };
});

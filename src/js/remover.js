/**
 * remover.js
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
})('remover', () => {
  let {queryAll} = realdom;

  let scan = (pattern) => {
    queryAll(pattern).map((el) => {
      return el.remove();
    });
  };

  return {
    scan,
  };
});

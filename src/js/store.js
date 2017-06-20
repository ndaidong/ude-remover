/**
 * store.js
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
})('store', () => {

  const DB_NAME = 'uder-data';

  var _data = Object.create(null);

  var init = () => {
    chrome.storage.sync.get(DB_NAME, (result) => {
      if (result) {
        _data = Object.assign(_data, result[DB_NAME]);
      }
    });
  };

  var backup = () => {
    let d = {};
    d[DB_NAME] = _data;
    chrome.storage.sync.set(d, (err) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }
    });
  };

  var save = (key, value) => {
    _data[key] = value;
    backup();
  };

  var load = (key) => {
    if (!key) {
      return _data;
    }
    return _data[key] || [];
  };

  init();

  return {
    save,
    load
  };
});

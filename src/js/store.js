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

  chrome.storage.sync.get(DB_NAME, (result) => {
    if (result) {
      _data = Object.assign(_data, result);
    }
  });

  var backup = () => {
    chrome.storage.sync.set({DB_NAME: _data}, () => {
      console.log('Settings saved');
    });
  };

  var save = (key, value) => {
    _data[key] = value;
    backup();
  };

  var load = (key) => {
    return _data[key] || null;
  };

  return {
    save,
    load
  };
});

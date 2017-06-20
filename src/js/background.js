var {
  getDomainFromURL,
  getPatternsByDomain
} = util;

var sendMessage = (tabid, data) => {
  chrome.tabs.sendMessage(tabid, data);
};

var updateIcon = (title, img, tabId) => {
  chrome.browserAction.setIcon({path: img, tabId});
  chrome.browserAction.setTitle({title, tabId});
};

var resolve = (tab, patterns = false) => {
  let {
    url
  } = tab;
  let domain = getDomainFromURL(url);
  if (domain) {
    if (patterns === '') {
      return updateIcon('The mission was completed', 'images/icon-disabled-24.png', tab.id);
    }
    patterns = getPatternsByDomain(domain);
    if (patterns && patterns.length > 0) {
      updateIcon('Resolved this webpage', 'images/icon-enabled-24.png', tab.id);
      return sendMessage(tab.id, {
        domain,
        patterns
      });
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let {
    key,
    patterns
  } = request;
  store.save(key, patterns);
  sendResponse();

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    resolve(tabs[0], patterns);
  });
});

chrome.tabs.onCreated.addListener(resolve);

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  return resolve(tab);
});

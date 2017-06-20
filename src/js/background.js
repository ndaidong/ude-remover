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

var resolve = (tab) => {
  let {
    url
  } = tab;
  let domain = getDomainFromURL(url);
  if (domain) {
    let patterns = getPatternsByDomain(domain);
    if (patterns && patterns.length > 0) {
      updateIcon('Resolved this webpage', 'images/icon-enabled-19.png', tab.id);
      sendMessage(tab.id, {
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
    resolve(tabs[0]);
  });
});

chrome.tabs.onCreated.addListener(resolve);

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  return resolve(tab);
});

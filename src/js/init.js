

var getCurrentTabUrl = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      var tab = tabs[0];
      resolve(`getCurrentTabUrl: ${tab.url}`);
    });
  });
};

var getTabUrl = (id) => {
  return new Promise((resolve) => {
    chrome.tabs.get(id, (tab) => {
      resolve(`getTabUrl: ${tab.url}`);
    });
  });
};


var setIcon = (title, img, tabId) => {
  chrome.browserAction.setIcon({path: {19: img}, tabId}, () => {
    console.log('Icon changed');
  });

  chrome.browserAction.setTitle({title, tabId}, () => {
    console.log('Title changed');
  });
};

var renderStatus = (statusText) => {
  let a = doc.get('app');
  let html = a.innerHTML;
  a.html([html, statusText].join('<br>'));
};

doc.ready(() => {
  getCurrentTabUrl().then(renderStatus);
});

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === 'complete') {
    setIcon('onUpdated', 'images/icon-enabled-19.png', tabId);
    renderStatus('onUpdated: ' + tab.url);
  }
});

chrome.tabs.onActivated.addListener((info) => {
  let {tabId} = info;
  setIcon('onActivated', 'images/icon-enabled-19.png', tabId);
  getTabUrl(tabId).then(renderStatus);
});

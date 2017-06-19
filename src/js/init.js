chrome.runtime.onMessage.addListener((request) => {
  let {
    patterns
  } = request;
  if (patterns) {
    patterns.map(blocker.resolve);
  }
});

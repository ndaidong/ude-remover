var {
  get,
  Event
} = realdom;

var {
  trim
} = bella;

var {
  getDomainFromURL,
  getPatternsByDomain
} = util;

let $inputDomain = get('inputDomain');
let $inputPatterns = get('inputPatterns');
let $btnSubmit = get('btnSubmit');
let $frmSave = get('frmSave');

var updatePopupWith = (url) => {
  let patterns = [];
  let domain = getDomainFromURL(url);
  if (domain) {
    patterns = getPatternsByDomain(domain);
  }
  console.log(domain, patterns);
  $inputDomain.value = domain;
  $inputPatterns.value = patterns.join('\n');
};

var disableForm = () => {
  $btnSubmit.disabled = true;
};

var enableForm = () => {
  $btnSubmit.disabled = false;
};

Event.on($frmSave, 'submit', (e) => {
  Event.stop(e);
  disableForm();

  let key = $inputDomain.value;
  let selectors = trim($inputPatterns.value);
  let patterns = selectors.length > 0 ? selectors.split('\n') : '';

  chrome.runtime.sendMessage({key, patterns}, () => {
    setTimeout(enableForm, 2000);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    let {
      url = ''
    } = tabs[0] || {};
    updatePopupWith(url);
  });
});

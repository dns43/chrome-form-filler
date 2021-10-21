import { printLine } from './modules/print';

function contentlog(s) {
  console.log('[content]: ' + s)
}
var pii_lbls = []

contentlog('Content script works!');
contentlog('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

var words = ["yyy", "xxx", "zzz"];

function store(findings) {
  chrome.storage.sync.set({ key: findings }, function () {
    contentlog('Storing ' + findings);
  });
}

function load_data_and_fill_form() {
  // TODO PERSISTENT STORAGE
  // Research API that persists data throughout opening/closing tabs, and even restarting chrome
  // Load Data from unique  key (e.g. use doument.URL instead of 'pii')
  // must also change how data is STORED in popup.jsx 
  var pii = {}
  chrome.storage.sync.get(['pii'], function (result) {
    contentlog('Loading: ' + JSON.stringify(result));
    pii = result['pii']
    enter(pii)
  });
}

function enter(fakeData) {
  // TODO REVERSE KEYLOGGER
  // implement an alternative option that enters data one key stroke at a time
  contentlog("Filling data: " + JSON.stringify(fakeData, null, 2))
  contentlog('Memorized lbls: ' + pii_lbls)

  let tag = 'input';
  const elts = document.getElementsByTagName(tag);
  for (var e of elts) {
    for (var attr of e.attributes) {
      if (attr.name.includes("label") || attr.name.includes("placeholder")) {
        pii_lbls.forEach((lbl) => {
          contentlog('Comparing ' + e.attributes.placeholder.value + ' and ' + lbl)
          if (e.attributes.placeholder.value == lbl && fakeData[lbl] != undefined) {
            e.value = fakeData[lbl];
          }
        });
      }
    }
  }
}

function labelscanner(elt) {
  // TODO LABEL RECOGNITION ENGINE:
  // So far this function supports 2 types of HTML input field labels,
  // 1. It finds the DT that corresponds to a DD tag  (probably  can be done without assuming siblibling relationship?)
  // 2. It finds lable and placeholder in the attribute list
  // We can extend this.
  // E.g. find the <label key-'asd'> to a given <input namne='asd'>
  if (elt.parentElement.nodeName == 'DD') {
    pii_lbls.push(elt.parentElement.previousElementSibling.innerText)
    return
  }
  for (var attr of e.attributes) {
    if (attr.name.includes("label") || attr.name.includes("placeholder")) {
      pii_lbls.push(attr.value)
    }
  }
  return
}

function get_pii_lbls() {
  let tag = 'input';
  contentlog('Getting all PII labels');
  const elts = document.getElementsByTagName(tag);
  for (var e of elts) {
    labelscanner(e)
  }
  contentlog('Found ' + pii_lbls);
  return pii_lbls
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case 'fillForm':
      contentlog('fillForm')
      load_data_and_fill_form();
      contentlog('asd' + fillers)
      //fillForm(JSON.stringify(fillers, null, 2));
      break;
    case 'headers':
      sendResponse('dummy');
      const pii_lbls = get_pii_lbls()
      contentlog('Listener got ' + pii_lbls + ' sending to storage now')
      store(pii_lbls)
      return true
      break;
    default:
      console.error('unknown api')
  }
});

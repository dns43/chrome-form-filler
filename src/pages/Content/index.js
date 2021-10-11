import { printLine } from './modules/print';

function contentlog(s) {
  console.log('[content]: ' + s)
}

contentlog('Content script works!');
contentlog('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

var words = ["yyy", "xxx", "zzz"];

function store(findings) {
  chrome.storage.sync.set({ key: findings }, function () {
    contentlog('Storing ' + findings);
  });
}

function fillForm(fakeData) {
  const formElements = document.querySelectorAll('form')[1].elements;
  const names = ['firstname', 'lastname', 'reg_email__', 'reg_passwd__'];

  names.forEach((name) => {
    document.querySelectorAll('form')[1].elements[name].value = fakeData[name];
  });
}

function get_first(tag) {
  contentlog('Getting all ' + tag);
  const qwe = document.getElementsByTagName(tag);
  const eins = qwe[0].textContent
  contentlog('Found ' + eins);
  return eins
}

function get_pii_lbls() {
  let tag = 'input';
  contentlog('Getting all PII labels');
  const elts = document.getElementsByTagName(tag);
  var pii_lbls = []
  for (var e of elts) {
    for (var attr of e.attributes) {
      if (attr.name.includes("label") || attr.name.includes("placeholder")) {
        pii_lbls.push(attr.value)
      }
    }
  }
  contentlog('Found ' + pii_lbls);
  return pii_lbls
}

function extract_inputs() {
  inputs = document.getElementsByTagName('input');
  var attributes = ["aria-label", "placeholder"]
  var collection = []
  for (i = 0; i < inputs.length; ++i) {
    console.log(inputs[i])
    for (j = 0; j < attributes.length; ++j) {
      if (inputs[i].getAttribute(attributes[j]) != null) {
        collection.push(inputs[i].getAttribute(attributes[j]))
      }
    }
  }
  collection.push('end')
  alert(JSON.stringify(collection))
  return collection
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case 'fillform':
      contentlog('fillform')
      //fillForm(message.fakeData);
      break;
    case 'headers':
      sendResponse('dummy');
      //const h1s = get_first('h1');
      const pii_lbls = get_pii_lbls()
      contentlog('Listener got ' + pii_lbls + ' sending to storage now')
      store(pii_lbls)
      return true
      break;
    default:
      console.error('unknown api')
  }
});

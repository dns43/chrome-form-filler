import { printLine } from './modules/print';

function contentlog(s) {
  console.log('[content]: ' + s)
}

contentlog('Content script works!');
contentlog('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

var words = ["yyy", "xxx", "zzz"];

function store(findings) {
  chrome.storage.sync.set({ key: words }, function () {
    console.log('Value is set to ' + words);
  });
}

function fillForm(fakeData) {
  const formElements = document.querySelectorAll('form')[1].elements;
  const names = ['firstname', 'lastname', 'reg_email__', 'reg_passwd__'];

  names.forEach((name) => {
    document.querySelectorAll('form')[1].elements[name].value = fakeData[name];
  });
}

function get_all(tag) {
  const qwe = document.getElementsByTagName(tag);
  const eins = qwe[0].textContent
  return eins
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
      const h1s = get_all('h1');
      store(h1s)
      return true
      break;
    default:
      console.error('unknown api')
  }
});

import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

function forward(findings) {
  chrome.runtime.sendMessage(findings);

}

function fillForm(fakeData) {
  const formElements = document.querySelectorAll('form')[1].elements;
  const names = ['firstname', 'lastname', 'reg_email__', 'reg_passwd__'];

  names.forEach((name) => {
    document.querySelectorAll('form')[1].elements[name].value = fakeData[name];
  });
}

function get_all_h1() {

  var headings = 'asd';
  const qwe = document.getElementsByTagName('h1');
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
      console.log('filling!');
      fillForm(message.fakeData);
      alert('done');
      break;
    case 'headers':
      console.log('getting labels!');
      const labels = get_all_h1();
      alert('done');
      alert(labels[0]);
      sendResponse(labels);
      break;
    default:
      alert('unknown api')
  }
});

import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

function fillForm(fakeData) {
  const formElements = document.querySelectorAll('form')[1].elements;
  const names = ['firstname', 'lastname', 'reg_email__', 'reg_passwd__'];

  names.forEach((name) => {
    document.querySelectorAll('form')[1].elements[name].value = fakeData[name];
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case 'fillform':
      console.log('filling!');
      fillForm(message.fakeData);
      alert('done');

      break;
  }
});

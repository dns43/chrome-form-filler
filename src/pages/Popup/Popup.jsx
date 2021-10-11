import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';


function popuplog(s) {
  console.log('[popup]: ' + s)
}

popuplog('This is the popup page.')

const fakeData1 = {
  firstname: 'matt',
  lastname: 'k',
  reg_email__: 'asf@gmail.com',
  reg_passwd__: 'asdfasdf',
  sex: 'true'
};

var boxes = ["VW", "Toyota", "Beamer"];

chrome.storage.sync.set({ key: boxes }, function () {
  popuplog('Value is set to ' + boxes);
});

//chrome.storage.sync.get(['key'], function (result) {
//  popuplog('Value currently is ' + result.key);
//  boxes = result.key;
//  popuplog('Boxes currently is ' + result.key);
//});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  var u = []
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Global Storage.onChange listener: Storage key "${key}" in namespace "${namespace}" changed.`,
      `Global Storage.onChange listener: Old value was "${oldValue}", new value is "${newValue}".`
    );
    if (Array.isArray(newValue)) {
      for (var i of newValue) {
        u.push(i)
      }
    }
    else {
      u.push(newValue)
    }
  }
  update(u)
});

function send2background(s, d) {
  try {
    popuplog('sending msg to bg')
    chrome.runtime.sendMessage({ type: s }, (response) => {
      // 3. Got an asynchronous response with the data from the background
      popuplog('received user data', response);
    });
  } catch (error) {
    console.error("sendMessageToBackground error: ", error);
    return null;
  }
}

function send2content(s, d) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { type: s, d }, function (response) {
      });
    });
  } catch (error) {
    console.error("sendMessageToContent error: ", error);
    return null;
  }
}

function db_request(pii) {
  popuplog('Requesting ' + pii + 'from DB')
  var test = {};
  for (let i of pii) {
    test[i] = 'mongodb'
  }
  return test;
}

function requestDecoy() {
  const pii_rqst = getCheckedBoxes()
  const decoy = db_request(pii_rqst)
  render_pii_response(decoy)
}

function getCheckedBoxes() {
  //var checkboxes = document.getElementsByTagName('input');
  //var checkboxesChecked = [];
  // loop over them all
  //for (var i = 0; i < checkboxes.length; i++) {
  // And stick the checked ones onto an array...
  //if (checkboxes[i].checked && checkboxes[i].type == 'checkbox') {
  //  checkboxesChecked.push(checkboxes[i]);
  //}
  var checkboxes = document.getElementsByTagName('input');
  var labels = document.getElementsByTagName('label');
  var checkboxesChecked = [];
  for (let x of checkboxes) {
    //console.log(x.checked)
    if (x.type == 'checkbox' && x.checked) {
      for (let y of labels) {
        //console.log(x.name)
        //console.log(y.attributes['for'].value)
        if (y.attributes['for'].value == x.name) {
          console.log(y.innerHTML)
          checkboxesChecked.push(y.innerHTML)
        }
      }
    }
  }
  // Return the array if it is non-empty, or null
  popuplog('checked checkboxes: ' + checkboxesChecked)
  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}


function render_pii_response(vals) {
  popuplog('rendering PII response: ' + Array.from(vals))
  const element =
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {Object.keys(vals).map(val => (
          <div key={val + 'div'}>
            <label htmlFor={vals[val]} key={vals[val] + 'lbl'}>{val}</label>
            <input type="text" id={val} name={val} key={val + 'box'} value={vals[val]}></input>
          </div>
        ))}
        <button onClick={update} key='update'>Update</button>
        <button onClick={() => send2content('headers')} key='headers'>Get headers</button>
        <button onClick={requestDecoy} key='requestDecoy'>Request Decoy</button>
      </header >
    </div >
  ReactDOM.render(element, document.getElementById('app-container'));
}

function update(vals) {
  popuplog('updating canvas to: ' + vals)
  const element =
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {vals.map(val => (
          <div key={val + 'div'}>
            <input type="checkbox" id={val} name={val} key={val + 'box'}></input>
            <label htmlFor={val} key={val + 'lbl'}>{val}</label>
          </div>
        ))}
        <button onClick={update} key='update'>Update</button>
        <button onClick={() => send2content('headers')} key='headers'>Get headers</button>
        <button onClick={requestDecoy} key='requestDecoy'>Request Decoy</button>
      </header >
    </div >
  ReactDOM.render(element, document.getElementById('app-container'));
}


const Popup = () => {

  //const [fakeData, setFakeData] = useState();

  //useEffect(() => {
  //  setFakeData(fakeData1)
  //}, []);


  //chrome.storage.onChanged.addListener(function (changes, namespace) {
  //  let key = Object.entries(changes)
  //  console.log(
  //    `LOCAL  Storage key "${key}" in namespace "${namespace}" changed.`
  //  );
  //  update()//
  //});

  function hello() {
    const element =
      <h1>Hello, world!</h1>
    ReactDOM.render(element, document.getElementById('app-container'));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {boxes ? boxes.map(box => (
          <div key={box + 'div'}>
            <input type="checkbox" id={box} name={box} key={box + 'box'}></input>
            <label htmlFor={box} key={box + 'lbl'}>{box}</label>
          </div>
        )) : (
          <button onClick={hello} key='hello'>Say Hi!</button>
        )
        }
        <button onClick={update} key='update'>Update</button>
        <button onClick={() => send2content('headers')} key='headers'>Get headers</button>
        <button onClick={requestDecoy} key='requestDecoy'>Request Decoy</button>
      </header >
    </div >
  );
};

export default Popup;
import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

var boxes = [];

//TODO URL
// Get current tabs URL and put in global variable
// s.t. we can use it as storage key and don't have to get it multiple times
// IDEAD:  Get URL before and after submit and store both

// TODO PERSISTENT STORAGE 1
// Overthink this initialization... is it necessary?
// If we cannot avoid it, get document.URL from conntent somehow
// Tipp: Use "send2content"
chrome.storage.sync.set({ key: boxes }, function () {
  popuplog('Value is set to ' + boxes);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  var u = []
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key == 'key') {
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
      rerender(u)
    }
  }
});

popuplog('This is the popup page.')

function popuplog(s) {
  console.log('[popup]: ' + s)
}

function store(findings) {
  // TODO PERSISTANT STORAGE
  // Research API that persists data throughout opening/closing tabs, and even restarting chrome
  // Must also change how data is LOADED in content.jsx
  chrome.storage.sync.set({ pii: findings }, function () {
    contentlog('Storing ' + findings);
  });
}

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

async function db_json_req(pii) {
  //const testobject = { language: 'Joker' };
  popuplog(JSON.stringify(testobject))
  let debug = false
  if (debug) {
    var url = 'http://blue1.cs.columbia.edu:5000/json'
    var testobject = { language: 'Joker' };
  }
  else {
    var url = 'http://blue1.cs.columbia.edu:5000/pii'
    var testobject = pii;
  }
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(testobject), // make pii
    headers: {
      'Content-Type': 'application/json'
    }
  });

  var r;

  if (response.status == 200) {
    try {
      popuplog('Parsing server response to JSON')
      const clone = response.clone()
      const names = await clone.json();
      popuplog("JSON:")
      popuplog(JSON.stringify(names, null, 2));
      popuplog('return')
      r = names
    } catch (err) {
      popuplog('JSON malformatted, error: ' + err + '; interpreting as TEXT instead')
      const names = await response.text()
      popuplog("TEXT:" + names)
      popuplog("TEXT:" + JSON.stringify(names))
    }
  } else {
    popuplog('request status' + response.status)
  }

  popuplog('render')
  render_pii_response(r)
  store(r)
}

function request_decoy() {
  const pii_rqst = get_checked_boxes()
  const decoy = db_json_req(pii_rqst)
  popuplog('lets render server resp')
  render_pii_response(decoy)
}

function get_checked_boxes() {
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
        <button onClick={() => send2content('headers')} key='headers'>Extract Labels</button>
        <button onClick={request_decoy} key='request_decoy'>Request Decoy</button>
        <button onClick={() => send2content('fillForm')} key='fillForm'>Stuff it!</button>
      </header >
    </div >
  ReactDOM.render(element, document.getElementById('app-container'));
}

function rerender(vals) {
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
        <button onClick={() => send2content('headers')} key='headers'>Extract Labels</button>
        <button onClick={request_decoy} key='request_decoy'>Request Decoy</button>
        <button onClick={() => send2content('fillForm')} key='fillForm'>Stuff it!</button>
      </header >
    </div >
  ReactDOM.render(element, document.getElementById('app-container'));
}

// TODO WORKFLOW
// On Extract Labels, IF pii for this site alredy in storage, THEN jump to Request  Decoy and offer Stuff It
// Tricky becasue rn popup reacts to onChangeListener, but what if no change event is triggered because data already exists?
// Solution: dont call send2content directly, call a wrapper that checks the storage and handles the situation
const Popup = () => {

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
        <button onClick={() => send2content('headers')} key='headers'>Extract Labels</button>
        <button onClick={request_decoy} key='request_decoy'>Request Decoy</button>
        <button onClick={() => send2content('fillForm')} key='fillForm'>Stuff it!</button>
      </header >
    </div >
  );
};

export default Popup;
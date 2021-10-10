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

chrome.storage.sync.get(['key'], function (result) {
  popuplog('Value currently is ' + result.key);
  boxes = result.key;
  popuplog('Boxes currently is ' + result.key);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `GLOBAL Storage key "${key}" in namespace "${namespace}" changed.`,
      `GLOBAL Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
  //update()
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


function update() {
  const element =
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div key={boxes + 'div'}>
          <input type="checkbox" id={boxes} name={boxes} key={boxes + 'box'}></input>
          <label htmlFor={boxes} key={boxes + 'lbl'}>{boxes}</label>
        </div>

        <button onClick={update} key='update'>Update</button>
        <button onClick={() => send2content('headers', fakeData)} key='headers'>Get headers</button>
      </header >
    </div >
  ReactDOM.render(element, document.getElementById('app-container'));
}


const Popup = () => {

  const test = 'asd'//send2background('get');

  popuplog('got test data from bg: ' + test)

  const [fakeData, setFakeData] = useState()

  useEffect(() => {
    setFakeData(fakeData1)
  }, []);


  chrome.storage.onChanged.addListener(function (changes, namespace) {
    let key = Object.entries(changes)
    console.log(
      `LOCAL  Storage key "${key}" in namespace "${namespace}" changed.`
    );
  });

  function hello() {
    const element =
      <h1>Hello, world!</h1>
    ReactDOM.render(element, document.getElementById('app-container'));
  }


  function getLabels() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "getlabels", fakeData }, function (response) {
      });
    });
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
        <button onClick={() => send2content('headers', fakeData)} key='headers'>Get headers</button>
      </header >
    </div >
  );
};

export default Popup;
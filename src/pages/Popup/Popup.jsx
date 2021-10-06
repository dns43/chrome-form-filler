import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';

const fakeData1 = {
  firstname: 'matt',
  lastname: 'k',
  reg_email__: 'asf@gmail.com',
  reg_passwd__: 'asdfasdf',
  sex: 'true'
};

const boxes = ["VW", "Toyota", "Beamer"];

function bg() {
  try {
    const arrayData = chrome.runtime.sendMessage({ type: 'get' });
    console.log(arrayData)
    return 'asd' //arrayData
  } catch (error) {
    console.error("sendMessageToBackground error: ", error);
    return null;
  }
}
const Popup = () => {

  const test = bg();

  alert("from bg" + test)

  const [fakeData, setFakeData] = useState()

  useEffect(() => {
    //fetch(
    //  `https://localhost:3000/fakedata`,
    //  {
    //    method: "GET",
    //  }
    //)
    //  .then(res => res.json())
    //  .then(response => {
    //    setFakeData(response)
    //  })
    //  .catch(error => console.log(error));
    setFakeData(fakeData1)
  }, []);

  function fillForm() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "fillform", fakeData }, function (response) {
        console.log("fin")
      });
    });
  }

  function hello() {
    const element =
      <h1>Hello, world!</h1>
    ReactDOM.render(element, document.getElementById('app-container'));
  }

  function headers() {
    var res;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "headers", fakeData }, function (response) {
        setFakeData(fakeData1)
      });
    });
  }

  function getLabels() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "getlabels", fakeData }, function (response) {
        console.log(response)
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
          <button onClick={hello} key='hi'>Say Hi!</button>
        )
        }
        <button onClick={headers} key='headers'>Get headers</button>
      </header >
    </div >
  );
};

export default Popup;

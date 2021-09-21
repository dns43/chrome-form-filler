import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { useEffect, useState } from 'react';

const fakeData1 = {
  firstname: 'matt',
  lastname: 'k',
  reg_email__: 'asf@gmail.com',
  reg_passwd__: 'asdfasdf',
  sex: 'true'
};

const Popup = () => {
  const [fakeData, setFakeData] = useState()

  useEffect(() => {
    fetch(
      `https://localhost:3000/fakedata`,
      {
        method: "GET",
      }
    )
      .then(res => res.json())
      .then(response => {
        setFakeData(response)
      })
      .catch(error => console.log(error));
  }, []);

  function fillForm() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {type:"fillform", fakeData}, function(response){
        console.log("fin")
    });
  });
  }
  return (
    <div className="App">
      <header className="App-header">
        {fakeData ? (
        <button onClick={fillForm}>Fill me</button>
        ) : (
          <div>loading</div>
        )
        }
      </header>
    </div>
  );
};

export default Popup;

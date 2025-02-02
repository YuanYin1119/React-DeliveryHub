import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  timeout: 1000,
  offset: '150px',
  position: positions.MIDDLE
};

ReactDOM.render(
  <BrowserRouter basename="/">
    <Provider template={AlertTemplate} {...options}>
    <App />
    </Provider>
  </BrowserRouter>
, document.getElementById('root'));
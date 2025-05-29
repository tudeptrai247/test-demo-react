import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals.js';
import { Provider } from 'react-redux';
import {store , persistor} from './redux/store.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter,
  Routes,
  Route
 } from "react-router-dom";
import Layout from './Layout.js';
import 'nprogress/nprogress.css';
import { PersistGate } from 'redux-persist/integration/react'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    {/* <React.StrictMode> */}
    {/* cart provider ở cartContext */}
        <BrowserRouter> 
          <Layout />    
        </BrowserRouter>
    {/* </React.StrictMode> */}
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

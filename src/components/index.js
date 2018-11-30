/*
    Hari Kaushik, Sai Ranganathan
    This is the index file which instantiates the App object and adds it on to the root
    element in the DOM.
*/
import React from 'react';
import ReactDOM from 'react-dom';
import '../cssHari/App.css'
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css'; //using FA 4.7 atm
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

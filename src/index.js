/*
    Hari Kaushik, Sai Ranganathan, Conner Ardman, Ian Wohlers
    This is the index which is instantiates the App object and adds it into the dom under the element 'root.
    It also includes all the credential information to access the firebase used in the app.
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { BrowserRouter } from 'react-router-dom';

var config = {
  apiKey: "AIzaSyBqeA3VRwMC0S9hUSknkvm9bwHHVvzRSek",
  authDomain: "meal-time-deea8.firebaseapp.com",
  databaseURL: "https://meal-time-deea8.firebaseio.com",
  projectId: "meal-time-deea8",
  storageBucket: "meal-time-deea8.appspot.com",
  messagingSenderId: "374370065536"
};
firebase.initializeApp(config);

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

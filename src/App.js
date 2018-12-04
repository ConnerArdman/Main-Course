import React, { Component } from 'react';
import { SignUpForm } from './components/SignUpForm';
import BasicLayout from './components/BasicLayout';
import {RecipeGenerator} from './components/RecipeGenerator';
import 'whatwg-fetch';
import firebase from 'firebase/app';

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: true,
         user: null
      };
   }

   componentDidMount() {
      this.authUnRegFunc = firebase.auth().onAuthStateChanged(user => {
         this.setState({loading: false});
         if (user) {
            this.setState({user});
         }
      });
   }

   componentWillUnmount() {
      this.authUnRegFunc();
   }

   handleSignUp = (email, password) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(console.log);
   }

   handleSignIn = (email, password) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
         this.setState({user});
      }).catch(console.log);
   }

   handleSignOut = () => {
      firebase.auth().signOut().then(() => {
         this.setState({user: null});
      }).catch(console.log);
   }

   render() {
      const {loading, user} = this.state;
      if (loading) {
        return (
           <div className="text-center">
                <i className="fa fa-spinner fa-spin fa-3x" aria-label="Connecting..."></i>
           </div>
        );
      } else if (user) {
         return <BasicLayout />;
      } else {
         return (<div className="container">
            <h1>Sign Up</h1>
            <SignUpForm signUpCallback={this.handleSignUp} signInCallback={this.handleSignIn}/>
         </div>);
      }
   }
}

export default App;

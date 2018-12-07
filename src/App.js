/*
    Hari Kaushik, Sai Ranganathan, Conner Ardman, Ian Wohler 
    This is the App component which is later rendered onto the dom in index. This component 
    contains all of the client side routing and takes care of the users for the firebase. 
    It also helper functions to set up the basic layout of the page. 
*/
import React, { Component } from 'react';
import { SignUpForm } from './components/SignUpForm';
import BasicLayout from './components/BasicLayout';
import { RecipeGenerator } from './components/RecipeGenerator';
import moment from 'moment';
import 'whatwg-fetch';
import firebase from 'firebase/app';
import { Route, Switch, Redirect } from 'react-router-dom';
import ReactLoading from 'react-loading';

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: true,
         user: null,
         currentDate: moment(),
         schedule: {},
         errorMessage: null,
         content: "main"
      };
   }

   //component mounting function used to set the state of the user for getting info from firebase. 
   componentDidMount() {

      // this function determines how the app should set its state in repsonse to an update
      let renderSchedule = (databaseSchedule) => {
            if (this.state.user && databaseSchedule.child(this.state.user.uid).val()){ 
                  this.setState({schedule:databaseSchedule.child(this.state.user.uid).val()});
            } else {
                  this.setState({schedule:{}}); // for users with no recipes saved
            }
      }

      this.authUnRegFunc = firebase.auth().onAuthStateChanged(user => {
            this.setState({loading: false, schedule:{}});
            if (user) {
                  this.setState({user});
            }

            // render the user's schedule on initial login
            firebase.database().ref('schedules').once('value', renderSchedule);
      });

      // create a listener for changes to that user's schedule
      firebase.database().ref('schedules')
            .on('value', renderSchedule);
   }

   componentWillUnmount() {
      this.authUnRegFunc();
   }

   // adds a meal from the schduler with all the appropriate data from the fetched api.
   addMeal = (meals) => {

      // this is a SUPER annoying bug fix, keys that have . in them break firebase, so we recursively remove them
      let validateObjectForFirebase = (curr) => {
            if((typeof curr === "object") && (curr !== null)){
                  console.log(curr);
                  Object.keys(curr).forEach((key) => {
                        if(key.includes('.')){
                              delete curr[key]; // remove that key (this is maybe harmful?)
                        } else {
                              validateObjectForFirebase(curr[key]);
                        }
                  })
            }
      }

      validateObjectForFirebase(meals); // lets validate our new (single day) meal plan for firebase

      let currDate = this.state.currentDate.format("MMDDYY")

      // then post this new schedule to the firebase
      let ref = firebase.database().ref('schedules').child(this.state.user.uid);

      let updates = {};
      updates[currDate] = meals; // we need to do this so we can update different dates

      ref.update(updates)
      .catch(function(error) {
         console.log('Synchronization failed');
      });
   }

   // this function deletes ALL recipes a user has saved
   clearSchedule = () => {
      let ref = firebase.database().ref('schedules').child(this.state.user.uid);
      ref.remove();
   }

   // sets the current date
   setCurrentDate = (date) => {
      this.setState({ currentDate: date });
   }

   // takes care of the sign up page for the using the email and password for the 
   handleSignUp = (email, password) => {
      this.setState({errorMessage: null});
      if (!email && !password) {
         this.error({message: "Please provide an email and password"});
      } else if (!email) {
         this.error({message: "Please provide an email."});
      } else if (!password) {
         this.error({message: "Please provide a password."});
      } else {
         firebase.auth().createUserWithEmailAndPassword(email, password).catch(this.error.bind(this));
      }
   }

   // takes care of the sign in and posts to the firebase 
   handleSignIn = (email, password) => {
      this.setState({errorMessage: null});
      firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
         this.setState({user, errorMessage: null});
      }).catch(this.error.bind(this));
   }

   handleSignOut = () => {
      firebase.auth().signOut().then(() => {
         this.setState({
            user: null,
            errorMessage: null});
      }).catch(console.log);
   }

   error(msg) {
      this.setState({errorMessage: msg.message});
   }

   // render the home page
   renderHome = routerProps => {
      return(
         <BasicLayout
            {...routerProps}
            currentDate={this.state.currentDate}
            setDate={this.setCurrentDate}
            schedule={this.state.schedule}
            clearSchedule={this.clearSchedule}
            logOut={this.handleSignOut}
            user={this.state.user}
            content="main"
         />
      );
   }

   // or render the about page 
   renderAbout = routerProps => {
      return(
         <BasicLayout
            {...routerProps}
            currentDate={this.state.currentDate}
            setDate={this.setCurrentDate}
            clearSchedule={this.clearSchedule}
            logOut={this.handleSignOut}
            user={this.state.user}
            content="about"
         />
      );
   }

   // or render the recipe generator page 
   renderGenerator = routerProps => {
      return(
         <RecipeGenerator
            {...routerProps}
            currentDate={this.state.currentDate}
            setDate={this.setCurrentDate}
            schedule={this.state.schedule}
            saveRecipe={this.addMeal}
         />
      );
   }

   render() {
      console.log(this.state.schedule);
      const {loading, user, errorMessage} = this.state;
      const error = errorMessage != null ? <p className="alert alert-danger">{errorMessage}</p> : null;

      if (loading) {
        return (
           <div className="loading-screen">
                 <ReactLoading id="loading" type={"spin"} color={"Black"} height={150} width={150}/>
                 <div className="push"></div><div className="push"></div>
          </div>
        );
      } else if (user) {
         return(
            <Switch>
                  <Route path='/' exact render={this.renderHome} />
                  <Route path='/generate' render={this.renderGenerator} />
                  <Route path='/about' component={this.renderAbout} /> 
                  <Redirect to='/' />
            </Switch>
         );
      } else {
         return (
            <div className="container">
                  {error}
                  <h1>Sign Up / Sign In</h1>
                  <SignUpForm signUpCallback={this.handleSignUp} signInCallback={this.handleSignIn}/>
            </div>);
      }
   }
}

export default App;

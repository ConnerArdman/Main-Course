import React, { Component } from 'react';
import { SignUpForm } from './components/SignUpForm';
import BasicLayout from './components/BasicLayout';
import { RecipeGenerator } from './components/RecipeGenerator';
import {AboutPage} from './components/About'; 
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
         schedule: {}
      };
   }

   componentDidMount() {
      this.authUnRegFunc = firebase.auth().onAuthStateChanged(user => {
         this.setState({loading: false});
         if (user) {
            this.setState({user});
         }
      });
      this.setScheduleFromCache();
   }

   componentWillUnmount() {
      this.authUnRegFunc();
   }

   // add a meal on to the schduler with all the appropriate data from the fetched api
   addMeal = (meals) => {
      let list = [];
      if(this.state.schedule[this.state.currentDate.format("MMDDYY")]){
            list = this.state.schedule[this.state.currentDate.format("MMDDYY")];
      }
      meals.map(meal => {
         list.push(meal);
      });
      this.updateSchedule(list);
   }

   updateSchedule = list => {
      this.setState(prevState => ({
         schedule: {
            ...prevState.schedule,
            [this.state.currentDate.format("MMDDYY")]: list
         }
      }));
      window.localStorage.setItem('schedule', JSON.stringify(this.state.schedule));
   }

   setScheduleFromCache = () => {
      if(window.localStorage.getItem('schedule') !== null) {
         let retrieved = JSON.parse(window.localStorage.getItem('schedule'));
         //console.log(retrieved);
         this.setState({schedule: retrieved});
      }
   }

   // sets the current date and logs it out in the console.
   setCurrentDate = date => {
      this.setState({ currentDate: date }, () =>
         console.log(this.state.currentDate)
      );
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

   renderHome = routerProps => {
      return(
         <BasicLayout
            {...routerProps}
            currentDate={this.state.currentDate}
            setDate={this.setCurrentDate}
            schedule={this.state.schedule}
         />
      );
   }

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
      const {loading, user} = this.state;
      if (loading) {
        return (
           <div className="loading-screen">
                 <ReactLoading id="loading" type={"spin"} color={"Black"} height={150} width={150}/>
                 <div class="push"></div><div class="push"></div>
          </div>
        );
      } else if (user) {
         return(
            <Switch>
               <Route path='/' exact render={this.renderHome} />
               <Route path='/generate' render={this.renderGenerator} />
               <Route path='/about' component={AboutPage} /> 
               <Redirect to='/' />
            </Switch>
         );
      } else {
         return (<div className="container">
            <h1>Sign Up</h1>
            <SignUpForm signUpCallback={this.handleSignUp} signInCallback={this.handleSignIn}/>
         </div>);
      }
   }
}

export default App;

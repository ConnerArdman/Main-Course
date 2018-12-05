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
         errorMessage: null
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

   renderHome = routerProps => {
      return(
         <BasicLayout
            {...routerProps}
            currentDate={this.state.currentDate}
            setDate={this.setCurrentDate}
            schedule={this.state.schedule}
            updateSchedule={this.updateSchedule}
            logOut={this.handleSignOut}
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
      const {loading, user, errorMessage} = this.state;
      const error = errorMessage != null ? <p className="alert alert-danger">{errorMessage}</p> : null;

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
               <Redirect to='/' />
            </Switch>
         );
      } else {
         return (<div className="container">
            {error}
            <h1>Sign Up / Sign In</h1>
            <SignUpForm signUpCallback={this.handleSignUp} signInCallback={this.handleSignIn}/>
         </div>);
      }
   }
}

export default App;

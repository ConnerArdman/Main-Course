/*
    Hari Kaushik, Sai Ranganathan, Conner Ardman, Ian Wohlers
    This is the signup form page which uses firebase to register the users by
    their emails and passwords with Main Course and keeps their data in
    one place.
*/
import React, { Component } from 'react';

export class SignUpForm extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: undefined,
      password: undefined,
    };
  }

  // update state for specific field
  handleChange = (event) => {
    let field = event.target.name; //which input
    let value = event.target.value; //what value

    let changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  //handle signUp button
  handleSignUp = (event) => {
    event.preventDefault();
    this.props.signUpCallback(this.state.email, this.state.password);
  }

  //handle signIn button
  handleSignIn = (event) => {
    event.preventDefault();
    this.props.signInCallback(this.state.email, this.state.password);
  }

  render() {
    return (
      <div>
         <form>
           {/* email */}
           <div className="form-group">
             <label htmlFor="email">Email</label>
             <input className="form-control"
               id="email"
               type="email"
               name="email"
               onChange={this.handleChange}
               />
           </div>

           {/* password */}
           <div className="form-group">
             <label htmlFor="password">Password</label>
             <input className="form-control"
               id="password"
               type="password"
               name="password"
               onChange={this.handleChange}
               />
           </div>

           {/* buttons */}
           <div className="form-group">
             <button className="btn btn-primary mr-2" onClick={this.handleSignUp}>Sign-up</button>
             <button className="btn btn-primary" onClick={this.handleSignIn}>Sign-in</button>
           </div>
         </form>
      </div>
    )
  }
}

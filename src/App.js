import React, { Component, Fragment } from 'react';
import './App.css';
import { Filters } from './components/Filters';
import { Recipes } from './components/Recipes';
import { About } from './components/About';
import 'whatwg-fetch';

import { Navbar, Nav, NavItem} from 'react-bootstrap';

// Maping of macronutrients to calories per gram
export const MACROS = new Map([
   ['carbs', 4],
   ['fat', 9],
   ['protein', 4]
]);

/**
* The API has a lot of filtering limitations, so this is how many
* queries to make so we can do custom filtering on the client side.
*/
const NUM_RECIPES = 100;

// Default amount of tolerance on entred mactronutrients.
const DEFAULT_TOLERANCE_RANGE = .2;

// Storing API keys here for the purposes of this class.
// TODO: add a server as a layer of abstraction between API keys and clients
const API = 'https://api.edamam.com/search?app_id=4fba7f21&app_key=015209fd4e63d9db67f22a621a26ea4a';

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         extraRecipes: [],
         loading: false,
         about: false, // Is on about screen
         hits: [] // A hit is the term for a recipe in the API
      };
   }

   render() {
      const {hits, loading, about} = this.state;
      return (
         <Fragment>

            <Navbar inverse collapseOnSelect fixedTop fluid>
                  <Navbar.Header>
                        <Navbar.Brand>
                              <a href="#" onClick={this.returnHome.bind(this)}>
                                    Cook Healthy
                              </a>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                  </Navbar.Header>
                  <Navbar.Collapse>
                        <Nav>
                              <NavItem eventKey={1} href="#" onClick={this.returnHome.bind(this)}>
                                    {about ? "Home" : <strong>Home</strong>}
                              </NavItem>
                        </Nav>
                        <Nav>
                              <NavItem eventKey={1} href="#" onClick={this.gotoAbout.bind(this)}>
                                    {about ? <strong>About</strong> : "About"}
                              </NavItem>
                        </Nav>
                  </Navbar.Collapse>
            </Navbar>

            <div className="push"></div>

            {about ?
                  (<div className="col-container" id="appContainer">
                        <About/>
                  </div>)
                  :
                  (<div className="col-container" id="appContainer">
                        <div className="col col1" id="filterContainer">
                              <Filters fetchQueries={this.fetchQueries.bind(this)}/>
                        </div>

                        {loading ?
                              (<div className="col col2 loading" id="recipeContainer">
                              <Recipes
                                    hits={hits}
                                    deleteRecipe={this.deleteRecipe.bind(this)}
                                    loading={loading} />
                              </div>)
                              :
                              (<div className="col col2" id="recipeContainer">
                              <Recipes
                                    hits={hits}
                                    deleteRecipe={this.deleteRecipe.bind(this)}
                                    loading={loading} />
                              </div>)
                        }
                  </div>)
            }

            <footer className="footer">
                  <p>
                        <a href="mailto:ardmanc@uw.edu">Conner Ardman</a> &copy; 2018 |&nbsp;
                        <a href="#" onClick={this.toggleAbout.bind(this)}>
                              {about ? "Home " : "About "}
                        </a>
                        | Data From <a href="https://www.edamam.com">api.edamam.com</a>
                  </p>
            </footer>
         </Fragment>
      );
   }

   toggleAbout() {
      this.setState(prevState => {
         return {
            about: !prevState.about
         };
      })
   }

   returnHome() {
      this.setState(prevState => {
         return {
            about: false
         };
      })
   }

   gotoAbout() {
      this.setState(prevState => {
         return {
            about: true
         };
      })
   }

   fetchQueries(filters) {
      this.setState({loading: true});
      fetch(this.getAPIQuery(filters))
         .then(checkStatus)
         .then(recipes => this.parseRecipes(recipes, filters))
      //TODO   .catch(showError);
   }

   getAPIQuery(filters) {
      const {
         numMeals,
         maxCookTime,
         carbs,
         protein,
         fat,
         restrictions
      } = filters;

      const query = ''; // Send an empty query
      let output = `${API}&q=${query}&to=${NUM_RECIPES}&time=${maxCookTime}` +
         `&nutrients%5BCHOCDF%5D=${getRange(carbs / numMeals)}&nutrients%5BFAT%5D=` +
         `${getRange(fat / numMeals)}&nutrients%5BPROCNT%5D=${getRange(protein / numMeals)}`;
      if (restrictions.length > 0) {
         output += `&health=${restrictions[0]}`; // API limits one health restriction
      } return output;
   }

   parseRecipes(recipes, filters) {
      let {hits} = recipes;
      const {numMeals, restrictions} = filters;
      hits = shuffleArray(hits);
      if (restrictions.length > 1) {
         hits = hits.filter(hit => {
            const {recipe} = hit;
            const {healthLabels} = recipe;
            for (const restriction of restrictions) {
               if (!healthLabels.includes(restriction)) {
                  return false;
               }
            } return true;
         });
      }
      if (hits.length === 0) {
         //TODO
         // getEl('plan-container').innerHTML =
         //    'Sorry no matches found. Please try removing some filters.';
      } else {
         this.showRecipes(hits, numMeals);
      }
   }

   showRecipes(hits, numMeals) {
      this.setState({
         extraRecipes: hits.slice(numMeals),
         hits: hits.slice(0, numMeals),
         loading: false
      });
   }

   deleteRecipe(index) {
      this.setState(prevState => {
         const {extraRecipes, hits} = prevState;
         hits[index] = extraRecipes.pop();
         return {extraRecipes, hits};
      });
   }
}

// ******************************  HELPER FUNCTIONS ****************************** //

/**
 * getRange - Get the minimum and maximum allowed values given user input
 *
 * @param  {String} value String to be parsed as integer for median of range.
 * @param  {Number} rangeOffset Percentage of increase/decrease allowed in range
 * @return {String} In form min-max
 */
function getRange(value, rangeOffset = DEFAULT_TOLERANCE_RANGE) {
   value = parseInt(value);
   const diff = Math.round(value * rangeOffset);
   const min = value - diff;
   const max = value + diff;
   return `${min}-${max}`;
}

/**
 * shuffleArray - Randomly shuffles an array based on Fisher Yate's Algorithm
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 *
 * @param  {Array} arr Array to be shuffled
 * @return {Array}     input arr in a random order
 */
function shuffleArray(arr) {
   for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
   }
   return arr;
}

/**
 * Gets the response's result text if successful, otherwise
 * returns the rejected Promise result with an error status and corresponding text
 * @param {object} response - fetch response to check for success/error
 * @return {object} - valid result JSON if response was successful, otherwise rejected
 *                    Promise result
 */
function checkStatus(response) {
   if ((response.status >= 200 && response.status < 300) || response.status === 0) {
      return response.json();
   } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
   }
}


export default App;

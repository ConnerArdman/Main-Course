import React, { Component, Fragment } from 'react'; //import React Component
import { Filters } from './Filters';
import { RecipeList } from './RecipeList';
import { Redirect } from 'react-router-dom';
import { Layout } from 'antd';
const { Header, Content, Sider } = Layout;

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

export class RecipeGenerator extends Component {
   constructor(props) {
      super(props);
      this.state = {
         extraRecipes: [],
         loading: false,
         hits: [], // A hit is the term for a recipe in the API
         saved: false,
         width: 0
      };
   }

   componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions.bind(this));
   }

   componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
   }


   /**
    * updateWindowDimensions - Viewport width code adapted from here:
    * https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
    */
   updateWindowDimensions() {
      this.setState({
         width: window.innerWidth,
         height: window.innerHeight
      });
   }

   handleSave = () => {
      let recipes = [];
      this.state.hits.map(hit =>{
         recipes.push(hit.recipe);
      });
      this.props.saveRecipe(recipes);
      this.setState({saved: true});
   }

   render() {
      const {hits, loading, width} = this.state;
      const cols = "col col2" + (loading ? " loading" : "");
      if(this.state.saved){
         return(
            <Redirect to="/"/>
         );
      }

      return (
         <div>
         {
            width > 992 ?
            <Layout className="basicLayout">
              <Sider
                breakpoint='lg'
                className="sider"
                width="20%"
              >
                  <Filters fetchQueries={this.fetchQueries.bind(this)} saveRecipe={this.handleSave}/>
              </Sider>
              <Layout className={this.state.collapsed ? "main main-grow" : "main"}>
                <Header className="header">
                  <h2 className="currentDay">
                    {this.props.currentDate.format("MMMM Do, YYYY")}
                  </h2>
                </Header>
                <Content className="mainContent" >
                   <RecipeList hits={hits} deleteRecipe={this.deleteRecipe.bind(this)} loading={loading}/>
                </Content>
              </Layout>
            </Layout>
            :
            <Layout className="basicLayout" id="fullbg">
                <Header className="header">
                  <h2 className="currentDay">
                    {this.props.currentDate.format("MMMM Do, YYYY")}
                  </h2>
                </Header>
                <Content className="mainContent" >
                   <Filters fetchQueries={this.fetchQueries.bind(this)} saveRecipe={this.handleSave}/>
                   <RecipeList hits={hits} deleteRecipe={this.deleteRecipe.bind(this)} loading={loading}/>
                </Content>
            </Layout>
         }
      </div>
      );
   }

   fetchQueries(filters) {
      this.setState({loading: true});
      fetch(this.getAPIQuery(filters))
         .then(checkStatus)
         .then(recipes => this.parseRecipes(recipes, filters))
         .catch(console.log);
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

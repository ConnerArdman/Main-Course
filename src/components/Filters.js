/*
    Hari Kaushik, Sai Ranganathan, Conner Ardman, Ian Wohler 
    This is the slider component which holds all of the filters for the recipe generator. Using this data
    that the user enters, a query is made to the API which gets back information that is then rendered 
    in the recipe generator module.  
*/
import React, { Component } from 'react';
import { Slider } from './Slider';
import { SliderGroup } from './SliderGroup';
import { CheckBoxGroup } from './CheckBoxGroup';
import { MACROS } from './RecipeGenerator';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export class Filters extends Component {
   constructor(props) {
      super(props);
      this.state = {
         meals: 3,
         cookTime: 15,
         carbs: 206,
         protein: 146,
         fat: 67,
         restrictions: new Set()
      };
   }

   render() {
      const {meals, cookTime, carbs, protein, fat} = this.state;
      return (
         <section id="filters">
            <div className="pageTitle">
               <Link to='/'><h1>Main Course</h1></Link>
            </div>

            <Slider
                  className="control-option"
                  name="Meals Per Day"
                  id="meals"
                  unit=" Meal"
                  min="1"
                  max="7"
                  defaultValue="3"
                  inputChange={this.inputChange.bind(this)}
                  value={meals}
                  shouldPlural={true}
                  />

            <Slider
                  className="control-option"
                  name="Max Cook Time Per Meal"
                  id="cookTime"
                  unit=" Minute"
                  min="5"
                  max="120"
                  defaultValue="15"
                  inputChange={this.inputChange.bind(this)}
                  value={cookTime}
                  shouldPlural={true}
                  />

            <SliderGroup
                  className="control-option"
                  masterUnits="Calories"
                  masterValue={this.calcCalories()}
                  title="Daily Macronutrients"
                  sliderPropsArray={[
                     {
                        aria: "Carbohydrates Per Meal",
                        id: "carbs",
                        unit: "g carbs",
                        min: "25",
                        max: "400",
                        defaultValue: "206",
                        value: carbs,
                        inputChange: this.inputChange.bind(this)
                     },
                     {
                        aria: "Protein Per Meal",
                        id: "protein",
                        unit: "g protein",
                        min: "25",
                        max: "400",
                        defaultValue: "146",
                        value: protein,
                        inputChange: this.inputChange.bind(this)
                     },
                     {
                        aria: "Fat Per Meal",
                        id: "fat",
                        unit: "g fat",
                        min: "5",
                        max: "200",
                        defaultValue: "67",
                        value: fat,
                        inputChange: this.inputChange.bind(this)
                     }
                  ]}
               />

            <CheckBoxGroup
                  className="control-option"
                  checkBoxes={['vegan', 'vegetarian']}
                  title="Dietary Restrictions"
                  change={this.addRestriction.bind(this)}
                  />

            <div className="button-group">
               <Button
                     bsStyle="primary"
                     bsSize="large"
                     type="button"
                     onClick={this.generateRecipes.bind(this)}>
                     Generate Recipes
               </Button>
               <Button
                     bsStyle="primary"
                     bsSize="large"
                     type="button"
                     onClick={this.props.saveRecipe}>
                     Save Recipes
               </Button>
            </div>
         </section>
      );
   }

   // fetches queries and generates recipes from the API  
   generateRecipes() {
      const {meals, cookTime, carbs, protein, fat, restrictions} = this.state;
      const {fetchQueries} = this.props;
      const filters = {
         numMeals: meals,
         calories: this.calcCalories(),
         maxCookTime: cookTime,
         carbs: carbs,
         protein: protein,
         fat: fat,
         restrictions: Array.from(restrictions)
      };
      fetchQueries(filters)
   }

   // change state of the id if the input in sliders are changed 
   inputChange(event) {
      const {id, value} = event.target;
      this.setState({
         [id]: value
      });
   }

   // adds the restrictions of whether the user wants vegan/vegatarian food. 
   addRestriction(event) {
      const {value} = event.target;
      this.setState(prevState => {
         const {restrictions} = prevState;
         if (restrictions.has(value)) {
            restrictions.delete(value);
         } else {
            restrictions.add(value);
         }
         return {restrictions};
      });
   }

   // method for calculating the calories given the fat, crabs, and protein content
   calcCalories() {
      const {fat, carbs, protein} = this.state;
      return (fat * MACROS.get('fat')) +
         (protein * MACROS.get('protein')) +
         (carbs * MACROS.get('carbs'));
   }
}

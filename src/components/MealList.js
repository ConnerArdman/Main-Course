/*
    Hari Kaushik, Sai Ranganathan, Conner Ardmen, Ian Wohlers 
    This is the Meal List component which just creates and returns a div containing
    the rows of all the meals by mapping all the meal items returned by the api when you
    click on add a meal to the calendar.
*/
import React, { Component } from 'react';
import Meal from './Meal';
import 'whatwg-fetch';
import 'antd/dist/antd.css';
import '../bootstrap.css';
import '../App.css';

// creates and returns a div component containing all the different meals
// that were added to the calendar.
class MealList extends Component {
    renderMeals = () => {
        let meals = this.props.meals;
        return(
            <div>
                {meals && meals.map(item => {
                    if(!item.deleted)
                        return(
                            <Meal
                                key={item.mealName}
                                meal={item}
                                deleteMeal={this.props.deleteMeal}
                                openMeal={this.props.openMeal}
                            />
                        );
                    else
                        return(<div key={item.mealName} className="hidden"></div>);
                })}
            </div>
        );
    }
    render() {
        // creates and returns an object that renders all the meals inside the mealList class
        // used for the styling of the modal.
        return(
            <div className="mealList">
                {this.renderMeals()}
            </div>
        );
    }
}

export default MealList;

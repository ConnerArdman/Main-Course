/*
    Hari Kaushik, Sai Ranganathan
    This is the scheduler component which contiains the calendar as well as the information that will be
    added once the user adds a meal onto the component.
*/

import React, { Component } from 'react';
import { Calendar, Button, Modal } from 'antd';
import MealList from './MealList';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

class Scheduler extends Component {
    // constructor in order to keep track of the schedule
    constructor(props){
        super(props);
        this.state = {
            newMeal: "",
            visible: false
        };
    }

    // get the meal data from the api
    /*componentDidUpdate() {
        this.fetchMeal();
    }*/

    // get the meal and the set schedule from the cache on the window on load

    setScheduleFromCache = () => {
        if(window.localStorage.getItem('schedule') !== null) {
            let retrieved = JSON.parse(window.localStorage.getItem('schedule'));
            //console.log(retrieved);
            this.setState({schedule: retrieved});
        }
    }

    // set state of the meal
    openMeal = meal => {
        this.setState({openMeal: meal});
    }

    openModal = () => {
        this.setState({
            visible: true
        });
    }

    closeModal = () => {
        this.setState({
            visible: false
        });
    }

    // fetch data from the meal db api in order to get information
    // on all the different foods
    fetchMeal = () => {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => this.setState({ newMeal: data }));
    }

    getCellData = date => {
        let meals = this.props.schedule[date.format("MMDDYY")];
        let listData = [];
        meals && meals.forEach(meal => {
            if(!meal.deleted){
                listData.push(
                    {type: 'normal',  content: meal.label}
                );
            }
        });
        return listData;
    }

    // render the data in the cell
    dateCellRender = date => {
        let listData = this.getCellData(date);
        return (
            <ul className="events">
                {
                listData.map(item => (
                    <li key={item.content}>
                        <span className={`event-${item.type}`}>●</span>
                        {item.content}
                    </li>
                ))
                }
            </ul>
        );
    }

    // remove a meal from the schedule
    deleteMeal = meal => {
        let meals = this.props.schedule[this.props.currentDate.format("MMDDYY")];
        meals.find(item => {
            return item.mealName === meal.mealName;
        }).deleted = true;
        this.updateSchedule(meals);
    }

    // add a meal on to the schduler with all the appropriate data from the fetched api
    addMeal = () => {
        let list = [];
        if(this.props.schedule[this.props.currentDate.format("MMDDYY")]){
            list = this.props.schedule[this.props.currentDate.format("MMDDYY")];
        }
        let meal = this.cleanMeal(this.state.newMeal.meals[0]);

        list.push({
            'mealName': meal.strMeal,
            'instructions': meal.strInstructions,
            'imgUrl': meal.strMealThumb,
            'vidUrl': meal.strYoutube,
            'ingredients': meal.ingredients
        });
        this.updateSchedule(list);
        this.fetchMeal();
    }

    // set the state of the schedule to have the planned meal
    updateSchedule = list => {
        this.setState(prevState => ({
            schedule: {
                ...prevState.schedule,
                [this.props.currentDate.format("MMDDYY")]: list
            }
        }));
        window.localStorage.setItem('schedule', JSON.stringify(this.props.schedule));
    }

    // clean response from api to create meal with only relevant data
    cleanMeal = meal => {
        let cleaned = {};
        let keep = ['strMeal', 'strInstructions', 'strMealThumb', 'strYoutube'];
        let keys = Object.keys(meal);
        let ingredients = [];
        keys.forEach(key => {
            if(key.includes("strIngredient") && meal[key] && meal[key].length > 1)
                ingredients.push(meal[key]);
            if(keep.includes(key))
                cleaned[key] = meal[key];
        });
        cleaned.ingredients = ingredients;
        return cleaned;
    }
    // has the information for all the modal that is supposed to pop up when viewing the food
    // added onto the calendar. Includes the image, the instructions and the youtube
    // video all given back from the api.
    renderModal = () => {
        let meal = this.state.openMeal;
        if(meal){
            return(
                <div className="modalContent">
                    <div className="imgContainer">
                        <img className="modalImage" src={meal.imgUrl} alt={meal.mealName}/>
                    </div>
                    <h3>Ingredients</h3>
                    <ul>
                        {meal.ingredients.map(item => {
                            if(item && item.length > 1)
                                return(<li key={item}>{item}</li>);
                            else
                                return(<div className="hidden"></div>);
                        })}
                    </ul>
                    <h3>Instructions</h3>
                    <div className="youtubeContainer">
                        <Button type="primary" href={meal.vidUrl} target="_blank" rel="noopener noreferrer">Watch</Button>
                    </div>
                    <p>{meal.instructions}</p>
                </div>
            );
        }
    }
    // rendering the entire page with buttons and the calendar interface and all other components
    render() {
        return(
            <div className="scheduler">
                <Button className="getMeal" type="primary"><Link to='/generate'>Get A Meal</Link></Button>
                <Calendar onSelect={this.props.setDate} dateCellRender={this.dateCellRender}/>
                <MealList
                    meals={this.props.schedule[this.props.currentDate.format("MMDDYY")]}
                    deleteMeal={this.deleteMeal}
                    openModal={this.openModal}
                    openMeal={this.openMeal}
                />
                <Modal
                    className="mealModal"
                    title={this.state.openMeal ? this.state.openMeal.mealName : ""}
                    visible={this.state.visible}
                    closable
                    onOk={this.closeModal}
                    onCancel={this.closeModal}
                    footer={null}
                >
                    {this.renderModal()}
                </Modal>
            </div>
        );
    }
}

export default Scheduler;

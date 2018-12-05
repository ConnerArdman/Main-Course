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
import '../bootstrap.css';
import '../App.css';

class Scheduler extends Component {
    // constructor in order to keep track of the schedule
    constructor(props){
        super(props);
        this.state = {
            newMeal: "",
            visible: false,
            openMeal: null
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
            visible: false,
            openMeal: null
        });
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
            return item.label === meal.label;
        }).deleted = true;
        this.props.updateSchedule(meals);
    }

    // has the information for all the modal that is supposed to pop up when viewing the food
    // added onto the calendar. Includes the image, the instructions and the youtube
    // video all given back from the api.
    renderModal = () => {
        let meal = this.state.openMeal;
        if(meal){
            return(
                <div className="modalContent">
                    <div className="modalButtons">
                        <Button className="back" type="primary" onClick={() => this.setState({openMeal: null})}>
                            Back
                        </Button>
                    </div>
                    <div className="imgContainer">
                        <img className="modalImage" src={meal.image} alt={meal.label}/>
                    </div>
                    <h3>Ingredients</h3>
                    <ul>
                        {meal.ingredients.map(item => {
                            return(<li key={item}>{item.text}</li>);
                        })}
                    </ul>
                    <h3>Instructions</h3>
                    <div className="modalButtons">
                        <Button type="primary" href={meal.url} target="_blank" rel="noopener noreferrer">See Recipe</Button>
                    </div>
                    <p>{meal.instructions}</p>
                </div>
            );
        } else {
            return(
                this.renderList()
            );
        }
    }

    renderList = () => {
        console.log(this.props.schedule[this.props.currentDate.format("MMDDYY")]);
        return(
            <MealList
                meals={this.props.schedule[this.props.currentDate.format("MMDDYY")]}
                deleteMeal={this.deleteMeal}
                openMeal={this.openMeal}
            />
        );
    }

    // rendering the entire page with buttons and the calendar interface and all other components
    render() {
        return(
            <div className="scheduler">
                <Button className="getMeal" type="primary"><Link to='/generate'>Get A Meal</Link></Button>
                <Button className="getMeal" type="primary" onClick={this.openModal}>View Details</Button>
                <Calendar onSelect={this.props.setDate} dateCellRender={this.dateCellRender}/>
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

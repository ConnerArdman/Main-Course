/*
    Hari Kaushik, Sai Ranganathan
    This component creates the meals using the Ant Design library which creates a modal
    where there is a table of all the meals with their appropiate pictures which allows for them
    to be deleted.
*/
import React, { Component } from 'react';
import { Row, Icon, Popconfirm } from 'antd';
import 'whatwg-fetch';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

class Meal extends Component {

    // allows for the delete functionality of a specific meal.
    deleteMeal = () => {
        this.props.deleteMeal(this.props.meal);
    }

    // the modal that is opened with all the meals on it
    openModal = () => {
        this.props.openModal();
        this.props.openMeal(this.props.meal);
    }

    // this creates the whole table of rows of meals and also creates a button for you
    // to delete the meal with a Popconfirm object from the ant design library.
    render() {
        let meal = this.props.meal;
        return(
            <Row className="meal">
                <Row className="clickable" onClick={this.openModal}>
                    <div className="thumbnail">
                        <img className="pic" src={meal.imgUrl} alt={meal.mealName} />
                    </div>
                    <div className="mealName">
                        {meal.mealName}
                    </div>
                </Row>
                <div className="delete">
                    <Popconfirm placement="left" title="Are you sure you want to delete this meal?" onConfirm={this.deleteMeal} okText="Yes" cancelText="No">
                        <Icon className="deleteBtn" type="delete"/>
                    </Popconfirm>
                </div>
            </Row>
        );
    }
}

export default Meal;

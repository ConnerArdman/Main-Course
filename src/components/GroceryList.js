/* 
Sai Ranganathan, Hari Kaushik 
This is the Grocery List component which is later rendered in the app class. It allows the user to add to a 
shopping cart for the items they need to buy. It allows them to cross out items that they have bought and that
data updates constantly with local storage. 
*/ 
import React, { Component } from 'react';

class GroceryList extends Component {
  constructor(props){
    super(props); //pass up to parent

    //initialize state
    this.state = {
      tasks: [] //items or tasks array 
    };
  }

  /* allows to add the tasks or the items to buy into local storage */ 
  addTasksToStorage = () => {
    let list = []; 
    this.state.tasks.map(task => {
      if(!task.complete)
        list.push(task);
    }); 
    window.localStorage.setItem('tasks', JSON.stringify(list)); 
  }

  /* 
    this function is equivalent to the onload function that initializes and sets
    the local storage
  */ 
  componentDidMount() {
    if(window.localStorage.getItem('tasks') !== null) {
      let retrieved = JSON.parse(window.localStorage.getItem('tasks')); 
      let list = [];
      retrieved.forEach(item => {
        if(!item.complete) { 
          list.push({"id": item.id, "description": item.description, "complete": item.complete});
        } 
        this.setState({tasks: list});
        this.forceUpdate(); 
      })
    }
  }

  /* toggles the tasks to have a property of being either completed or not */
  toggleComplete = (taskId) => {
    this.setState((currentState) => { //update the state
      let updatedTasks = currentState.tasks.map((task) => {
        if(task.id === taskId){
          task.complete = !task.complete; // changes the state of the list item to the opposite
          this.addTasksToStorage(); // add tasks to the local storage 
        }    
        return task;
      })
      return {tasks: updatedTasks}
    })  
  }

  /*  
    function to add task to the current state of the task array and 
    adds it into local storage. 
  */  
  addTask = (newDescription) => {
    if(newDescription.length > 0) {
      this.setState((currentState) => {
        let newTask = {
          id: currentState.tasks.length+1,
          description: newDescription,
          complete: false
        }
        currentState.tasks.push(newTask); //add task, better to copy array
        this.addTasksToStorage();
        return {tasks: currentState.tasks}
      })
    }
  }

  /* 
    function for rendering the contents of the grocery list which will then be 
    added to the DOM when the component is instantiated. Creates  
  */ 
  render() {
    //do data processing
    let incomplete = this.state.tasks.filter((task) => !task.complete);

    return (
      <div>
      <div className="form">
      <div className="container">
        <p className="lead"> Items in shopping cart: {incomplete.length}</p>
        <TaskList howToToggle={this.toggleComplete} tasks={this.state.tasks} />
        <GroceryForm howToAdd={this.addTask} addTasksToStorage={this.addTaskToStorage}/>
      </div>
      </div>
      </div>
    );
  }
}

class TaskList extends Component {  
  render() {
    //do data processing
    let taskComponents = this.props.tasks.map((eachTask) => {
      let singleTask = <Item 
                          //taskkey={eachTask.id} 
                          key={eachTask.id}
                          task={eachTask} 
                          howToToggle={this.props.howToToggle}
                          /> //pass callback down
      return singleTask;
    })

    return (
      <ol>
        {taskComponents}
      </ol>
    );
  }
}

/* 
  This is the item component which takes in props for the key and the on click class 
  that creates a list item which is then rendered and added on to the grocery list. 
  It also has a click property that crosses out the item when clicked and then updates
  this information in the local storage. 

*/ 
class Item extends Component {
  getClassName() {
    let className = 'groceryItem';
    if(this.props.task.complete){
      className = ' font-strike'; // strike out the item when the item is bought 
    }
    return className;    
  }

  // handle the click in order to toggle the complete property from true to false or 
  // vise versa. 
  handleClick = () => {
    this.props.howToToggle(this.props.task.id);
  }

  render() {
    let thisTask = this.props.task; //can give local name for readability
    return (
      <li className={this.getClassName()} key={this.props.taskkey} onClick={this.handleClick} >
        {thisTask.description}
      </li>
    );
  }
}

/* 
  Grocery From component which makes a form and creates a Grocery list component inside it 
  which has a button in order to add to the list 
*/  
class GroceryForm extends Component {
  constructor(props){
    super(props);
    this.state = {newTask: ''}; //what is typed in
  }

  // handle change event by setting the state of the task to the target value 
  handleChange = (event) => {    
    let value = event.target.value;
    this.setState({newTask: value})
  }

  // handle click event 
  handleClick = (event) => {
    event.preventDefault();
    this.props.howToAdd(this.state.newTask); 
    this.setState({newTask: ""});  
  }

  render() {
    return (
      <form>
        <input 
          className="form-control mb-3"
          placeholder="Add to Grocery List"
          value={this.state.newTask}
          onChange={this.handleChange}
          />
        <button className="btn btn-primary" onClick={this.handleClick}>
          Add item to list
        </button>
      </form>
    );
  }
}

export default GroceryList; //export the grocery list component 
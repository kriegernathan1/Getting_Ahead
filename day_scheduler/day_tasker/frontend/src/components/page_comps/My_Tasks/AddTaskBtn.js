import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Task from '../../Layout/Task';
import TasksContain, {addEvent} from "../../Layout/TasksContain"




export default class AddTaskBtn extends Component {
    constructor(props){
        super(props);

        
    }

    //call Tasks contains function to update state
    

    render(){
        return(
        <div>
            <button className="addTaskBtn" onClick={this.clicked}>Add Task</button>  
        </div>
        )
    }
}





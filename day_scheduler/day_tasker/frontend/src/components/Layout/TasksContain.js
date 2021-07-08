import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Task from "./Task"



// Holds all tasks in a container
export default class TasksContain extends Component {
    constructor(props){
        super(props);

        this.state = {
            tasks: []
        }

        this.addEvent = this.addEvent.bind(this);
    }

    //Update state with new tasks on each button click
   


    render(){
        return (
            <div>
                <Task name="Placeholder" time="25:00" importance="Important" />
                <Task name="Placeholder" time="50:00" importance="Not Important" />
            </div>
        )
    }
}



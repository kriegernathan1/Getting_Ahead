import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import SortBtn from "./SortBtn";
import AddTaskBtn from "./AddTaskBtn";
import MoveToToday from "./MoveToToday"



export class TopBtns extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
        <div className="topBtns">
            <AddTaskBtn/>
            <MoveToToday/>  
            <SortBtn/>
        </div>
        )
    }
}

export default TopBtns;



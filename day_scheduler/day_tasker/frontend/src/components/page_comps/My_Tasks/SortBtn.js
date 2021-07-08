import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'


export class SortBtn extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
        <div className="SortDropdown">
            <button className="dropbtn">Sort</button>
            <div className="dropdown-content">
                <a>All Tasks</a>
                <a>Personal</a>
                <a>Family</a>
                <a>Hobby</a> 
            </div>
        </div>
        )
    }
}

export default SortBtn;


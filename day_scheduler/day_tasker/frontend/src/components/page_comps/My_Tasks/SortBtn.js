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
                <a>
                    <button onClick={ () => this.props.sortTasks(' ')}>All Tasks</button>
                </a>
                <a>
                    <button onClick={ () => this.props.sortTasks('Personal')}>Personal</button>
                </a>
                <a>
                    <button onClick={() => this.props.sortTasks('Family')}>Family</button>
                </a>
                <a>
                    <button onClick={() => this.props.sortTasks('Career')}>Career</button>
                </a>
                <a>
                    <button onClick={() => this.props.sortTasks('Hobby')}>Hobby</button> 
                </a>
            </div>
        </div>
        )
    }
}

export default SortBtn;


import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';




export class MoveToToday extends Component {
    constructor(props){
        super(props);

    
    }

    

    render(){
        return(
        <div>
            <button className="mvtoday" onClick={this.testing}>Move to today</button>
            
        </div>
        )
    }
}

export default MoveToToday;



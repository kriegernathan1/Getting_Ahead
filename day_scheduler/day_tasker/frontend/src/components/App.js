//JS libraries 
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Components
import Nav from "./Layout/Nav";
import Task  from "./Layout/Task";
import Today from "./page_comps/Today/Today";
import MyTasks from "./page_comps/My_Tasks/MyTasks";


class App extends Component {

    constructor(props){
        super(props);//required

        // ----------------- May delete -> using API instead --------------
        // All tasks on the website are stored here
        //In future this will be populated from api and functions that edit this array 
        //will also update API
        // this.all_tasks = [] 
        // ----------------- May delete -> using API instead --------------


        //binded tasks
        this.activeNav = this.activeNav.bind(this);

        
        // ----------------- May delete -> using API instead --------------
        // this.addTaskMaster = this.addTaskMaster.bind(this);
        // this.deleteTaskMaster = this.deleteTaskMaster.bind(this);
        // this.setShowInTasks  = this.setShowInTasks.bind(this);
        // ----------------- May delete -> using API instead --------------

        this.state = {
            link1: true
        };
    }

    // Changes which link in Nav bar is active
    activeNav(active){
        this.setState({link1: active})
    }

 




    render(){
        return(
           <Router>
               <div className="App">
                <Nav link1={this.state.link1}/>
                <Switch>
                    <Route path="/app/Today" 
                        render={ () => 
                        (
                            <Today activeNav={this.activeNav}  />
                        )} 
                    />
                    <Route path="/app/MyTasks" 
                        render={ () => 
                        (
                            <MyTasks activeNav={this.activeNav} />
                        )}
                    />
                </Switch>
               </div>
           </Router>
        )
    }
}

ReactDOM.render(<App /> , document.getElementById('app'));


    // ----------------- May delete -> using API instead --------------
    // addTaskMaster(task_component)
    // {
    //     //add to array
    //     this.all_tasks.push(task_component)
    //     this.setState({})//rerender so components get updates props

    //     //Debugging code remove 
    //     console.log("Tasks added to master list")
    //     console.log(this.all_tasks);

    //     //in future: maybe contact API and make changes to database
    // }

    // deleteTaskMaster(index){
    //     delete this.all_tasks[index]
    //     // console.log(this.all_tasks);
    //     this.setState({})//rerender so components get updates props
    // }

    // //update allTasks list and rerender
    // setShowInTasks(index){
    //     var taskToBeChanged = this.all_tasks[index]//copy of task so a prop can be modified

    //     //delete the task in master list and add it to back with updated prop 



    //     console.log(index)
    //     console.log(this.all_tasks[index].props)

    //     this.setState({})//rerender so components get updates props
    // }
     // ----------------- May delete -> using API instead --------------
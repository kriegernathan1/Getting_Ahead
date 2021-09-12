import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Task from "../../Layout/Task"
import TopBtns from "./TopBtns"
import TasksContain from "../../Layout/TasksContain"
import SortBtn from './SortBtn'
import { thatReturnsArgument } from 'react-inline-editing'
import 'regenerator-runtime/runtime'
import sendHttpAsync from '../../../cookie.js';

//red: https://www.npmjs.com/package/react-js-loading-progress-bar
import LoadingProgress from 'react-js-loading-progress-bar';//imported for loading animation


// const TASK_API = 'http://127.0.0.1:8000/api/tasks/?format=json'
const TASK_API = '/api/tasks/?format=json'

export class My_tasks extends Component {
    constructor(props){
        super(props);

        this.props.activeNav(false);//make My_Tasks link active

        this.state = {//array of all tasks on page
            tasks: [],
            loading: true,
            showSorted: false,
            sortTasks: []
        };
        

        
        //Array that is updated whenever a task is checked. 
        //This will be used to change showInToday field
        this.checkedTasks = {};

        this.addEvent = this.addEvent.bind(this);//Required 
        this.removeEvent = this.removeEvent.bind(this)
        this.moveToToday = this.moveToToday.bind(this)
        this.JsonToComponent = this.JsonToComponent.bind(this)

        // this.createTasksArray = this.createTasksArray.bind(this);
        this.updateCheckedArr = this.updateCheckedArr.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.sortTasks = this.sortTasks.bind(this);

    }//End constructor

    componentDidMount(){
        this.getTasks();// Get tasks from API
    }

    /**
     * Calls REST API for all Tasks
     */
    getTasks(){

        fetch(TASK_API)
            .then(response => response.json())
            .then(json => this.JsonToComponent(json))
            .catch(error => console.error("Error occurred getting tasks from API", error))
    }

    /**
     * Creates Task components from REST API response with Tasks
     * @param {object} data - response from GET request from task API 
     */
    JsonToComponent(data){
        var tasks_from_API = [] // will be populated from data argument

        //loop through response json and create tasks components
        for(var i = 0; i < data.length; i++)
        {
            if(data[i].showInToday == false)
                //TODO: change time prop 
                tasks_from_API.push(<Task name={data[i].name} time={data[i].time} index={tasks_from_API.length} 
                        importance={data[i].importance} lifeArea={data[i].lifeArea} key={data[i].key}  
                        showInToday={data[i].showInToday} updateCheckedArr={this.updateCheckedArr} remove={this.removeEvent}
                        id={data[i].id} getTasks={this.getTasks} inToday={false}/>)
        }

        this.setState({loading: false, tasks: tasks_from_API})        
    }


    //Creates a new task for page and updates parent component so it can store all tasks on site 
    //also updates current page tasks
    addEvent(){
        const new_key = new Date().getTime();
        const post_api = "/api/tasks/";

        const task_json = {
            "name": "Placeholder",
            "time": "1",
            "importance": "Not Important Not Urgent",
            "lifeArea": "Personal",
            "key": new_key,
            "showInToday": false,
            "completed": false
        }

        // const request_json =  {
        //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(task_json) // body data type must match "Content-Type" header
        // }

        sendHttpAsync(post_api, 'POST' ,task_json)// Send post requests to REST API to create a new entry into DB
            .then(response => this.getTasks())
            .catch(error => console.error("Error occured POST for new Task", error))
    }


    /**
     * Summary - Deletes tasks from screen and removes from API through Fetch request
     * @param {number} index - index of task being deleted within "tasks" state Arr (passed from task component)
     * @param {number} id  - Id corresponding to Django DB primary key for DB 
     */
    removeEvent(index, id){
        //update tasks list and remove element

            delete this.state.tasks[index]


        const delete_api = `/api/tasks/${id}/`
        // const request_json =  {
        //     method: 'DELETE' // *GET, POST, PUT, DELETE, etc.
        // }

        sendHttpAsync(delete_api, 'DELETE')
            .then(response => 
                {
                    if(response.ok)
                        console.log('Successful deletion of task');
                    else
                        console.log("Server responded with a non 200 code upon deletion of task ", response.status)
                });
            
            
        this.setState({})//rerender 
    }

    /*
        Summary. Iterates through the checked task currently on page when "Move to Today" is clicked and sends a PATCH request
                 changing showInToday boolean in DB.
    */
    async moveToToday(){
        
        if(Object.keys(this.checkedTasks).length == 0)
        {
            alert("Select the task(s) you would like to move to today")
            return;
        }

        const update_json = {
            "showInToday": true
        }
    
        for(const task in this.checkedTasks){
            var id = this.checkedTasks[task]
            const PATCH_API = `/api/tasks/${id}/`

            // const request_json =  {
            //     method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            //     headers: {
            //       'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(update_json) // body data type must match "Content-Type" header
            // }
    
            await sendHttpAsync(PATCH_API, 'PATCH' , update_json)// Send post requests to REST API to create a new entry into DB
                .then(response => console.log("Move to today ajax finished"))
                .catch(error => console.error("Error moving task to Today", error))
    
        }

        this.getTasks();
    }

    /*
    Summary. function called by child componet Task that updates checkedTask object that hold all tasks that are checked in page
    @param {number} id => id corresponds to Django ID
    @param {Boolean} checkOrUncheck => true if the task is check. false if the task is not checked. 
    */
    updateCheckedArr(id, checkOrUncheck){
        //If checked then append to array if not already in there 
        //If unchecked then see if in checkedTask object 
            //if so then remove
            //if not pass 
        
        if(checkOrUncheck == true && !(id in this.checkedTasks))
            this.checkedTasks[id] = id;
        else if(!checkOrUncheck && (id in this.checkedTasks))
            delete this.checkedTasks[id]
        
    }

    /**
     * 
     * @param {string} category - sort depends on option given. Either "Personal", "Family", or "Hobby". Otherwise no sort
     */
    sortTasks(category){
        var sortedTasks = []

        if(category == ' '){
            this.setState({showSorted: false})
            return;
        }

       for(const task in this.state.tasks){
            const lifeArea = this.state.tasks[task].props.lifeArea

           if(this.state.tasks[task].props.lifeArea == category){
               sortedTasks.push(this.state.tasks[task])
           }
       }

       this.setState(
           {
            sortedTasks: sortedTasks,
            showSorted: true
        })
    }

   

    render(){
        return(
        <div>
            <div className="topBtns">
                <div>
                    <button className="addTaskBtn" onClick={this.addEvent}>Add Task</button>  
                </div>
                <div>
                    <button className="mvtoday" onClick={this.moveToToday} >Move to today</button>
                    
                </div>
            <SortBtn sortTasks={this.sortTasks}/>
                
            </div>

            {!this.state.showSorted &&
            <div>
                {this.state.tasks}
            </div>
        
            }

            {this.state.showSorted &&
                <div>
                    {this.state.sortedTasks}
                </div>
                
            
            }
                
            
        </div>
        )
    }
}

export default My_tasks;
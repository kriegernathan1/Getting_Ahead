import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Task from "../../Layout/Task"
import ProductiveModal from './ProductiveModal'
import "core-js/stable";
import "regenerator-runtime/runtime";
import { thatReturnsThis } from 'react-inline-editing';
import { array } from 'prop-types';
import sendHttpAsync from '../../../cookie';



// const TASK_API = 'http://127.0.0.1:8000/api/tasks/'
const TASK_API = '/api/tasks/'

export class Today extends Component {
    constructor(props){
        super(props);

        this.state = {
            tasks: [],
            loading: true,
            showModal: false,
            showModalBackground: false,
            showFinishDayModal: false
        }

        this.checkedTasks = {};

        this.props.activeNav(true);//make Today link active

        //binded functions
        this.JsonToComponent = this.JsonToComponent.bind(this)
        this.removeEvent = this.removeEvent.bind(this)
        this.finishDay = this.finishDay.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.setState = this.setState.bind(this);
        this.confirmFinishDay = this.confirmFinishDay.bind(this);
        this.setCheckedTask = this.setCheckedTask.bind(this);
        this.getUncheckedTasks = this.getUncheckedTasks.bind(this);
    }

    componentDidMount(){
        this.getTasks();
        this.getUncheckedTasks();
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log("updated Today")
    }

    getTasks(){
        fetch(TASK_API)
            .then(response => response.json())
            .then(json => {
                this.JsonToComponent(json)
                this.setState({total: this.getTotal()})
            
                })
            .catch(error => console.error("Error occurred getting tasks from API", error))
        this.setState({});
    }



    /**
     * 
     * @param {array} data - arr of JSONs passed from fetch requests to DB 
     */
    JsonToComponent(data){
        var tasks_from_API = [] // will be populated from data argument

        //loop through response json and create tasks components
        for(var i = 0; i < data.length; i++)
        {
            if(data[i].showInToday == true) //only show tasks for this page
                tasks_from_API.push(
                    <Task 
                        name={data[i].name} time={data[i].time} index={tasks_from_API.length} 
                        importance={data[i].importance} lifeArea={data[i].lifeArea} 
                        key={data[i].key} accessKey={data[i].key} showInToday={data[i].showInToday} 
                        id={data[i].id} remove={this.removeEvent} 
                        getParentTasks={this.getTasks} inToday={true}
                        checked={data[i].completed} todayCheckedUpdate={this.setCheckedTask}
                    />)
            if(data[i].completed){
                this.checkedTasks[data[i].id] = data[i].id;
            }
        }

        this.setState({loading: false, tasks: tasks_from_API})
        
    }

    /**
     * Deletes tasks from screen and removes from API through Fetch request.
     * 
     * @param {number} index - index of task being deleted within "tasks" state Arr (passed from task component)
     * @param {number} id  - Id corresponding to Django DB primary key for DB 
     */
    removeEvent(index, id){
        //update tasks list and remove element
        var newTaskArry = [...this.state.tasks]

        newTaskArry.splice(index, 1);

        this.setState({tasks: newTaskArry})


        const delete_api = `/api/tasks/${id}/`
        const request_json =  {
            method: 'DELETE' // *GET, POST, PUT, DELETE, etc.
        }

        sendHttpAsync(delete_api, 'DELETE')
            .then(response => console.log("Response from deleting task", response))
            .catch(error => console.error("Error occurred deleting task", error))
    }

    // Shows modal to user to confirm if they would like to finish day
    //returns true if user does want to finish day and false otherwise
    confirmFinishDay(){
        //show modal to user 
        //set background for modal
        this.setState({
            showModalBackground: true,
            showFinishDayModal: true
        })

        //wait for input from user


    }

    /**
     * Called upon clikc to "Finish day button". Moves all tasks from Today to MyTask using API 
     */
    async finishDay(){
        if(this.state.tasks.length == 0)
            return;

        const update_json = {
            "showInToday": false
        }

        //Iterate over tasks and PATCH request to move to Mytasks or DELETE entirely
        for(const task in this.state.tasks){

            const id = this.state.tasks[task].props.id
            const PATCH_API = `/api/tasks/${id}/`

            console.log(this.state.tasks[task])

            const request_json = {}

            if(id in this.checkedTasks){
                console.log("task being deleted: ", this.state.tasks[task].name)
                //delete task
                request_json =  {
                    method: 'DELETE', // *GET, POST, PUT, DELETE, PATCH, etc.
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(update_json) 
                }

                await sendHttpAsync(PATCH_API, 'DELETE')
                    .then(response => {
                        if(response.ok)
                            console.log("Successful deletion of tasks on finish")
                        else
                            console.log('An error occured Deleting tasks')
                    })
                    .catch(errror => console.log('An error occured deleting tasks in finish day'))

            }
            else
            {
                // request_json =  {
                //     method: 'PATCH', // *GET, POST, PUT, DELETE, PATCH, etc.
                //     headers: {
                //       'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify(update_json) 
                
                // }
                await sendHttpAsync(PATCH_API, 'PATCH' ,update_json)// Send post requests to REST API to create a new entry into DB
                    .then(response => {
                    if(response.ok)
                        console.log("Successful PATCH of tasks In finish day")
                    else
                        console.log('An error occured PATCHING tasks')
                    })
                    .catch(errror => console.log('An error occured deleting tasks in finish day'))
            }

            
    
        }

        window.location.href = "/MyTasks"
    }

    /**
     * takes time in supported formates and return number of mintues
     * @param {string} time -> time in string form of HH:MM, or MM. Should be validated before.
     */
    timeToMinutes(time){
        var split_time = time.split(':');
        var total_time; 

        //Form 1 HH:MM
        if(split_time.length == 2)
        {
            //Hours + Minutes
            total_time = (Number(split_time[0]) * 60) + Number(split_time[1])
        }
        //Form 2 MM
        else
        {
            total_time = Number(split_time[0])
        }

        return total_time;
    }


    getTotal(){
        var total = 0;
        for(const task in this.state.tasks)
        {
            var time_string = this.state.tasks[task].props.time;
            total += Number(time_string)
        }

        total *= 25;
        total /=60;
        total = total.toFixed(2);

        return total;

    }

    setCheckedTask(checkOrUncheck, id){
        if(checkOrUncheck == true && !(id in this.checkedTasks))
            this.checkedTasks[id] = id;
        else if(!checkOrUncheck && (id in this.checkedTasks))
            delete this.checkedTasks[id]

        console.log("Today checked tasks are: ", this.checkedTasks)
    }

    getUncheckedTasks(){
        var tasksCopy = [...this.state.tasks];
        var uncheckedTask = []
        console.log(this.checkedTasks)

        for(const task in tasksCopy){
            //check if task id is in checkedarr
            if(tasksCopy[task].props.id in this.checkedTasks)
                continue;
            else
                uncheckedTask.push(tasksCopy[task])
        }

        console.log(tasksCopy)
        return uncheckedTask;
    }

    
    render(){
        //Setting red color if total time in day is greater than 14 hours
        var colorOfTotal = {}
        var total = this.getTotal();
        var total_display = "";
    
        if(total > 14)
            colorOfTotal = {"color": "red"}
        else
            colorOfTotal = {"color": "blue"}

        return(
            <div className="Today">
                {this.state.showModalBackground && 
                <div className='dropdown-backdrop'> </div>
                }

                <div className={`Today-Container`} >
                    {this.state.tasks.length == 0 &&
                        <p className='no-tasks'>
                            No Tasks to complete. Go to My Tasks to create new tasks and move here.
                        </p>
                    }

                    {!this.state.tasks.length == 0 &&  
                        <div className="productivity-container"> 
                            <button id="start-day" onClick={ () => {
                                if(this.getUncheckedTasks().length > 0)
                                    this.setState({showModal: true, showModalBackground: true})
                                else
                                    alert("All Tasks are completed. Uncheck tasks or add more from MyTasks")
                                }
                            } 
                                > 
                                Start Day 
                            </button>
                            <button id="finishDay-btn" onClick={this.confirmFinishDay}>
                                Finish Day
                            </button>
                        </div>
                    }
                
                    {this.state.tasks}

                {this.state.tasks.length > 0 &&
                    <div className="totals">
                        <p style={colorOfTotal}>  Today's Workload: {this.state.total} Hours</p>
                    </div>
                }

                {this.state.showModal &&
                <div className='productive-modal-container'>
                    <ProductiveModal  setParentState={this.setState.bind(this)} tasks={this.getUncheckedTasks()}/>
                </div>}

                {this.state.showFinishDayModal &&
                    <div className='finish-day-modal'>
                        <h3>Confirm Finish Day</h3>
                        <p> Are you sure you would like to finish day? All tasks that are marked complete will be deleted and the rest moved to MyTasks. </p>

                        <div className='btn-holder-finishday'>
                            <button id='finishDay_yes' onClick={this.finishDay}>Yes, Finish Day</button>
                            <button id='finishDay_cancel' onClick={() => {
                                this.setState(
                                    {
                                        showFinishDayModal: false,
                                        showModalBackground: false
                                    }
                                )
                            }}>Cancel</button>
                        </div>
                    </div>

                }
                </div>
            </div>

        )
    }
}

export default Today

{/* <div className="today">
<h3>Today</h3>
</div>
<Task name="First Task" importance="super" time="2 hours" /> */}
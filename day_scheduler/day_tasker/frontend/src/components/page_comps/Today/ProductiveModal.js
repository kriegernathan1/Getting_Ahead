import React, { Component, Fragment, useState } from 'react'
import ReactDOM from 'react-dom'
import Timer from './Timer'
import Task from "../../Layout/Task"
import { isGeneratorFunction } from 'regenerator-runtime';
import sendHttpAsync from '../../../cookie';



export class ProductiveModal extends Component{
    constructor(props){
        super(props);

        //converts task component to task highlight component
        var masterTasks = this.props.tasks.map(task => {
            return(
                <TaskHighlight completedClass=' ' key={task.props.accessKey} 
                    accessKey={task.props.accessKey} name={task.props.name} 
                    time={task.props.time} id={task.props.id}
                />
                
            )
        });

        this.masterTasks = masterTasks 
        this.firstTask = masterTasks[0];
        masterTasks = masterTasks.splice(1)

        this.state = {
            currentTaskIndex: 0,
            taskTime: this.props.tasks[0].props.time,
            task: this.props.tasks[0].props.name,
            nextCompleted: this.firstTask,
            id: this.props.tasks[0].props.id,
            showTasks: masterTasks,
            completedTasks: [],
            haveTasks: true,
            hasNextTask: true
        }

        this.updateTasks = this.updateTasks.bind(this);
        this.decrementTime = this.decrementTime.bind(this);
    }

    



    /**
     * On check move checked task to completed task array and delete the task from 
     */
    async updateTasks(){
        var completedTaskCopy = [...this.state.completedTasks];
        var showTasksCopy = [...this.state.showTasks];
        var currentTaskIndexCopy = this.state.currentTaskIndex + 1;

        const nextCompletedUpdate = showTasksCopy[0];//next task highlight when complete

        //Append the task in focus to the completed task and then remove it from showTasks

        completedTaskCopy.push(this.state.nextCompleted)    

        var newTask = showTasksCopy[0];

        //update API for completed task
        const id = this.state.id;
        const PATCH_API = `/api/tasks/${id}/`


        await sendHttpAsync(PATCH_API, 'PATCH', {completed: true})// Send post requests to REST API to create a new entry into DB
                .then(response => console.log(response))
                .catch(error => console.error("Error marking task complete in productivity modal", error))

        

        if(showTasksCopy.length > 1){
            //remove first element of showtasks array after it has been moved to completed tasks
            showTasksCopy = showTasksCopy.splice(1)

            this.setState({
                currentTaskIndex: currentTaskIndexCopy,
                taskTime: newTask.props.time,
                nextCompleted: nextCompletedUpdate,
                task: newTask.props.name,
                showTasks: showTasksCopy,
                completedTasks: completedTaskCopy,
                id: newTask.props.id,

            })
        }
        else if(showTasksCopy.length == 1) //remove next tasks h2 by changin state variable hasNextTask
        {
            showTasksCopy = showTasksCopy.splice(1)
            this.setState({
                currentTaskIndex: currentTaskIndexCopy,
                taskTime: newTask.props.time,
                nextCompleted: nextCompletedUpdate,
                task: newTask.props.name,
                showTasks: showTasksCopy,
                completedTasks: completedTaskCopy,
                hasNextTask: false,
                id: newTask.props.id
            })


        }
        else{
            this.setState({
                haveTasks: false,
                completedTasks: completedTaskCopy,
            })
        }
    }

    /**
     * Decrement time of current task when timer finishes
     */
    decrementTime(){
        const newTime = this.state.taskTime -1;

        if(newTime >= 0)
            this.setState({
                taskTime: this.state.taskTime-1
            });    
    }





    render(){

        var completedTasks = this.state.completedTasks

        return(
            <div className="productive-modal"> 
                <button id="close-modal" onClick={ () => {
                    this.props.setParentState({showModal: false, showModalBackground: false})
                    location.reload();
                }}
                    >
                <   svg viewBox="0 0 24 24" className="icon_close" width="24" height="24"><path fill="currentColor" fillRule="nonzero" d="M5.146 5.146a.5.5 0 0 1 .708 0L12 11.293l6.146-6.147a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 0 .708L12.707 12l6.147 6.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.708 0L12 12.707l-6.146 6.147a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1 0-.708L11.293 12 5.146 5.854a.5.5 0 0 1-.057-.638z"></path></svg>
                </button>
                <h2>Workday</h2>
                <Timer decrementTime={this.decrementTime}/>

                {this.state.haveTasks &&

                    <div>
                        <h2 id="modal-focus">Focus</h2>

                    

                        <div> 
                            <div className={`task-holder`}>
                            
                                <div className='checkbox-and-task'>

                                    <input type='checkbox' onChange={e => {
                                        
                                        if(this.state.currentTaskIndex < this.props.tasks.length)
                                        {
                                            this.updateTasks();
                                            e.target.checked = false;
                                        }
                                        

                                    }}/>
                                    
                                    <div>
                                        <p><span id="task-name">{this.state.task}</span></p>
                                    </div>
                                </div>
                                
                                <p> Time Remaining: <span>{this.state.taskTime} Pomodoro(s)</span></p>
                            </div>

                            
                        {this.state.hasNextTask &&
                            <div className="remaining-tasks">
                                <h2>Next Task(s)</h2>
                                {
                                    this.state.showTasks
                                }

                            </div>

                        }

                        </div>
                    </div>
                }

                {this.state.completedTasks.length > 0 &&
                
                <div className='completed-tasks-container'>
                    <h2>Completed Task</h2>
                    <div className="completed-tasks-list">
                        {
                            completedTasks
                        }
                    </div>
                </div>
                }
                
            </div>
        )



    }
}



const TaskHighlight = props => {
    var completedClass = props.completedClass;

    function pomodoroToTime(time){

    }

    return(
        <div id={props.accessKey} className={`taskHighlight ${completedClass}`}>
            <div>
                <p>Task: <span id="task-name">{props.name}</span></p>
            </div>
                
            {/* <p> 
                Time Remaining: <span>{props.time} Pomodoro(s)</span>
            </p> */}
            </div>
    )

}

export default ProductiveModal



// secondsToTimeFormat(secs, firstRender=false){
//     let hours = Math.floor(secs / (60 * 60));

//     let divisor_for_minutes = secs % (60 * 60);
//     let minutes = Math.floor(divisor_for_minutes / 60);

//     let divisor_for_seconds = divisor_for_minutes % 60;
//     let seconds = Math.ceil(divisor_for_seconds);

//     let obj = {
//       "h": hours,
//       "m": minutes,
//       "s": seconds
//     };

//     if(obj['h'] == 0)    
//         obj['h'] = obj['h'].toString().padEnd(2, "0")
//     if(obj['m'] == 0)    
//         obj['m'] = obj['m'].toString().padEnd(2, "0")
//     if(obj['s'] == 0)    
//         obj['s'] = obj['s'].toString().padEnd(2, "0") 
    
//     return `${obj['h']}:${obj['m']}:${obj['s']}` //HH:MM:SS        
// }


// timeToSeconds(time){
//     var split_time = time.split(':');
//     var total_time; 

//     //Form 1 HH:MM
//     if(split_time.length == 2)
//     {
//         //Hours + Minutes
//         total_time = (Number(split_time[0]) * 60) + Number(split_time[1])
//     }
//     //Form 2 MM
//     else
//     {
//         total_time = Number(split_time[0])
//     }

//     return total_time*60;
// }

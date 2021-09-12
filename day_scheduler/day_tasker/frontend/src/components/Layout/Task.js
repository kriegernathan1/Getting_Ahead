//React component for all tasks on website 

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

//third party libraries 
import EditableLabel from 'react-inline-editing';
import Dropdown from "react-bootstrap/Dropdown"
import "core-js/stable";
import "regenerator-runtime/runtime";
import sendHttpAsync from '../../cookie.js';

export class Task extends Component {
    constructor(props){
        super(props);

        var checked
        if(this.props.inToday)
        {
            checked = this.props.checked
        }
        else{
            checked = false
        }

        this.state = {
            importance: this.props.importance,
            checked: checked,
            lifeArea: this.props.lifeArea,
            time: this.props.time,
            time_comp:  <div id="time">
                            <EditableLabel 
                                text={this.props.time}
                                labelFontSize='1.1em'
                                labelFontWeight='600'
                                onFocusOut={this.onTimeChange.bind(this)}
                            />
                        </div> ,
            style: {},
            mainClass: 'default',
            completedClass: '',
            showRemoveModal: false,
            name: this.props.name
        }

        this.removeTask = this.removeTask.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.onImportanceChange = this.onImportanceChange.bind(this);
        this.onLifeAreaChange = this.onLifeAreaChange.bind(this);
        this.validateTime = this.validateTime.bind(this);
        this.assignColor = this.assignColor.bind(this);
        this.handleWrongTime = this.handleWrongTime.bind(this);
        this.confirmRemoveTask = this.confirmRemoveTask.bind(this);
    }
    
    componentDidMount(){
        this.assignColor();

    }


    //Use callback function to update parent component and delete the task
    removeTask(){
        this.props.remove(this.props.index, this.props.id)
        this.setState({showRemoveModal: false})
    }


    onCheck(e){

        //change state to reflect the checked box or unchecked
        this.state.checked = e.target.checked;
        this.setState({checked: e.target.checked})

       
        if(!this.props.inToday)//only call when task is within myTasks
            this.props.updateCheckedArr(this.props.id, e.target.checked);
        
        if(this.props.inToday)
        {
            if(e.target.checked)
            {
                this.setState({completedClass: 'completedTask'})
                this.props.todayCheckedUpdate(true, this.props.id)
            }
            else
            {
                this.setState({completedClass: ' '})
                this.props.todayCheckedUpdate(false, this.props.id)

            }

            this.updateAPI({completed: e.target.checked})
                .then(() => console.log("Task completed status changed"))
                .catch((error) => console.error("Task completed status update "))
         }

        }
            

    onNameChange(event){
        
        if(event != this.props.name && event.trim() != '')
        {
            var update_json = {
                name: event
            }
            
            this.updateAPI(update_json)
        }
        else if(event == this.props.name)
            return;
        else{
            alert('No empty task names. Please try again. ');
            location.reload();
            return;
        }
    }

    onTimeChange(event){
        var validTime = this.validateTime(event)

        if(event != this.props.time && validTime)
        {
            var update_json = {
                time: event
            }
            this.setState({time: event})
            this.updateAPI(update_json)
                .then(() => this.props.getParentTasks())
                .catch(error => console.error("Error updating task in API ", error))
        }
        else
        {
            if(event == this.props.time)//Dont do anything if no change detected
            {
                console.log("No Change detected");    
                return;
            }

            alert("The time entered for a task must be an integer and between 1 and 10. Please try again.");
            location.reload();
            console.log("Incorrect time entered")
        }
            

    }

    onImportanceChange(change){

        var update_json = {
            importance: change
        }

        console.log("importance change")
        
        this.updateAPI(update_json)
            .then(() => this.assignColor())
    }

    onLifeAreaChange(change){
        
        var update_json = {
            lifeArea: change
        }
        
        this.updateAPI(update_json)

    }


    // call API to update task 
    async updateAPI(update_json){
        const id = this.props.id
    
        const PUT_API = `/api/tasks/${id}/`

        // const request_json =  {
        //     method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(update_json) // body data type must match "Content-Type" header
        // }

        await sendHttpAsync(PUT_API, 'PATCH', update_json)// Send post requests to REST API to create a new entry into DB
            .then(response => console.log("Task updated"))
            .catch(error => console.error("Error occured trying to PUT for task", error))

    }

   

    /**
    *  helper function that change time label so user is aware of incorrect time input
    * @param {string} time - incorrect time input from user 
    */
   handleWrongTime(time){

    this.setState(
        {
            time: 'INVALID'
        }
    )


    }


    /**
    * Validates client format of time input.
    * @param {string} time - string that should be a integer less than 10
    */
   validateTime(time){
        var time_compare = Number(time)

        if(time_compare == NaN)
        {
            console.error('Time input is not a number')
            this.handleWrongTime(time);
            return false;
        }
        if(!Number.isInteger(time_compare))
        {
            console.error("Time is not an integer")
            this.handleWrongTime(time);
            return false;
        }
        if(time_compare > 10 || time_compare < 0)
        {
            console.error("Time not within bounds. Must be greater than 0 and less than or equal to 10")
            this.handleWrongTime(time);
            return false;
        }

        return true;

   }







    /**
     * Changes color styling of task based on life area
     */
    assignColor()
    {
        var importance = this.state.importance;

        switch(importance)
        {
            case "Important and Urgent":
            {
                this.setState({mainClass: 'importantandUrgent'});
                break;
            }
            case "Important but Not Urgent":
            {
                this.setState({mainClass: 'importantAndNotUrgent'});
                break;
            }
            case "Urgent but Not Important":
            {
                this.setState({mainClass: 'urgentButNotImportant'});
                break;
            }
            case "Not Important Not Urgent":
            {
                this.setState({mainClass: 'notImportantNotUrgent'});
                break;
            }
        }
            
    }

    confirmRemoveTask(){
        //show modal
        this.setState({
            showRemoveModal: true
        });
        
    }



    render(){
        const trash = <img id="deleteTask" src="/static/svg/trash2.jpeg" />

        return (

        <div className={`task ${this.state.mainClass} ${this.state.completedClass}`}>

            {/* modal only shown when delete pressed */}

            {this.state.showRemoveModal &&
            <div>
                <div className='dropdown-backdrop'/>
                <div className='remove-task-modal'>
                    <h3>Remove Task?</h3>

                    <div className='task-modal-btnholder'>
                        <button id='removeTask_yes' onClick={this.removeTask}>Yes</button>
                        <button id='removeTask_no' onClick={() => this.setState({showRemoveModal: false})} >No</button>
                    </div>
                </div>
            </div>
            }

            <div className="checkbox-n-button">
                <input  checked={this.state.checked} id="cbox" type="checkbox" onChange={this.onCheck}/>
                <button className="deleteTask-btn" onClick={(this.confirmRemoveTask)}> {trash}</button>
            </div>

            <div className="taskName" id={this.props.id}> 
                <EditableLabel 
                    inputId={this.state.color}
                    text={this.state.name}
                    labelFontSize='1em'
                    labelFontWeight='600'
                    onFocusOut={this.onNameChange}
                />
            </div>
            

            
            <div id="time">
                <EditableLabel inputId={this.state.colorClass} text={this.state.time} 
                    labelFontSize='1.1em' labelFontWeight='600' onFocusOut={this.onTimeChange}
                /> 
                Pomodoro(s)
            </div> 
        
            <div className="importance">
                <div className="importance-inner">
                    <Dropdown>
                        <Dropdown.Toggle 
                            variant="secondary" 
                            id="dropdown-basic"
                            size="sm"
                        >
                            {this.state.importance}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item id="important-and-urgent-select" onSelect={() => {this.setState({importance: "Important and Urgent"}); this.onImportanceChange("Important and Urgent")}}>Important and Urgent</Dropdown.Item>
                            <Dropdown.Item id="important-not-urgent-select" onSelect={() => {this.setState({importance: "Important but Not Urgent"}); this.onImportanceChange("Important but Not Urgent")}}>Important but Not Urgent</Dropdown.Item>
                            <Dropdown.Item id="urgent-not-important-select" onSelect={() => {this.setState({importance: "Urgent but Not Important"}); this.onImportanceChange("Urgent but Not Important")}}>Urgent but Not Important</Dropdown.Item>
                            <Dropdown.Item id="not-important-select" onSelect={() => {this.setState({importance: "Not Important Not Urgent"}); this.onImportanceChange("Not Important Not Urgent")}}>Not Important Not Urgent</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Toggle 
                            variant="secondary" 
                            id="dropdown-basic"
                            size="sm"
                        >
                            {this.state.lifeArea}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onSelect={() => {this.setState({lifeArea: "Personal"}); this.onLifeAreaChange("Personal")}}>Personal</Dropdown.Item>
                            <Dropdown.Item onSelect={() => {this.setState({lifeArea: "Family"}); this.onLifeAreaChange("Family")}}>Family</Dropdown.Item>
                            <Dropdown.Item onSelect={() => {this.setState({lifeArea: "Career"}); this.onLifeAreaChange("Career")}}>Career</Dropdown.Item>
                            <Dropdown.Item onSelect={() => {this.setState({lifeArea: "Hobby"}); this.onLifeAreaChange("Hobby")}}>Hobby</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </div>

            </div>
        </div>
        

        )
    }
}

export default Task









 // /**
    //  * Validates client format of time input.
    //  * @param {string} time - string that represents time (HH:MM:SS or MM:SS or MM) 
    //  */
    // validateTime(time){
    //     var time_string = time.split(':')
    
    //     //Check each entry in time_string array for a non number
    //     for(time in time_string)
    //     {
    //         var target = time_string[time];
    //         if(isNaN(Number(target)))
    //         {
    //             console.error("Time is not a number")
    //             return false

    //         }
            
    //     }
        

    //     if(time_string.length > 2)
    //     {
    //         console.error("Time has too many entries. Max should be HH:MM")
    //         return false;
    //     }
    //     else{
    //         //MM
    //         if((time_string == 1) &&  time_string[0] > 12)
    //         {
    //             console.error("Too many hours in Time")
    //             return false;
    //         }
    //         //HH:MM
    //         if(time_string == 2 && (time_string[0] > 12 || time_string[1] >= 60))
    //         {
    //             console.error("Time error. Either Minutes or hours too high or low")
    //             return false;
    //         }
                
    //     }

    //     return true
    // }
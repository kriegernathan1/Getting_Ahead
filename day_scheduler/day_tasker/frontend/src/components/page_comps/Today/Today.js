import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Task from "../../Layout/Task"
import ProductiveModal from './ProductiveModal'
import "core-js/stable";
import "regenerator-runtime/runtime";



const TASK_API = 'http://127.0.0.1:8000/api/tasks/'

export class Today extends Component {
    constructor(props){
        super(props);

        this.state = {
            tasks: [],
            loading: true,
            showModal: false,
            showModalBackground: false
        }

        this.props.activeNav(true);//make Today link active

        //binded functions
        this.JsonToComponent = this.JsonToComponent.bind(this)
        this.removeEvent = this.removeEvent.bind(this)
        this.finishDay = this.finishDay.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.setState = this.setState.bind(this);
    }

    componentDidMount(){
        this.getTasks();
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
                //TODO: change time prop 
                tasks_from_API.push(
                    <Task 
                        name={data[i].name} time={data[i].time} index={tasks_from_API.length} 
                        importance={data[i].importance} lifeArea={data[i].lifeArea} 
                        key={data[i].key} accessKey={data[i].key} showInToday={data[i].showInToday} 
                        id={data[i].id} remove={this.removeEvent} 
                        getParentTasks={this.getTasks} inToday={true}
                    />)
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

        delete this.state.tasks[index]


        const delete_api = `/api/tasks/${id}/`
        const request_json =  {
            method: 'DELETE' // *GET, POST, PUT, DELETE, etc.
        }

        fetch(delete_api, request_json)
            .then(response => console.log("Response from deleting task", response))
            .catch(error => console.error("Error occurred deleting task", error))
        


        this.getTasks();
    }

    /**
     * Called upon clikc to "Finish day button". Moves all tasks from Today to MyTask using API 
     */
    async finishDay(){
        //Iterate over tasks and PATCH request to API to change showInToday to false and rerender
        if(this.state.tasks.length == 0)
            return;

        const update_json = {
            "showInToday": false
        }

        for(const task in this.state.tasks){
            const id = this.state.tasks[task].props.id
            const PATCH_API = `/api/tasks/${id}/`
            
            const request_json =  {
                method: 'PATCH', // *GET, POST, PUT, DELETE, PATCH, etc.
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(update_json) 
            }
    
            await fetch(PATCH_API, request_json)// Send post requests to REST API to create a new entry into DB
                .then(response => console.log(response))
                .catch(error => console.error("Error Finishing tasks in Today", error))
    
        }

        this.getTasks();
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


    /**
     * Iterates through tasks in this.state.tasks and sums the total of estimated working time
     */
    // getTotal(){
    //     var total = 0;
    //     for(const task in this.state.tasks)
    //     {
    //         var time_string = this.state.tasks[task].props.time;
    //         total += this.timeToMinutes(time_string)
    //     }

    //     total /= 60;
    //     total = total.toFixed(2)

    //     return total;
    // }

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
                    <div className="productivity-container"> 
                        <button id="start-day" onClick={ () => {
                            if(this.state.tasks.length > 0)
                                this.setState({showModal: true, showModalBackground: true})
                            }} > 
                            
                            Start Day </button>
                        <button id="finishDay-btn" onClick={this.finishDay}>Finish Day</button>
                    </div>
                
                    {this.state.tasks}

                {this.state.tasks.length > 0 &&
                    <div className="totals">
                        <p style={colorOfTotal}>  Today's Workload: {this.state.total} Hours</p>
                    </div>
                }

                {this.state.showModal &&
                <div className='productive-modal-container'>
                    <ProductiveModal  setParentState={this.setState.bind(this)} tasks={this.state.tasks}/>
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
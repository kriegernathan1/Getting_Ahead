import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'


export class Timer extends Component{

    constructor(props){
        super(props);

        this.state = {
            time: this.secondsToTimeFormat(this.props.time, true),
            seconds: this.props.time,
            firstRender: false,
            countingDown: false,
            pomodoroTimeFormat: this.secondsToTimeFormat(1500, true, true),
            pomodoroTimeSeconds: 0
        }

        this.intervalId; //id of set interval call for cancelling
        this.started = false;
        this.pauseCountDown = false;

        this.secondsToTimeFormat = this.secondsToTimeFormat.bind(this);
        this.pomodoro = this.pomodoro.bind(this);
    }


    componentDidMount(){
        this.setState({firstRender: true})
    }

    /**
     * Converts seconsd to HH:MM:SS format
     * @param {Number} secs - total seconds to convert to a time string
     */
    secondsToTimeFormat(secs, firstRender=false, pomodoro=false){
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };

        if(!firstRender)
            this.setState({seconds: secs})

        // Add 0 to beginning or end depending on number of seconds
        if(obj['h'] == 0  )    
            obj['h'] = obj['h'].toString().padEnd(2, "0")
        if(obj['h'] < 9 && obj['h'] > 0)    
            obj['h'] = obj['h'].toString().padStart(2, "0")

        if(obj['m'] == 0)    
            obj['m'] = obj['m'].toString().padEnd(2, "0")

        if(obj['m'] <= 9 && obj['m'] > 0)
            obj['m'] = obj['m'].toString().padStart(2, "0")

        if(obj['s'] == 0)    
            obj['s'] = obj['s'].toString().padEnd(2, "0") 

        if(obj['s'] < 9 && obj['s'] > 0)
            obj['s'] = obj['s'].toString().padStart(2, "0")

        if(pomodoro)
        {
            //hours are missing only return minutes and seconds
            if(obj['h'] <= 0)
                return `${obj['m']}:${obj['s']}`
        }
        
        
        return `${obj['h']}:${obj['m']}:${obj['s']}` //HH:MM:SS        
    }

    
    
    /**
     * 
     * @param {string} type - sets countdown timer => three options for countdown: 'regular' (25 min) 'break' (5 min) 'long break' (10 min) 
     */
    pomodoro(type, pomodoro=false){

        this.started = true;

        const clock = (pomodoro) => {
            this.intervalId = setInterval(() => {
                if(!this.pauseCountDown && this.state.pomodoroTimeSeconds > 0)
                {
                    this.setState({pomodoroTimeFormat: this.secondsToTimeFormat(this.state.pomodoroTimeSeconds - 1, false, pomodoro),
                                pomodoroTimeSeconds: this.state.pomodoroTimeSeconds - 1
                                })
                }
                else if (this.state.pomodoroTimeSeconds <= 0){
                    this.props.decrementTime();
                    this.started = false;
                    clearInterval(this.intervalId)
                }
            }, 1000);

        }

        switch(type){
            case 'regular':{
                this.setState({pomodoroTimeSeconds: 1500}, clock(pomodoro))
                break;
            }
            case 'break':{
                this.setState({pomodoroTimeSeconds: 300}, clock(pomodoro))
                break;
            }
            case 'long break':{
                this.setState({pomodoroTimeSeconds: 600}, clock(pomodoro))
                break;
            }
            default:{
                console.error("pomodoro time not passed correct type")
                break;
            }
        }

     

    }


    render(){

        return(
            <div className="timer">
                
                
                
                <div className="timer-btns">
                    <div className='breaks-btns'>
                            <button className="timer-btn break" onClick={() => 
                                {
                                    this.pauseCountDown = false;
                                    clearInterval(this.intervalId); 
                                    this.pomodoro('break', true)
                                    
                                }}>Short Break</button>
                            <button className="timer-btn long-break" onClick={() => 
                                {
                                    this.pauseCountDown = false;
                                    clearInterval(this.intervalId); 
                                    this.pomodoro('long break', true)
                                }}>Long Break
                            </button>
                    </div>

                    <div className="time"> 
                        <p className="countdown">{this.state.pomodoroTimeFormat}</p>
                    </div>

                    <div className='timer-function'>
                        <button className='start-timer timer-btn' onClick={() => 
                        {
                            if(!this.started) //only call function if not started yet
                                this.pomodoro('regular', true);
                            
                            else{
                                this.pauseCountDown = false;
                            }
                            

                            
                        }}>Start</button>

                        <button className='stop-timer timer-btn' onClick={() => 
                            {
                                this.pauseCountDown = true;


                            }}>Stop
                        </button>

                        <button className='reset-timer timer-btn' onClick={() => 
                            {
                                clearInterval(this.intervalId);
                                this.pauseCountDown = true;
                                this.setState({pomodoroTimeFormat: '25:00'})
                                this.pomodoro('regular', true)
                            }}>Reset
                        </button>

                    </div>

 

                    
                   
                    

                </div>

                
            </div>
        )
    }




}

export default Timer;
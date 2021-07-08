import React, { Component } from 'react'
import ReactDOM from 'react-dom'


export class Nav extends Component {
  constructor(props)
  {
    super(props);

  }
    render(){
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">Plowing Ahead</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                {/* Logic for which link to make active */}

                {/* Make link 1 active */}
                {this.props.link1 && 
                <li className="nav-item active">
                  <a className="nav-link" href="/">Today <span className="sr-only">(current)</span></a>
                </li>
                }


                {/* Link 1 not active */}
                {!this.props.link1 &&
                <li className="nav-item">
                  <a className="nav-link" href="/">Today <span className="sr-only">(current)</span></a>
                </li>
                }

                {/* Make link 2 active */}
                {!this.props.link1 &&
                <li className="nav-item active">
                    <a className="nav-link" href="/MyTasks">My Tasks <span className="sr-only">(current)</span></a>
                </li>
                } 

                {/* Link 2 not active */}
                {this.props.link1 &&
                <li className="nav-item">
                    <a className="nav-link" href="/MyTasks">My Tasks <span className="sr-only">(current)</span></a>
                </li>
                } 
              </ul>
            </div>
          </nav>
        )
    }
}

export default Nav

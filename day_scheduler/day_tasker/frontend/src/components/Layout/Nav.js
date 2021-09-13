import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import logo from '../../../static/assets/app_logo.svg'

export class Nav extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      username: 'User'
    }

  }

  componentDidMount(){
    fetch('/app/username')
      .then(response => {
        if(response.ok)
        {
          response.json()
            .then(data => this.setState({username: data.username}))
        }
        else{
          console.error("Unable to request username")
        }
      })
      .catch(error => console.log("An error occurred when requesting username ", error))
  }

    render(){
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="/app/Today">
              <img src={logo} className="logo" />
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                {/* Logic for which link to make active */}

                {/* Make link 1 active */}
                {this.props.link1 && 
                <li className="nav-item active">
                  <a className="nav-link" href="/app/Today">Today <span className="sr-only">(current)</span></a>
                </li>
                }


                {/* Link 1 not active */}
                {!this.props.link1 &&
                <li className="nav-item">
                  <a className="nav-link" href="/app/Today">Today <span className="sr-only">(current)</span></a>
                </li>
                }

                {/* Make link 2 active */}
                {!this.props.link1 &&
                <li className="nav-item active">
                    <a className="nav-link" href="/app/MyTasks">My Tasks <span className="sr-only">(current)</span></a>
                </li>
                } 

                {/* Link 2 not active */}
                {this.props.link1 &&
                <li className="nav-item">
                    <a className="nav-link" href="/app/MyTasks">My Tasks <span className="sr-only">(current)</span></a>
                </li>
                } 

              

                <NavDropdown title={`Hello ${this.state.username}`} id="collasible-nav-dropdown" className='dropdown-custom'>
                  <NavDropdown.Item href="/accounts/logout/">Logout</NavDropdown.Item>
                </NavDropdown>
              </ul>
            </div>
          </nav>
        )
    }
}

export default Nav

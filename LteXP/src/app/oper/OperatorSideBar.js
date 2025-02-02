import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';
import { AuthContext } from '../App';

class Sidebar extends Component {
  state = {};
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      // this.onRouteChanged();
    }
  }

  render () {

    return (
      <AuthContext.Consumer>
         
        { ({state}) => (
          
              <nav className="sidebar sidebar-offcanvas" id="sidebar">
              <div className="text-center sidebar-brand-wrapper d-flex align-items-center nav-link" style={{cursor:'pointer'}} onClick={ () => this.props.history.push("/") }>
                {state.isOnline && <a href="/" className="sidebar-brand brand-logo"><img src="/images/logo_new.png" alt="logo" /></a>}
                <a href="/" className="sidebar-brand brand-logo-mini pt-3"><img src="/images/logo-mini.png" alt="logo" /></a>
              </div>
              <ul className="nav">
             
                <li className='nav-item'>
                  <div className={'nav-link'} onClick={ () => this.props.history.push("/") } data-toggle="collapse">
                    <i className="mdi mdi-home menu-icon"></i>
                    <span className="menu-title">Arrival Batch Mannagent</span>
                  </div>
                </li>
              </ul>
            </nav>
        )}
    </AuthContext.Consumer>);
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    // this.onRouteChanged();
    // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);

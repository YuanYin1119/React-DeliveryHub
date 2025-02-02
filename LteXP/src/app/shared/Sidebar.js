import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Sidebar extends Component {
  state = {};
  // toggleMenuState(menuState) {
  //   if (this.state[menuState]) {
  //     this.setState({[menuState] : false});
  //   } else if(Object.keys(this.state).length === 0) {
  //     this.setState({[menuState] : true});
  //   } else {
  //     Object.keys(this.state).forEach(i => {
  //       this.setState({[i]: false});
  //     });
  //     this.setState({[menuState] : true});
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({[i]: false});
    });

    // console.log(this.props.isAdmin);

  }
  render () {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="text-center sidebar-brand-wrapper d-flex align-items-center">
          <a className="sidebar-brand brand-logo" href="/"><img src="/images/logo-mini.png" alt="logo"/></a>
          <a className="sidebar-brand brand-logo-mini pt-3" href="/"><img src="/images/logo-mini.png" alt="logo" /></a>
        </div>
        <ul className="nav">

        <li className={this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item' }>
          <div className={'nav-link'} onClick={ () => this.props.history.push("/dashboard") } data-toggle="collapse">
            <i className="mdi mdi-home menu-icon"></i>
            <span className="menu-title">DashBoard</span>
          </div>
       </li>

       <li className={ this.isPathActive('/admin/arrivalbatchmanagement') ||  this.isPathActive('/arrivalbatch')  ||  this.isPathActive('/admin/deliveryoverview')? 'nav-item active' : 'nav-item' }> 
           <div className={'nav-link'} onClick={ () => this.props.history.push("/admin/arrivalbatchmanagement") } data-toggle="collapse">
            <i className="mdi mdi-book menu-icon"></i>
            <span className="menu-title">Arrival Batch Management</span>
          </div>
      </li>

      <li className={ this.isPathActive('/admin/ordermanagement') || this.isPathActive('/admin/orderdetails')  
      || this.isPathActive('/admin/ordertracking') || this.isPathActive('/admin/orderhistory') ? 'nav-item active' : 'nav-item' }> 
           <div className={'nav-link'} onClick={ () => this.props.history.push("/admin/ordermanagement") } data-toggle="collapse">
            <i className="mdi mdi-buffer menu-icon"></i>
            <span className="menu-title">Order Management</span>
          </div>
      </li>

      <li className={ this.isPathActive('/admin/deliverymanagement') ||  this.isPathActive('/admin/routeplanning')? 'nav-item active' : 'nav-item' }> 
           <div className={'nav-link'} onClick={ () => this.props.history.push("/admin/deliverymanagement") } data-toggle="collapse">
            <i className="mdi mdi-truck-delivery menu-icon"></i>
            <span className="menu-title">Delivery Management</span>
          </div>
      </li>

      {/* <li className={ this.isPathActive('/admin/reports') ? 'nav-item active' : 'nav-item' }> 
           <div className={'nav-link'} onClick={ () => this.props.history.push("/admin/reports") } data-toggle="collapse">
            <i className="mdi mdi-file-search-outline menu-icon"></i>
            <span className="menu-title"> Report </span>
          </div>
      </li> */}

      <li className={ this.isPathActive('/admin/drivers') ? 'nav-item active' : 'nav-item' }> 
           <div className={'nav-link'} onClick={ () => this.props.history.push("/admin/drivers") } data-toggle="collapse">
            <i className="mdi mdi-worker menu-icon"></i>
            <span className="menu-title"> Driver Management</span>
          </div>
      </li>
    
      <li className={ this.isPathActive('/admin/importorders') ? 'nav-item active' : 'nav-item' }> 
           <div className={'nav-link'} onClick={ () => this.props.history.push("/admin/importorders") } data-toggle="collapse">
            <i className="mdi mdi-import menu-icon"></i>
            <span className="menu-title"> Bulk Import Orders</span>
          </div>
      </li>

        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
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

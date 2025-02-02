import React, { useState, useContext } from 'react';
// import { Dropdown } from 'react-bootstrap';
import { withRouter } from 'react-router'
// import { Link, useHistory, useLocation } from 'react-router-dom';
import {Button} from '@material-ui/core'
import {  useHistory } from 'react-router-dom';
import ChangePassword from '../common/ChangePassword';
import { AuthContext } from "../App";

 function Navbar() {
  const history = useHistory();
  const { state, dispatch } = useContext(AuthContext);
  const [open_change_pwd, setOpenChangePwd] = useState(false);

  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  };

  const handleChangePassword = () => {
    setOpenChangePwd(false);
    window.location.reload(false);
  };

  const handleLogout = (event) => {
   
    history.push('/')
    dispatch({type: "LOGOUT"});
    
  };

  return (
      <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
        <a className="navbar-brand brand-logo-mini align-self-center d-lg-none" href="!#" onClick={evt =>evt.preventDefault()}><img src="/images/logo-mini.png" alt="logo" /></a>
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
            <i className="mdi mdi-menu"></i>
          </button>
          
          <ul className="navbar-nav navbar-nav-right ml-lg-auto">
            <li className="nav-item  nav-profile border-0">
              <span>Admin: {state.userName}</span>
              {/* <Button className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary" variant="outlined" 
                  onClick={() => setOpenChangePwd(true)}>
                  Change Password
                  </Button> */}
                  <Button className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary" variant="outlined" 
                    onClick={() => handleLogout()}>
                  Sign Out
               </Button>
            </li>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
            <span className="mdi mdi-menu"></span>
          </button>

          {open_change_pwd?
            <ChangePassword open={open_change_pwd} handleChangePassword={handleChangePassword} /> : null
          }
        </div>
      </nav>
    )
}

export default withRouter(Navbar);

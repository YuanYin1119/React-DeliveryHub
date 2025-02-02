import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router'
import {Button} from '@material-ui/core'
import ChangePassword from '../common/ChangePassword';
import {  useHistory } from 'react-router-dom';
import { AuthContext } from "../App";

function Navbar(props) {

  const history = useHistory();
  const { state: authState, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false)
  // console.log(authState)
  if(!document.body.classList.contains('sidebar-icon-only')) {
    document.body.classList.add('sidebar-icon-only');
  }
  
  const handleChangePassword = (value) => {
    setOpen(value)
  }


  const handleLogout = (event) => {
    history.push('/')
    dispatch({type: "LOGOUT"});
  };

    return (
      <nav className="admin-navbar navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
                <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
                {/* <a className="navbar-brand brand-logo-mini align-self-center d-lg-none" href="!#" onClick={evt =>evt.preventDefault()}><img src="/images/logo-mini.png" alt="logo" /></a> */}
                  {/* <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
                    <i className="mdi mdi-menu"></i>
                  </button> */}
                  <ul className="admin-dropdown navbar-nav navbar-nav-right ml-lg-auto">

                    <li className="nav-item  nav-profile border-0">
                          <span>Operator: {authState.userName}</span>
                    
                        {/* <Button className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary" variant="outlined" 
                          onClick={() => handleChangePassword(true)}>
                          Change Password
                          </Button> */}
                          <Button className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary" variant="outlined" 
                           onClick={() => handleLogout()}>
                          Sign Out
                        </Button>
                 
                    </li>
                  </ul>
        
                </div>
                <ChangePassword 
                  open={open}
                  handleChangePassword={handleChangePassword}
                />
    
               
              </nav>
    )
    
}

export default withRouter(Navbar);

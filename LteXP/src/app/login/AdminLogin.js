import React, { useState,useRef} from 'react';
// import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Box } from '@material-ui/core';
import SimpleReactValidator from 'simple-react-validator'
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { AuthContext } from "../App";
import { userLogin } from '../store/actions/auth';
import {withSnackbar} from 'notistack'

const useStyles = makeStyles(() => ({
  label: {
    color: red[600]
  }
}));

const AdminLogin = (props) => {
  const context = React.useContext(AuthContext);
  const classes = useStyles();
  const [, forceUpdate] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginerror, setLoginerror] = useState('');
  
  const simpleValidator = useRef(new SimpleReactValidator());

  const handleUsername = (value) => {
    setLoginerror('')
    setPassword('')
    setEmail(value)
  }

  const loginUser = (event) =>{
    event.preventDefault();
    if (!simpleValidator.current.allValid()) {
      simpleValidator.current.showMessages(true)
      forceUpdate(true)
      return;
    }

    userLogin({userName:email, password:password}, props, context.dispatch);
  }
  
    return (
      <div className="login-wrap">
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto login-form">
              <div className="auth-form-light text-left">
            
              <div className="form-section py-5 px-4 px-sm-5">
                <h2 className="font-weight-light"><center>Login</center></h2>
                <Form className="pt-3" onSubmit={loginUser}>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="text" placeholder="userName*" size="lg" className="h-auto" 
                       value={email} onChange={(e)=>handleUsername(e.target.value)} id="email" name="email" />
                  </Form.Group>
                  <Box style={{color: 'red'}}>
                    {simpleValidator.current.message('userName', email, 'required')}
                  </Box>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="Password*" size="lg" className="h-auto" 
                        value={password} onChange={(e)=>setPassword(e.target.value)} id="password" name="password"/>
                  </Form.Group>
                  <Box style={{color: 'red'}}>
                    {simpleValidator.current.message('password', password, 'required')}
                  </Box>
         
                  {loginerror?
                    <label className={classes.label} >Incorrect userName or password</label>:null
                  }
                  <div className="mt-3">
                    <input type="submit" value="Login" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"/>
                  </div>
                  
                  {/* <div className="my-2 d-flex justify-content-between align-items-center">
                 
                    <Link to='/admin-reset-pwd' className="auth-link text-black"><u>Forgot password?</u></Link>
                  </div> */}
              
                </Form>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  
}
export default withSnackbar(AdminLogin)

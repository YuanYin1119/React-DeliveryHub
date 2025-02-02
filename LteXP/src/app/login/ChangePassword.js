import React, { useState, useEffect, useRef} from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Box } from '@material-ui/core';
import {withSnackbar} from 'notistack'
import SimpleReactValidator from 'simple-react-validator'
import {changeForgotPassword} from '../store/actions/user'


const ChangePassword = (props) => {
  let location = useLocation()
  const simpleValidator = useRef(new SimpleReactValidator())
  const [otp, setOTP] = useState('')
  const [, forceUpdate] = useState()
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    
  },[])

 
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!simpleValidator.current.allValid()) {
      simpleValidator.current.showMessages(true)
      forceUpdate(true)
      return
    }
    if(password !== confirm_password){
      props.enqueueSnackbar('Rematch password',{variant:"error"});
      return
    }
    setLoading(true);
    changeForgotPassword({email:location.state.email, otp, password, loginAs:location.state.loginAs}).then(res => {
      setLoading(false);
      props.enqueueSnackbar('Successfully chanage password',{variant:"success"});
      history.push("/")
    }).catch(err => {
      setLoading(false);
      if(err && err.response && err.response.data.message){
        props.enqueueSnackbar(err.response.data.message,{variant:"warning"});
      }else{
        props.enqueueSnackbar("something went wrong",{variant:"warning"});
      }

    })

  }
  
    return (
      <div className="login-wrap">
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto login-form">
              <div className="auth-form-light text-left">
             
              <div className="form-section py-5 px-4 px-sm-5">
                <h2 className="font-weight-light"><center>OTP</center></h2>
                <Form className="pt-3" onSubmit={handleSubmit}>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="text" placeholder="OTP*" size="lg" className="h-auto" 
                       value={otp} onChange={(e)=>setOTP(e.target.value)} id="otp" name="otp" />
                  </Form.Group>
                  <Box style={{color: 'red'}}>
                    {simpleValidator.current.message('otp', otp, 'required')}
                  </Box>
                  <Form.Group className="d-flex search-field">
                    
                    <Form.Control type="password" placeholder="Password*" size="lg" className="h-auto" 
                        value={password} onChange={(e)=>setPassword(e.target.value)} id="password" name="password"/>
                  </Form.Group>
                  <Box style={{color: 'red'}}>
                      {simpleValidator.current.message('Password', password, 'required')}
                  </Box>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="Confirm Password*" size="lg" className="h-auto" 
                        value={confirm_password} onChange={(e)=>setConfirmPassword(e.target.value)} id="password" name="password"/>
                  </Form.Group>
                  <Box style={{color: 'red'}}>
                      {simpleValidator.current.message('Confirm Password', confirm_password, 'required')}
                    </Box>
                  <div className="mt-3">
                    <input type="submit" disabled={loading} value="Submit" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"/>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check">
                    <label className="my-2 d-flex justify-content-between align-items-center">
                      <Link to='/' className="auth-link text-black"><u>Back to Login</u></Link>
                    </label>
                    </div>
                  </div>
                </Form>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  
}
export default withSnackbar(ChangePassword)

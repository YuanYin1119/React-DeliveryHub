import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import {withSnackbar} from 'notistack'
import {submitEmailForUserPassword} from '../store/actions/user'


const useStyles = makeStyles(() => ({
  label: {
    color: red[600]
  }
}));

const AdminResetPwd = (props)  => {
  let history = useHistory()

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [loginAs, setLoginAs] = useState('clinic')
  const [emailerror, setEmailError] = useState('');
  const [loading, setLoading] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (pattern.test(String(email).toLowerCase())) {
      setEmailError(false);
      setLoading(true)
      submitEmailForUserPassword({loginAs,email}).then(({data})  => {
        props.enqueueSnackbar('Check you inbox and submit OTP',{variant:"success"});
        
        history.push("/change_password", {
          email:email,
          loginAs
        })
        setLoading(false)
      }).catch(err => {
        setLoading(false)
        if(err && err.response && err.response.status===404){
          props.enqueueSnackbar( err.response.data.message,{variant:"error"});
        }
        console.log('err', err, err.response)
      })
    } else {
      setEmailError(true);
    }
  }

  return (
      <div className="login-wrap">
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto login-form">
              <div className="auth-form-light text-left">
              
            <div className="form-section py-5 px-4 px-sm-5">
                <h2 className="font-weight-light"><center>Reset Password</center></h2>
                <h6 className="font-weight-light">Enter your email address.</h6>
                <Form className="pt-3" onSubmit={handleSubmit}>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="text" placeholder="Email*" size="lg" className="h-auto"
                      value={email} onChange={(e)=>setEmail(e.target.value)} id="email" name="email" />
                  </Form.Group>
                  {emailerror?
                    <label className={classes.label} >Email is invalid</label> : null
                  }
                  <Form.Group>
                    <Form.Label>Change password for:</Form.Label>
                      <Form.Control onChange={(event) => setLoginAs(event.target.value)} value={loginAs} as="select">
                        <option value="admin">Admin</option>
                        <option value="clinic">Operator</option>
                      </Form.Control>
                  </Form.Group>
                  <div className="mt-3">
                    <input type="submit" disabled={loading} value="RESET MY PASSWORD" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"/>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <Link to="/" className="auth-link text-black"><u>Login?</u></Link>
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
export default withSnackbar(AdminResetPwd)
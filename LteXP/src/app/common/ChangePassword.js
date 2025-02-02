import React, {useState, useRef, useContext} from 'react'
import { withStyles } from '@material-ui/core/styles';
import {Button, Dialog, TextField, Grid} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import {clinicChangePassword} from '../store/actions/auth'
import {adminChangePassword} from '../store/actions/auth'
import {withSnackbar} from 'notistack'
import SimpleReactValidator from 'simple-react-validator'
import { AuthContext } from "../App"
// import _ from 'lodash'


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    minWidth: '100%',
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ChangePassword = (props) => {
  let {state} = useContext(AuthContext)

  const simpleValidator = useRef(new SimpleReactValidator())
  const [, forceUpdate] = useState()
  const [isError, setIsError] = useState(false)
  const [form, setForm] = useState({
    password:"",
    confirm_password:"",
  })
  
  const onChangeText = (event) => {

    setIsError(false)
    let name = event.target.name
    let value = event.target.value
    setForm(prevState => ({
      ...prevState,
      [name]:value
    }))
  }
  const onHandleSubmit = () => {
    if (!simpleValidator.current.allValid()) {
      simpleValidator.current.showMessages(true)
      forceUpdate(true)
      return
    }
    if(form.password !== form.confirm_password){
      setIsError(true)
      return
    }
    setIsError(false)
    // console.log('on change passw', state)
    if(state.isClinic) {
      clinicChangePassword(form, state.token).then(({data}) => {
        props.handleChangePassword(false)
        props.enqueueSnackbar('SuccessFully Changed Password',{variant:"success"});
      }).catch(err => {
        props.enqueueSnackbar('Something went wrong',{variant:"warning"});
        console.log("err", err.response)
      })
    }else if(state.isAdmin) {
      adminChangePassword(form, state.token).then(({data}) => {
        props.handleChangePassword(false)
        props.enqueueSnackbar('SuccessFully Changed Password',{variant:"success"});
      }).catch(err => {
        props.enqueueSnackbar('Something went wrong',{variant:"warning"});
        console.log("err", err.response)
      })
    }
  }
 
  return (
    <Dialog onClose={() => props.handleChangePassword(false)} 
    fullWidth={true}
    maxWidth="sm"
     aria-labelledby="customized-dialog-title" open={props.open}>
      <DialogTitle id="customized-dialog-title" onClose={() => props.handleChangePassword(false)}>
        <center><strong>Change Password</strong></center>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <span style={{color: 'red'}}>
              {simpleValidator.current.message('Password', form.password, 'required')}  
            </span>
            <TextField 
              fullWidth
              type="password"
              id="password" 
              label="New Password" 
              variant="outlined"
              name="password"
              placeholder="New Password"
              onChange={(event) => onChangeText(event)} 
            />
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            {
              isError &&
              <span style={{color: 'red'}}>
                Password does not match
              </span>
            }
            <TextField 
              fullWidth
              type="password"
              id="confirm_password" 
              label="Confirm Password"
              name="confirm_password"
              // placeholder="Confirm Password"
              onChange={(event) => onChangeText(event)} 
              variant="outlined" 
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => onHandleSubmit()}>
          Change
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default withSnackbar(ChangePassword)

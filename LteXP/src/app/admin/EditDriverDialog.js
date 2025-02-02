import React, { Component,useState } from 'react'

import { Form } from 'react-bootstrap';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
// import breadcrumbStyle from '../../assets/styles/components/breadcrumbStyle.scss';
import { Driverupdate } from '../store/actions/admin'
import { ValidatorForm} from 'react-material-ui-form-validator'
import { AuthContext } from "../App";

export class EditDriverDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: null,
      onClose: null,
      driver_id: '',
      driver_fname: '',
      driver_lname: '',
      user_id: '',
      driver_zone: '',
      driver_type: '',
      driver_phone: '',
      driveraddress: '',
      drivercity: '',
      driverprovince: '',
      is_valid_postcode: true,
      is_valid_phone: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.isValidZip =  /^[A-Za-z]\d[A-Za-z][ ]\d[A-Za-z]\d$/;
    (this.isValidZip.test("s7j 4j6"))

    this.isValidPhone =  /^\d{10}$/;
    (this.isValidPhone.test("1234567890"))
  };

  
  static contextType = AuthContext;

  handleChange(event) {
    // console.log(event.target.name)
    // console.log(event.target.value)
    if(event.target.name==='driver_zone') {
      this.error=!this.isValidZip.test(event.target.value);
      if(this.error){
        this.setState({
          is_valid_postcode:false
        })
      }else{
        this.setState({
          is_valid_postcode:true
        })
      }
    }

    if(event.target.name==='driver_phone') {
      this.error2=!this.isValidPhone.test(event.target.value);
      if(this.error2){
        this.setState({
          is_valid_phone:false
        })
      }else{
        this.setState({
          is_valid_phone:true
        })
      }
    }
     
    if(event.target) {
    this.setState({
        [event.target.name]: event.target.value
    })}
  }
  
  componentDidMount() {
   
      this.setState({
        open: this.props.open,
        onClose: this.props.onClose,
        driver_id: this.props.driver_id,
        driver_fname: this.props.driver_fname,
        driver_lname: this.props.driver_lname,
        user_id: this.props.user_id,
        driver_zone: this.props.driver_zone,
        driver_type: this.props.driver_type,
        driver_phone: this.props.driver_phone,

        driveraddress: this.props.driveraddress,
        drivercity: this.props.drivercity,
        driverprovince: this.props.driverprovince,
        operation: this.props.operation,
    })

    // const isValidZip =  /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;
    ValidatorForm.addValidationRule('isValidZipcode', (value) => {
        if (this.isValidZip.test(value)!==true) {
            return false;
        }
        return true;
    });
  };


  handleClose(event) {
    const save = event.target.textContent==="Save"?true:false;
    // save modification
    if (save) {

      const bodyContent = {
        operation: this.state.operation,
        driver:{
          id: this.state.driver_id,
          phoneNumber: this.state.driver_phone,
          lastName: this.state.driver_lname,
          firstName: this.state.driver_fname,
          postcode: this.state.driver_zone,
          systemDriver: this.state.driver_type==='true',
          address: this.state.driveraddress,
          city: this.state.drivercity,
          province: this.state.driverprovince,
          valid:true
        }
      }
      // console.log(bodyContent)

      Driverupdate(this.context.state.token, bodyContent).then(({data}) =>{
        // console.log(data)
        this.state.onClose(null);
      }).catch(err => {
        console.log('err', err)
        this.state.onClose(null);
      })
   
    } else {
      this.state.onClose(null);
    }
  };

  render() {
      return (
        <Dialog aria-labelledby="simple-dialog-title" open={this.props.open}>
          <DialogTitle id="simple-dialog-title">Driver Information</DialogTitle>
          <div>
          <Form noValidate autoComplete="off">
                  {/* <div >
                    <TextField id="driver_id" label="Driver ID"  disabled variant="outlined" name="driver_id" defaultValue={this.props.driver_id} vaule={this.state.driver_id} onChange={this.handleChange} />
                    <TextField id="user_id" label="User ID" variant="outlined" name="user_id" defaultValue={this.props.user_id} vaule={this.state.user_id} onChange={this.handleChange}/>
                  </div> */}
        
                  <div>
                    <TextField id="driver_lname"  style={{width : '100%'}} label="Last Name" variant="outlined" name="driver_lname" defaultValue={this.props.driver_lname}  vaule={this.state.driver_lname}  onChange={this.handleChange}/>
                    <TextField id="driver_fname"  style={{width : '100%'}} label="First Name" variant="outlined" name="driver_fname" defaultValue={this.props.driver_fname}  vaule={this.state.driver_fname}  onChange={this.handleChange}/>
                  </div>

                  <div>
                   <TextField id="driver_phone"  style={{width : '100%'}} label="Phone #" variant="outlined" name="driver_phone" 
                    helperText={this.error2?"Phone number format: 2505550199":""} error={this.error2}
                   defaultValue={this.props.driver_phone}  vaule={this.state.driver_phone}  onChange={this.handleChange}/>
                   <TextField id="driver_zone"  style={{width : '100%'}} label="Post Code" variant="outlined" name="driver_zone" 
                    helperText={this.error?"Post Code format: A1A 1A1":""} error={this.error}
                    defaultValue={this.props.driver_zone}  vaule={this.state.driver_zone}  onChange={this.handleChange}/>
                 </div>

                 <div >
                   <TextField style={{width : '100%'}}  id="driveraddress" label="Address" variant="outlined" name="driveraddress" defaultValue={this.props.driveraddress}  vaule={this.state.driveraddress}  onChange={this.handleChange}/>
                 </div>

                 <div>
                   <TextField id="drivercity"  style={{width : '100%'}} label="City" variant="outlined" name="drivercity" defaultValue={this.props.drivercity}  vaule={this.state.drivercity}  onChange={this.handleChange}/>
                   <TextField id="driverprovince"  style={{width : '100%'}} label="Province" variant="outlined" name="driverprovince" defaultValue={this.props.driverprovince}  vaule={this.state.driverprovince}  onChange={this.handleChange}/>
                
                 </div>

                 <div>
                     <h6 className="mt-4 col-md-6"  style={{color:'#000', marginTop:'10px'}}>Type</h6>
                    <RadioGroup className="col-md-6" row name="driver_type" value={this.state.driver_type.toString()} onChange={this.handleChange}>
                        <FormControlLabel value="false" control={<Radio />} label="Real Driver" />
                        <FormControlLabel value="true" control={<Radio />} label="System Driver" />
                    </RadioGroup>
                </div>

            
              <Button style={{marginTop:10}} variant="contained" color="primary" name="save" id="save" disabled={!this.state.is_valid_phone || !this.state.is_valid_postcode }  onClick={this.handleClose}>Save</Button>
              <Button style={{marginTop:10}} variant="contained" color="secondary" name="cancel" id="cancel" onClick={this.handleClose}>Cancel</Button>
            </Form>
          </div>
        </Dialog>
      );
    }
  }
  
export default EditDriverDialog;
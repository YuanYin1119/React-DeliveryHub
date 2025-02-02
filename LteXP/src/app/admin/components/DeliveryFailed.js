import React, { Component } from 'react';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Typography from '@material-ui/core/Typography';
// import Checkbox from '@material-ui/core/Checkbox';

import { TextField, Checkbox, Typography, FormControlLabel,FormGroup} from '@material-ui/core';

class DeliveryFailed extends Component {

    render() {
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="row search-report">
                   {this.props.second_arrival_scan_time && <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                        <Typography variant="overline" gutterBottom>Second Arrival Scan Time:</Typography>
                        </div>
                        <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                            <TextField 
                             name="second_arrival_scan_time" 
                             variant="outlined"
                             type="date" 
                             value={this.props.second_arrival_scan_time||''} 
                             onChange={(e)=>this.props.onchange_sndscantime(e.target.value)}
                            />
                        </div>
                        </div>
                    </div>}

                    {this.props.second_arrival_scan_arrivalbatch && <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                        <Typography variant="overline" gutterBottom>Arrival Batch:</Typography>
                        </div>
                        <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                            <TextField 
                             name="second_arrival_scan_time" 
                             variant="outlined"
                             value={this.props.second_arrival_scan_arrivalbatch||''} 
                             onChange={(e)=>this.props.onchange_sndscanarrivalbatch(e.target.value)}
                            />
                        </div>
                        </div>
                    </div>
                     }
                </div>
       

                <FormGroup row className="row">
                    <FormControlLabel className="col-md-12"
                        control={<Checkbox checked={this.props.second_arrival_scan_reasons.chk_wrong_address} name="chk_wrong_address"
                        onChange={(e)=>this.props.onchange_sndscanreasons({...this.props.second_arrival_scan_reasons, [e.target.name]: e.target.checked} )}  />}
                        label="Wrong Address"
                    />
                </FormGroup>
                <FormGroup row className="row">
                    <FormControlLabel className="col-md-12"
                        control={<Checkbox checked={this.props.second_arrival_scan_reasons.chk_unable_to_contact_customer}  name="chk_unable_to_contact_customer"
                        onChange={(e)=>this.props.onchange_sndscanreasons({...this.props.second_arrival_scan_reasons, [e.target.name]: e.target.checked} )}  />}
                        label="Unable to contact customer"
                    />
                </FormGroup>
                <FormGroup row className="row">
                    <FormControlLabel className="col-md-12"
                        control={<Checkbox checked={this.props.second_arrival_scan_reasons.chk_package_denied}  name="chk_package_denied" 
                        onChange={(e)=>this.props.onchange_sndscanreasons({...this.props.second_arrival_scan_reasons, [e.target.name]: e.target.checked} )} />}
                        label="Package denied"
                    />
                </FormGroup>
                <FormGroup row className="row">
                    <FormControlLabel className="col-md-12"
                        control={<Checkbox checked={this.props.second_arrival_scan_reasons.chk_wrong_phone}  name="chk_wrong_phone" 
                        onChange={(e)=>this.props.onchange_sndscanreasons({...this.props.second_arrival_scan_reasons, [e.target.name]: e.target.checked} )} />}
                        label="Wrong Phone"
                    />
                </FormGroup>
                <FormGroup row className="row">
                    <FormControlLabel className="col-md-12"
                        control={<Checkbox checked={this.props.second_arrival_scan_reasons.chk_other}  name="chk_other" 
                        onChange={(e)=>this.props.onchange_sndscanreasons({...this.props.second_arrival_scan_reasons, [e.target.name]: e.target.checked} )} />}
                        label="Other"
                    />
                </FormGroup>
            </div>
     
         );
     }
}

export default DeliveryFailed;
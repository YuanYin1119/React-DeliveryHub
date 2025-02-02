import React, { Component } from 'react';
import { TextField, Typography, FormLabel, Radio, RadioGroup, FormControlLabel} from '@material-ui/core';

class SecondDelivery extends Component {
    render() {
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="row search-report">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                    <Typography variant="overline" gutterBottom>Fee:</Typography>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-8 col-xl-12 mb-0">
                            <RadioGroup aria-label="scddelivery_fee" style={{display : 'inline-block'}}  name="scddelivery_fee" value={this.props.scddelivery_fee||''} onChange={(e)=>this.props.onchange_scddelivery_fee(e.target.value)}>
                            <FormControlLabel value="true" control={<Radio />} label="Yes" checked={this.props.scddelivery_fee === 'true' || this.props.scddelivery_fee === true} labelPlacement="start"/>
                            <FormControlLabel value="false" control={<Radio />} label="No"  checked={this.props.scddelivery_fee === 'false' || this.props.scddelivery_fee === false}   labelPlacement="start"/>
                            </RadioGroup>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                            <TextField 
                             name="scddelivery_feeAmount" 
                             variant="outlined"
                             value={this.props.scddelivery_feeAmount||''} 
                             onChange={(e)=>this.props.onchange_scddelivery_feeAmount(e.target.value)}
                            />
                        </div>

                    </div>
                </div>

                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                    <Typography variant="overline" gutterBottom>Address note:</Typography>
                    </div>
                    <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                    <textarea  rows="3"  style={{width : '100%'}} name="scddelivery_addrnotes" variant="outlined" value={this.props.scddelivery_addrnotes||''} onChange={(e)=>this.props.onchange_scddelivery_addrnotes(e.target.value)}/>
             
                    </div>
                    </div>
                </div>

                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                    <Typography variant="overline" gutterBottom>Driver note:</Typography>
                    </div>
                    <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                    <textarea  rows="3"  style={{width : '100%'}} name="scddelivery_drivernotes" variant="outlined" value={this.props.scddelivery_drivernotes||''} onChange={(e)=>this.props.onchange_scddelivery_drivernotes(e.target.value)}/>
                    </div>
                    </div>
                </div>

                
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                        <Typography variant="overline" gutterBottom>Buzz code:</Typography>
                        </div>
                        <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                            <TextField 
                             name="scddelivery_buzzcode" 
                             variant="outlined"
                             value={this.props.scddelivery_buzzcode||''} 
                             onChange={(e)=>this.props.onchange_scddelivery_buzzcode(e.target.value)}
                            />
                        </div>
                        </div>
                    </div>

            </div>
        </div>
 
         );
     }
}

export default SecondDelivery;
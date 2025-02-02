import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';

class SelfPickup extends Component {

    render() {
        return (

        <div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
            <Typography variant="overline" gutterBottom>Locate #:</Typography>
          </div>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-8 col-xl-12 mb-0">
            <TextField name="selfpickup_locate" variant="outlined" value={this.props.selfpickup_locate||''}  onChange={(e)=>this.props.onchange_selfpick(e.target.value)}/>
            </div>
            </div>
         </div>

         );
     }
}

export default SelfPickup;
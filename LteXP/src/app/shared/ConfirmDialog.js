import React from 'react'
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import { AuthContext } from "../App";
import { Driverupdate } from '../store/actions/admin'

const useStyles = makeStyles({
    avatar: {
      backgroundColor: blue[100],
      color: blue[600],
    },
  });

export default function ConfirmDialog(props) {
  const { state: authState } = React.useContext(AuthContext);

      const classes = useStyles();
      const { onClose, open, id, name } = props;

      const handleClose = (event, confirmDel) => {
        event.preventDefault();
        
        // save modification
        if (confirmDel) {
            // console.log(authState.token)
            const bodyContent = {
              "operation":2,
              driver: {
                id: id,
                valid: false
              }
            }
            // console.log(bodyContent)

            Driverupdate(authState.token, bodyContent).then(({data}) =>{
              // console.log(data)
              onClose();
            }).catch(err => {
              console.log('err', err)
              onClose();
            })
            // delete driver here
            // onClose();
        }else{
          onClose();
         
        }
        
      };

      return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          <div>
              <h6 className="text-center">Are you sure?</h6>
              <h3 className="text-center mb-4">Want to delete {name}</h3>
              <Button variant="contained" color="primary" className={classes.margin} onClick={(e)=>handleClose(e, true)}>Yes, delete it!</Button>
              <Button variant="contained" color="secondary" className={classes.margin} onClick={(e)=>handleClose(e, false)}>Cancel</Button>
          </div>
        </Dialog>
      );

  }

  ConfirmDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  };

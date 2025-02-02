import React from 'react'
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import { AuthContext } from "../App";

const useStyles = makeStyles({
    avatar: {
      backgroundColor: blue[100],
      color: blue[600],
    },
  });

export default function CompleteConfirmDialog(props) {
  const { state: authState } = React.useContext(AuthContext);

      const classes = useStyles();
      const { onClose, open, action, message } = props;

      const handleClose = (event, confirmDel) => {
        event.preventDefault();
        onClose(action, confirmDel); 
      };

      return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          <div>
              <h3 className="text-center mb-4">{message}</h3>
              <Button variant="contained" color="primary" className={classes.margin} onClick={(e)=>handleClose(e, true)}>Yes</Button>
              <Button variant="contained" color="secondary" className={classes.margin} onClick={(e)=>handleClose(e, false)}>No</Button>
          </div>
        </Dialog>
      );

  }

  CompleteConfirmDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    action: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  };

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {CircularProgress,TableContainer, TableBody, TableRow, Box, TableCell, Table} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

export default function Loading() {
  const classes = useStyles();
  return (
    <TableContainer>
      <Table size="small" aria-label="user table" className="programTable">
        <TableBody>
          <TableRow>
            <TableCell align="center" width="100%" colSpan={12}>
              <Box>
                <CircularProgress disableShrink />
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

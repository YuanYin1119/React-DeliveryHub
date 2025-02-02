import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Card,Button} from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import {withSnackbar} from 'notistack'
import { AuthContext } from "../App"
import {Link,useHistory,useLocation} from 'react-router-dom'
import {useSnackbar} from 'notistack'
import MaterialTable from 'material-table'

import Commonhelper from '../helper/Commonhelper'
import {deliveryBatchList} from '../store/actions/admin'


const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    }
}));

const DeliveryManagement = (props) => {
  let history = useHistory()
  let {state, dispatch} = useContext(AuthContext)

  const search_qry = useLocation().search;  
  const deliveryBacthID_qry=new URLSearchParams(search_qry).get('search_deliveryBacthID');
  const startdt_qry=new URLSearchParams(search_qry).get('search_startdt');
  const enddt_qry=new URLSearchParams(search_qry).get('search_enddt');

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  let newDate = new Date();
  let newDate_string = Commonhelper.formatDate(newDate);
  // newDate = newDate.toISOString().substr(0,10);

  const [search_deliveryBacthID, setSearchDeliveryBacthID] = useState(deliveryBacthID_qry?deliveryBacthID_qry:'');
  const [search_startdt, setSearchStartdt] = useState(startdt_qry?startdt_qry:newDate_string);
  const [search_enddt, setSearchEnddt] = useState(enddt_qry?enddt_qry:newDate_string);
  const [deliveryBacthlist, setDeliveryBacthlist] = useState([])

  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  function getDeliveryBatchList(){

    let is_all_empty=false;
    if(!search_startdt && !search_enddt && !search_deliveryBacthID) {
      console.log('all empty')
      is_all_empty=true;
      setSearchStartdt(newDate_string)
      setSearchEnddt(newDate_string)
    }

    let params= {
      // "userId": state.userId,
      "deliveryBatch":search_deliveryBacthID.trim(),
      "createDateFrom": is_all_empty?newDate_string:search_startdt,
      "createDateTo":is_all_empty?newDate_string:search_enddt
    };
    deliveryBatchList(state.token, params).then(({data}) =>{
      // console.log(data);
      setDeliveryBacthlist(data)
          
      }).catch(err => {
        console.log('err', err)

        if(err.response && err.response.data && err.response.data.code) {
          check_logout(Commonhelper.geterrorcode(err.response.data));
          enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
          }else{
            enqueueSnackbar('Something went wrong',{autoHideDuration:5000, variant:"warning"});
          }
      })
  }

  useEffect(() => {
    // console.log('in useEffect')
    // getDeliveryBatchList();

    let newDate = new Date();
    let newDate_string = Commonhelper.formatDate(newDate);
    let params= {
      "deliveryBatch": search_deliveryBacthID.trim(),
      "createDateFrom": search_startdt?search_startdt:newDate_string,
      "createDateTo": search_enddt?search_enddt:newDate_string
    };

    deliveryBatchList(state.token, params).then(({data}) =>{
        // console.log(data);
        setDeliveryBacthlist(data)
          
      }).catch(err => {
        console.log('err', err)
        if(err.response && err.response.data && err.response.data.code) {
          check_logout(Commonhelper.geterrorcode(err.response.data));
          enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
          }else{
            enqueueSnackbar('Something went wrong',{autoHideDuration:5000, variant:"warning"});
          }
    })
 
  },[])



  const handleReset=() => {
    // console.log(newDate_string)
    setSearchDeliveryBacthID('');
    setSearchStartdt(newDate_string)
    setSearchEnddt(newDate_string)
    setDeliveryBacthlist([])

    history.push("/admin/deliverymanagement")
  }

  const handleSearch = () => {
    // console.log('handle search')
    history.push("/admin/deliverymanagement?search_deliveryBacthID="+search_deliveryBacthID+"&search_startdt="+search_startdt+"&search_enddt="+search_enddt)

    getDeliveryBatchList();
  }


  return (
    <>
     <h2>Delivery Management</h2>
     <Card>
      <div className="row search-report">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Delivery Batch ID:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField name="search_deliveryBacthID" variant="outlined" value={search_deliveryBacthID} onChange={(e)=>setSearchDeliveryBacthID(e.target.value)}/>
              </div>
              </div>
           </div>


           <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Create Date:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField 
              InputProps={{
                startAdornment: <InputAdornment position="start">From</InputAdornment>,
              }}
               type="date" name="search_startdt" variant="outlined" value={search_startdt} onChange={(e)=>setSearchStartdt(e.target.value)}/>
              </div>
              </div>
           </div>

           <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Create Date:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField 
              InputProps={{
                startAdornment: <InputAdornment position="start">To</InputAdornment>,
              }}
               type="date" name="search_enddt" variant="outlined" value={search_enddt} onChange={(e)=>setSearchEnddt(e.target.value)}/>
              </div>
              </div>
           </div>

        </div>

        <div className="row search-btns">
            <FormGroup row>
                <FormControl>
                    <Button variant="contained"  color="primary" className={classes.margin} onClick={handleSearch}>Search</Button>
                    <Button variant="contained"  color="primary" className={classes.margin} onClick={handleReset}>Reset</Button>
                </FormControl>
                    
            </FormGroup>
        </div>

     </Card>
        <MaterialTable
        title='Delivery Batch List'
        columns={[
        { title: 'Delivery Batch ID', field: 'deliveryBatch', render: rowData => <Link
        params={{ trackingnumber: rowData.deliveryBatch }} to={{pathname: `/admin/routeplanning/${rowData.deliveryState}/${rowData.deliveryBatch}`,
                state: {
                  deliveryBatchID: rowData.deliveryBatch,
                  deliveryState: rowData.deliveryState
                 }
                }}>
                <u>{rowData.deliveryBatch}</u>
            </Link> },
          { title: 'Total Order', field: 'totalOrders' },
          { title: 'Status', field: 'deliveryState' },
          { title: 'Create Date', field: 'createDate' },
          { title: 'User', field: 'userName' },
       
        ]}

        data={deliveryBacthlist}
        options={{
          actionsColumnIndex: -1,
          pageSize: 20,
          paginationPosition:'both',
          headerStyle: {
            backgroundColor: 'transperant',
            color: '#23263d'
          }
        }}
      />


    </>
    
  );
}

export default withSnackbar(DeliveryManagement);
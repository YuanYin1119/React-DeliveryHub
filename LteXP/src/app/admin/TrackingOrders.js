import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Card,Button} from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import {useSnackbar, withSnackbar} from 'notistack'
import { AuthContext } from "../App"
import {Link, useHistory, useLocation} from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// import {useSnackbar} from 'notistack'
import MaterialTable from 'material-table'
// import MuiPhoneNumber from "material-ui-phone-number";
// import { History, Visibility } from "@material-ui/icons";

import {getTrackingOrdersbySearch} from '../store/actions/admin'
import {getOrderStatusList} from '../store/actions/admin'

import Commonhelper from '../helper/Commonhelper'

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    }
}));

const TrackingOrders = (props) => {
  let history = useHistory()
  let {state, dispatch} = useContext(AuthContext)

  let newDate = new Date();
  let newDate_string = Commonhelper.formatDate(newDate);

  const search_qry = useLocation().search;  
// console.log(search_qry)
  let trackingNumber_qry='';
  let status_qry='';
  let arrivalBatch_qry='';
  let address_qry='';
  let receiverPhone_qry='';
  let postCode_qry='';
  let arrivalDateFrom_qry='';
  let arrivalDateTo_qry='';
  let receiverName_qry='';

  if(search_qry) {
    // console.log('has query string')

    trackingNumber_qry=new URLSearchParams(search_qry).get('trackingNumber');
    trackingNumber_qry=trackingNumber_qry.replace(/<br ?\/?>/g, "\n");
    arrivalBatch_qry=new URLSearchParams(search_qry).get('arrivalBatch');
    address_qry=new URLSearchParams(search_qry).get('address');
    receiverPhone_qry=new URLSearchParams(search_qry).get('receiverPhone');
    postCode_qry=new URLSearchParams(search_qry).get('postCode');
    arrivalDateFrom_qry=new URLSearchParams(search_qry).get('arrivalDateFrom');
    arrivalDateTo_qry=new URLSearchParams(search_qry).get('arrivalDateTo');
    receiverName_qry=new URLSearchParams(search_qry).get('receiverName');
  
    // if( (status_qry && status_qry!="--SELECT--") || trackingNumber_qry || arrivalBatch_qry || address_qry || receiverPhone_qry 
    //   || postCode_qry || arrivalDateFrom_qry || arrivalDateTo_qry || receiverName_qry ) {
        
    //  }else{
    //     arrivalDateFrom_qry = newDate_string
    //     arrivalDateTo_qry = newDate_string
    // }
  }else{
    // console.log('no query string')
    arrivalDateFrom_qry = newDate_string
    arrivalDateTo_qry = newDate_string
  }
 
 
  const [orderlist, setOrderlist] = useState([])
  const [statuslist, setStatuslist] = useState([])
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [search_trackingnumber, setSearchTrackingnumber] = useState(trackingNumber_qry?trackingNumber_qry:'');
  const [search_arrivalBacthID, setSearchArrivalBacthID] = useState(arrivalBatch_qry?arrivalBatch_qry:'');
  const [search_startdt, setSearchStartdt] = useState(arrivalDateFrom_qry?arrivalDateFrom_qry:'');
  const [search_enddt, setSearchEnddt] = useState(arrivalDateTo_qry?arrivalDateTo_qry:'');
  const [search_status, setSearchStatus] = useState(status_qry?status_qry:'--SELECT--');
  const [search_receivername, setSearchReceivername] = useState(receiverName_qry?receiverName_qry:'');
  const [search_receiveraddress, setSearchReceiveraddress] = useState(address_qry?address_qry:'');
  const [search_receiverzipcode, setSearchReceiverzipcode] = useState(postCode_qry?postCode_qry:'');
  const [search_receiverphone, setSearchReceiverphone] = useState(receiverPhone_qry?receiverPhone_qry:'');

  // const [rowsPerPage, setRowsPerPage] = useState(10);


  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  function fetchdata() {
    let savedCriterias = {
      trackingNumber: search_trackingnumber,
      arrivalBatch: search_arrivalBacthID,
      status: search_status==="--SELECT--"?'':search_status,
      receiverName: search_receivername,
      address: search_receiveraddress,
      receiverPhone: search_receiverphone,
      postCode: search_receiverzipcode,
      arrivalDateFrom: search_startdt,
      arrivalDateTo: search_enddt
    } ;


    getTrackingOrdersbySearch(state.token, savedCriterias).then(({data}) =>{
     console.log(data)
     setOrderlist(data)
    //  console.log('setRowsPerPage')
    //  setRowsPerPage(data.length)   
      
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
      }else{
          enqueueSnackbar('Something went wrong',{autoHideDuration:5000, variant:"warning"});
      }
    })
  }

  useEffect(() => {
    //console.log('in useEffect')
    getOrderStatusList(state.token).then(({data}) =>{
        // console.log(data)
         setStatuslist(data)
         status_qry=new URLSearchParams(search_qry).get('status');
         setSearchStatus(status_qry?status_qry:'--SELECT--');
        //  fetchdata
        let savedCriterias = {
          trackingNumber: search_trackingnumber,
          arrivalBatch: search_arrivalBacthID,
          status: status_qry==="--SELECT--"?'':status_qry,
          receiverName: search_receivername,
          address: search_receiveraddress,
          receiverPhone: search_receiverphone,
          postCode: search_receiverzipcode,
          arrivalDateFrom: search_startdt,
          arrivalDateTo: search_enddt
        } ;
    
        getTrackingOrdersbySearch(state.token, savedCriterias).then(({data}) =>{
        //  console.log(data)
         setOrderlist(data)
        //  console.log('setRowsPerPage')
        //  setRowsPerPage(data.length)   
          
        }).catch(err => {
          console.log('err', err)
          if(err.response && err.response.data ) {
            check_logout(Commonhelper.geterrorcode(err.response.data));
            enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
          }else{
              enqueueSnackbar('Something went wrong',{autoHideDuration:5000, variant:"warning"});
          }
        })

        //  if(search_trackingnumber || search_arrivalBacthID || search_startdt || search_enddt || (search_status && search_status!="--SELECT--" )
        //   || search_receivername || search_receiveraddress || search_receiverzipcode || search_receiverphone) {
        //   fetchdata()
        //   }
          
      }).catch(err => {
        console.log('err', err)
        if(err.response && err.response.data ) {
          check_logout(Commonhelper.geterrorcode(err.response.data));
          enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
        }else{
          enqueueSnackbar('Something went wrong',{autoHideDuration:5000, variant:"warning"});
        }
      })
 
  },[])



  const handleReset=() => {
    setSearchTrackingnumber('')
    setSearchArrivalBacthID('');
    setSearchStatus('--SELECT--');
    setSearchStartdt('')
    setSearchEnddt('')
    setSearchReceivername('')
    setSearchReceiveraddress('')
    setSearchReceiverzipcode('')
    setSearchReceiverphone('')

    setOrderlist([])
    history.push("/admin/ordermanagement")
  }

  const handleSearch = () => {
    // console.log('handle search')
    // console.log(search_trackingnumber.replace(/<br ?\/?>/g, "\n"))
    // console.log(search_trackingnumber.replace(/(?:\r\n|\r|\n)/g, '<br />'))

    history.push("/admin/ordermanagement?status="+search_status+"&trackingNumber="+search_trackingnumber.replace(/(?:\r\n|\r|\n)/g, '<br />')+"&arrivalBatch="+search_arrivalBacthID
    +"&receiverName="+search_receivername+"&address="+search_receiveraddress+"&receiverPhone="+search_receiverphone
    +"&postCode="+search_receiverzipcode+"&arrivalDateFrom="+search_startdt+"&arrivalDateTo="+search_enddt)
    
    fetchdata();
  }


  return (
    <>
    <h2>Order Management</h2>
     <Card>
      <div className="row search-report">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Order Number(press enter to separate):</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <textarea style={{width : '100%'}} rows="5"  name="search_trackingnumber" variant="outlined" value={search_trackingnumber} onChange={(e)=>setSearchTrackingnumber(e.target.value)}/>
              </div>
              </div>
            
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Arrival Batch ID:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField name="search_arrivalBacthID" variant="outlined" value={search_arrivalBacthID} onChange={(e)=>setSearchArrivalBacthID(e.target.value)}/>
              </div>
              </div>
           </div>


          {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Status:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField name="search_status" variant="outlined" value={search_status} onChange={(e)=>setSearchStatus(e.target.value)}/>
              </div>
              </div>
           </div> */}

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Status:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <FormControl className={classes.formControl}>
                    <Select value={search_status}  name="search_status" variant="outlined" onChange={(e)=>setSearchStatus(e.target.value)} displayEmpty>
                    <MenuItem key='--SELECT--' value='--SELECT--'>
                          --SELECT--
                    </MenuItem>
                      {statuslist?statuslist.map(option => {
                            return (<MenuItem key={option.stateName} value={option.stateName}>
                                    {option.stateName}
                                  </MenuItem>);
                      }):''}
                    </Select>
                </FormControl>
               </div>
              </div>
          </div>

 
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Receiver Name:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField name="search_receivername" variant="outlined" value={search_receivername} onChange={(e)=>setSearchReceivername(e.target.value)}/>
              </div>
              </div>
            
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Receiver Address:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField name="search_receiveraddress" variant="outlined" value={search_receiveraddress} onChange={(e)=>setSearchReceiveraddress(e.target.value)}/>
              </div>
              </div>
           </div>


          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Receiver Postal Code:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField  name="search_receiverzipcode" variant="outlined" value={search_receiverzipcode} onChange={(e)=>setSearchReceiverzipcode(e.target.value)}/>
             
              </div>
              </div>
           </div>

           <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Receiver Phone #:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
              <TextField  name="search_receiverphone" variant="outlined" value={search_receiverphone} 
              onChange={(e)=>setSearchReceiverphone(e.target.value)}/>
            
               {/* <MuiPhoneNumber className="addProdColThree"
                    onlyCountries	={['ca','us']}
                    name="search_receiverphone"
                    // label="Phone"
                    value={search_receiverphone}
                    onChange={(e)=>setSearchReceiverphone(e)} 
                    variant="outlined"
                    data-cy="user-phone"
                    defaultCountry={"ca"}
                /> */}
              </div>
              </div>
           </div>

           <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Arrival Date:</Typography>
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
              <Typography variant="overline" gutterBottom>Arrival Date:</Typography>
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
        title='Order List'
        columns={[
        { title: 'Row ID', field: 'tableData.id',   render: rowData => rowData.tableData.id + 1 },
        { title: 'Order Number', field: 'trackingNumber', render: rowData => <Link
          to={{pathname: `/admin/orderdetails/${rowData.trackingNumber}`,
                state: {
                  trackingNumber: search_trackingnumber,
                  arrivalBatch: search_arrivalBacthID,
                  status: search_status,
                  receiverName: search_receivername,
                  address: search_receiveraddress,
                  receiverPhone: search_receiverphone,
                  postCode: search_receiverzipcode,
                  arrivalDateFrom: search_startdt,
                  arrivalDateTo: search_enddt
                 }
                }}>
                <u>{rowData.trackingNumber}</u>
            </Link> },
          { title: 'Arrival Batch ID', field: 'arrivalBatchCode',render: rowData => <Link
           params={{ arrivalBatch: rowData.arrivalBatchCode }} to={{pathname: `/arrivalbatch/${rowData.arrivalBatchCode}`,
                
                  }}>
                  <u>{rowData.arrivalBatchCode}</u>
              </Link>},
          { title: 'Status', field: 'status' },
          { title: 'Receiver Name', field: 'receiverName' },
          { title: 'Receiver Address', field: 'address' },
          { title: 'Delivery Batch ID', field: 'deliveryBatchCode',render: rowData => <Link
          params={{ trackingnumber: rowData.deliveryBatchCode }} to={{pathname: `/admin/routeplanning/${rowData.deliveryBatchStatus}/${rowData.deliveryBatchCode}`,
          state: {
            deliveryBatchID: rowData.deliveryBatchCode,
            deliveryState: rowData.deliveryBatchStatus
           }
                 }}>
                 <u>{rowData.deliveryBatchCode}</u>
             </Link>},
          { title: 'Receiver Postal Code', field: 'postCode'},
          { title: 'Receiver Phone #', field: 'phoneNumber' },
          { title: 'Arrival Time', field: 'scanedDateTime' },
          { title: 'Update Time', field: 'updatedTime' },

          { title: 'Order Tracking', sorting: false, render: rowData => <Link
          to={{pathname: `/admin/ordertracking/${rowData.trackingNumber}`,
                state: {
                  trackingnumber: rowData.trackingNumber,
                }
                }}>
                <u>View</u>
          </Link> },

        { title: 'Order History', sorting: false, render: rowData => <Link
        to={{pathname: `/admin/orderhistory/${rowData.trackingNumber}`,
              state: {
                trackingnumber: rowData.trackingNumber,
              }
              }}>
          <u>View</u>
        </Link> },
       
        ]}

        data={orderlist}
        // actions={[
        //   {
        //     icon: Visibility,
        //     tooltip: 'View Order Tracking',
        //     onClick: (event, rowData) => {
        //       history.push(`/admin/ordertracking/${rowData.trackingNumber}`)
        //     }
        //   },

        //   {
        //     icon: History,
        //     tooltip: 'View Order History',
        //     onClick: (event, rowData) => {
        //       history.push(`/admin/orderhistory/${rowData.trackingNumber}`)
        //     }

        //   }
        // ]}

        options={{
          actionsColumnIndex: -1,
          paginationPosition:'both',
          pageSize: 10,
          pageSizeOptions: orderlist.length<50?[10,20,50]:[10,20,50,200],
          headerStyle: {
            backgroundColor: 'transperant',
            color: '#23263d'
          }
        }}
      />

    </>
    
  );
}

export default withSnackbar(TrackingOrders);

import React, {useState, useEffect,useRef, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Form, Col} from 'react-bootstrap'
import { TextField, Card,Button} from '@material-ui/core';
import { ValidatorForm, SelectValidator,TextValidator} from 'react-material-ui-form-validator'
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {withSnackbar} from 'notistack'

import {getFilteredArrivalBatchs} from '../store/actions/oper'
import {addNewArrivalBatch} from '../store/actions/oper'
import {getWareHouseList} from '../store/actions/oper'
import Commonhelper from '../helper/Commonhelper'
import { AuthContext } from "../App"
import {Link,useHistory, useLocation} from 'react-router-dom'
import {useSnackbar} from 'notistack'
import MaterialTable from 'material-table'
import Checkbox from '@material-ui/core/Checkbox';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles((theme) => ({
  container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  root: {
      width: '100%',
      '& svg': {
        margin: theme.spacing(1.0),
      },
      '& hr': {
        margin: theme.spacing(0, 0.2),
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    margin: {
      margin: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
}));

const ArrivalBatch = (props) => {
  let history = useHistory()
  let {state: authState, dispatch} = useContext(AuthContext)
  const [arrivalbatchlist, setArrivalbatchlist] = useState([])
  const [wareHouseList, setWareHouseList] = useState([])
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const formRef = useRef(null);

  let newDate = new Date();
  let newDate_string = Commonhelper.formatDate(newDate);
  // newDate = newDate.toISOString().substr(0,10);
  const search_qry = useLocation().search;  
  let arrivalbatch_qry = '';
  let location_qry=''
  let startdt_qry='';
  let enddt_qry='';
  let is_searchAll="false";
  if(search_qry) {
    arrivalbatch_qry=new URLSearchParams(search_qry).get('search_arrivalbatch');
    
    startdt_qry=new URLSearchParams(search_qry).get('search_startdt');
    enddt_qry=new URLSearchParams(search_qry).get('search_enddt');
  }else{
    startdt_qry = newDate_string;
    enddt_qry = newDate_string;
  }

  const [sel_warehouse, setSelWarehouse] = useState('');
  const [search_arrivalbatch, setSearchArrivalbatch] = useState(arrivalbatch_qry?arrivalbatch_qry:'');
  const [search_location, setSearchLocation] = useState(location_qry?location_qry:'');
  const [search_startdt, setSearchStartdt] = useState(startdt_qry?startdt_qry:'');
  const [search_enddt, setSearchEnddt] = useState(enddt_qry?enddt_qry:'');
  const [submit_state, setSubmitState] = useState('');

  const [route_number, setRouteNumber] = useState('');
  const [selected_arrivalbatch, setSelectedArrivalbatch] = useState([]);

  const [is_selected, setIsSelected] = useState(false);
  const [open, setOpen] = useState(false);

  const [is_failedorders, setIsFailedorders] = useState(false);

  useEffect(() => {
    let isUnmount = false;
    getInitailizeData(isUnmount);
    // console.log('useEffect')

    return () => isUnmount = true; 
  },[])

  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }
      
  function getInitailizeData(isUnmount){
    getWareHouseList(authState.token, authState.userId).then(({data}) =>{
      // console.log(data)
 
    //  let whList = data;
      if(!isUnmount){
        setWareHouseList(data);
        setSearchLocation(data[0].id);
        setSelWarehouse(data[0].id);
      }

      if(search_qry) {
        location_qry=new URLSearchParams(search_qry).get('search_location');
        setSearchLocation(location_qry?location_qry:data[0].id)

        is_searchAll=new URLSearchParams(search_qry).get('isAll');
      }
       
      let params= {
        "userId": authState.userId,
        "warehouseId":location_qry?location_qry:data[0].id,
        "createDateFrom": search_startdt,
        "createDateTo":search_enddt,
        "isAll": is_searchAll?is_searchAll:"false",
        "arrivalBatch":search_arrivalbatch?search_arrivalbatch:''
      };

      getFilteredArrivalBatchs(authState.token, params).then(({data}) =>{
        if(!isUnmount){
          setArrivalbatchlist(data)
          setSelectedArrivalbatch([])
        }
         
      }).catch(err => {
       console.log('err', err)
       if(err.response && err.response.data ) {
          check_logout(Commonhelper.geterrorcode(err.response.data));
          enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
        }else{
          enqueueSnackbar('Something went wrong',{variant:"warning"});
        }
      })
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{variant:"warning"});
      }
    })
  
  }
        

  const handleChange = (event) => {
    event.preventDefault()
    const add = submit_state==="Add"?true:false;

    console.log(is_failedorders)
    // save
    if (add) {
      let newDate2 = new Date();
      let newDate_string2 = Commonhelper.formatDateTime(newDate2);

      let params= {
        // "userId": authState.userId,
        "warehouseId":sel_warehouse,
        "createDate": newDate_string2,
        "isForFailedParcel": is_failedorders.toString()
      };

    addNewArrivalBatch(authState.token, params).then(({data}) => {
      enqueueSnackbar('Added Successfully',{variant:"success"});

      history.push('/arrivalbatch/'+data, {
        arrivalbatchid: data,
        location_id: sel_warehouse
       })

      }).catch(err => {
        console.log("err", err)
        if(err.response && err.response.data ) {
           enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
        }else{
           enqueueSnackbar('Something went wrong',{variant:"warning"});
        }
      })

    }
  }

  const handleChkboxChange=(e) => {
    // console.log(e.target.checked)
    setIsFailedorders(e.target.checked)
  }

  const handleDeliveryOverview = () => {
    console.log(selected_arrivalbatch)
    if(selected_arrivalbatch.length>0) {
      // console.log(selected_arrivalbatch)
      history.push('/admin/deliveryoverview',{
        selected_arrivalbatch: selected_arrivalbatch,
        route_number: route_number
       })
    }else{
      alert('Please Select Arrival Batch.');
    }
 

  }

  const handleReset=() => {

    setSearchArrivalbatch('')
    setSearchStartdt('')
    setSearchEnddt('')

    if(wareHouseList) {
      setSearchLocation(wareHouseList[0].id)
    }
    
    setArrivalbatchlist([])
    setSelectedArrivalbatch([])

    let url_string=authState.isAdmin?"/admin/arrivalbatchmanagement":"/";
    history.push(url_string);
   
  }

  const handleSearchAll = () => {
    // console.log('handle search all')
    // handleReset();

    setSearchArrivalbatch('')
    setSearchStartdt('')
    setSearchEnddt('')
    setArrivalbatchlist([])
    setSelectedArrivalbatch([])

    let url_string=authState.isAdmin?"/admin/arrivalbatchmanagement":"/";
    history.push(url_string+"?isAll=true&search_location="+search_location);

    let params= {
      "userId": authState.userId,
      "warehouseId":search_location,
      "createDateFrom": '',
      "createDateTo":'',
      "isAll": "true",
      "arrivalBatch":''
    };
    getFilteredArrivalBatchs(authState.token,params).then(({data}) =>{
      // console.log(data)
      setArrivalbatchlist(data)
      setSelectedArrivalbatch([])
        
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{variant:"warning"});
      }
    })
  }

  const handleClickBtn=() => {
    console.log('handleClickBtn')
    setOpen(true);
  }

  const handleSearch = () => {
    // console.log('handle search')

    let params= {
      "userId": authState.userId,
      "warehouseId":search_location,
      "createDateFrom": search_startdt,
      "createDateTo":search_enddt,
      "isAll": "false",
      "arrivalBatch":search_arrivalbatch
    };

    let url_string=authState.isAdmin?"/admin/arrivalbatchmanagement":"/";
    history.push(url_string+"?search_arrivalbatch="+search_arrivalbatch+"&search_location="+search_location+"&search_startdt="+search_startdt+"&search_enddt="+search_enddt)


    getFilteredArrivalBatchs(authState.token,params).then(({data}) =>{
    // console.log(data)
      setArrivalbatchlist(data)
      setSelectedArrivalbatch([])
        
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{variant:"warning"});
      }
    })
  }


  return (
    <>
    <h2>Arrival Batch Management</h2>

    <Card>
      <ValidatorForm ref={formRef} onSubmit={handleChange} className="mt-0 mb-0 ml-0 mr-0" noValidate autoComplete="off">
       
            <Form.Row>
     
              <Col>
                <SelectValidator className="textarea_clinic" required name="sel_warehouse" variant="outlined" label="Select Warehouse" placeholder="SELECT" value={sel_warehouse} onChange={(e)=>setSelWarehouse(e.target.value)}
                validators={['required']} errorMessages={['this field is required']}>
                      {wareHouseList?wareHouseList.map(option => {
                        return (<MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>);
                      }):''}
                </SelectValidator>
              </Col>


              </Form.Row>

              <Col>
                <FormControlLabel
                    control={
                      <Checkbox
                        checked={is_failedorders}
                        onChange={handleChkboxChange}
                        name="is_failedorders"
                      />
                    }
                    label="For Failed Parcels"
                  />
              </Col>

            <Form.Row>
              <Col>
                <Button disabled={ !sel_warehouse} variant="contained" className="MuiButton-containedPrimary" type="submit" onClick={()=>setSubmitState('Add')} >Create Arrival Batch</Button>
               </Col>
              <Col>
              </Col>
            </Form.Row>
      
      </ValidatorForm>
     </Card>
     
     <Card>
      <div className="row search-report">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-10 mb-0">
              <Typography variant="overline" gutterBottom>Arrival Batch:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-12 mb-0">
              <TextField id="standard-start-adornment" name="search_arrivalbatch" variant="outlined" value={search_arrivalbatch} onChange={(e)=>setSearchArrivalbatch(e.target.value)}/>
              </div>
              </div>
            
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-5 mb-0">
              <Typography variant="overline" gutterBottom>Warehouse:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-12 mb-0">
         
                <FormControl className={classes.formControl}>
                    <Select value={search_location}  name="search_location" variant="outlined" onChange={(e)=>setSearchLocation(e.target.value)} displayEmpty>
                      {wareHouseList?wareHouseList.map(option => {
                            return (<MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                  </MenuItem>);
                      }):''}
                    </Select>
                </FormControl>
               </div>
              </div>
            
          </div>
    
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-12 mb-0 date-field-outline date-time-reports">
             <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-6 mb-0 date-field-outline">
              <Typography variant="overline" gutterBottom>Create Date:</Typography>
            </div>
        
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-0 date-field-outline date-time-reports">
                <TextField
                  InputProps={{
                    startAdornment: <InputAdornment position="start">From</InputAdornment>,
                  }}
                  id="date_start"  type="date" className={classes.textField}
                  InputLabelProps={{shrink: true,}}
                    value={search_startdt} onChange={(e)=>setSearchStartdt(e.target.value)}/>
              </div>
          
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-0 date-field-outline date-time-reports">
                <form className={classes.container} noValidate>
                  <TextField
                    InputProps={{
                      startAdornment: <InputAdornment position="start">To</InputAdornment>,
                    }}
                    id="date_end"  type="date"  className={classes.textField}
                    InputLabelProps={{shrink: true,}}
                      value={search_enddt} onChange={(e)=>setSearchEnddt(e.target.value)}/>
                </form>
              </div>
            </div>
          </div>

        </div>

        <div className="row search-btns">
            <FormGroup row>
                <FormControl>
                    <Button variant="contained"  color="primary" className={classes.margin} onClick={handleSearch}>Search </Button>

                    <Button variant="contained"  color="primary" className={classes.margin} onClick={handleSearchAll}>Search All ArrialBatch </Button>

                    <Button variant="contained"  color="primary" className={classes.margin} onClick={handleReset}> Reset </Button>
                </FormControl>
                    
            </FormGroup>
        </div>

     </Card>

    
      <MaterialTable
        title='Arrival Batch List'
        columns={[
        { title: 'Arrival Batch', field: 'arrivalBatch', render: rowData => <Link
        params={{ arrivalBatch: rowData.arrivalBatch }} to={{pathname: `/arrivalbatch/${rowData.arrivalBatch}`,
                state: {
                  search_arrivalbatch: rowData.arrivalBatch,
                  search_location: search_location,
                  search_startdt: search_startdt,
                  search_enddt: search_enddt
                  // location_id: rowData.location_id
                 }
              
                }}>
                <u>{rowData.arrivalBatch}</u>
            </Link>,width: "20%"  },
          { title: 'Create Date', field: 'createDate', defaultSort:"desc",width: "10%" },
          { title: 'Total Order', field: 'totalOrder', width: "8%"  },
          { title: 'Arrived', field: 'arrivedOrder', width: "8%"  },
          { title: 'In Progress', field: 'inProgressOrder', width: "10%"  },
          { title: 'Pickup', field: 'pickupOrder', width: "8%"  },
          { title: 'Completed', field: 'completedOrder' , width: "10%" },
          { title: 'Failed', field: 'failedOrder' , width: "8%" },
          { title: 'Cancelled', field: 'cancelledOrder' , width: "10%" },
          { title: '%Delivered', field: 'percentDelivered', width: "8%"  },
         
        ]}

        // data={arrivalbatchlist}
        data={arrivalbatchlist.map(row => {
          row.tableData = {...row.tableData, disabled: row.arrivedOrder?false:true};
          return row;
        })}

        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
          // paging: false,
          paginationPosition:'both',
          selection: authState.isAdmin,
          selectionProps: rowData => ({
            disabled: rowData.arrivedOrder?false:true,
          }),
          headerStyle: {
            backgroundColor: 'transperant',
            color: '#23263d'
          },
          tableLayout: "fixed"

        }}

        onSelectionChange={(rows) => {let selectedArray = []; rows.forEach(row=>{ selectedArray.push(row.arrivalBatch)}); setSelectedArrivalbatch(selectedArray); if(selectedArray.length>0) {setIsSelected(true);} else {setIsSelected(false);} } }  

      />


   {authState.isAdmin?<Button disabled={!is_selected} variant="contained" className="MuiButton-containedPrimary" onClick={handleClickBtn} >Delivery Overview</Button>:''}
   {authState.isAdmin && open?<RoutenumberDialog handleDeliveryOverview={handleDeliveryOverview} setOpen={setOpen} open={open} route_number={route_number} setRouteNumber={setRouteNumber}/>:''}       

      {/* {authState.isAdmin?<ValidatorForm ref={formRef} onSubmit={handleDeliveryOverview} className="mt-0 mb-0 ml-0 mr-0" noValidate autoComplete="off">
            <Form.Row>
              <Col className="col-1" >
               <label style={{padding:10, }}>Route #:</label>
              </Col>
       
              <Col className="col-3">
                <TextValidator  style={{width:'100%'}} name="route_number" variant="outlined" value={route_number} onChange={(e)=>setRouteNumber(e.target.value)}
              validators={['required', 'isNumber', 'maxNumber:50']} errorMessages={['this field is required', 'number only', 'maximum number 50']}/>

              </Col>
       
              <Col>
                <Button disabled={!is_selected} variant="contained" className="MuiButton-containedPrimary" type="submit" >Delivery Overview</Button>
              </Col>
            </Form.Row>
      
      </ValidatorForm>:''} */}


    </>
    
  );
}

export default withSnackbar(ArrivalBatch);

function RoutenumberDialog(props){

 function handleClose(event) {
    event.preventDefault();
    props.setOpen(false)
  }

  function handleProceed(event) {
     event.preventDefault();
    //  console.log("do proceed")
    props.handleDeliveryOverview()
    props.setOpen(false)
  }


  return (
    <Dialog aria-labelledby="simple-dialog-title" open={props.open}>
      <div>
      <ValidatorForm className="mt-0 mb-0 ml-0 mr-0" onSubmit={handleProceed} noValidate autoComplete="off">
        <Form.Row>

              <Col className="col-6" >
               <TextValidator  name="route_number" variant="outlined"  label="Route #"  value={props.route_number} onChange={(e)=>props.setRouteNumber(e.target.value)}
              validators={['required', 'isNumber', 'maxNumber:50']} errorMessages={['this field is required', 'number only', 'maximum number 50']}/>

              </Col>
        
        <div>
          <Button disabled={!props.route_number} variant="contained" color="primary" name="save" id="save" type="submit">Proceed</Button>
          <Button  variant="contained" color="secondary" name="cancel" id="cancel" onClick={handleClose}>Cancel</Button>
        </div>
        </Form.Row>
      </ValidatorForm>
      </div>
    </Dialog>
  );
  
}

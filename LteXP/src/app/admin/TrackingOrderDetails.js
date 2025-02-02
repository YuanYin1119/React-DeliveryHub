import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Card,Button, Checkbox} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
// import FormControl from '@material-ui/core/FormControl';
import {withSnackbar} from 'notistack'
import { AuthContext } from "../App"
import { useParams, useHistory, useLocation} from 'react-router-dom'
import {useSnackbar} from 'notistack'

import {getOrderStatusList, getParcelDetails, updateOrder} from '../store/actions/admin'
import TicketOperations from './components/TicketOperations'
import Commonhelper from '../helper/Commonhelper'

const useStyles = makeStyles((theme) => ({

    margin: {
      margin: theme.spacing(1),
    },

    half_width: {
      width: '50%',
    },

    fourth_width: {
      width: '25%',
    },

    full_width: {
      width: '100%',
    },

    disabled_ipt:{
      background: '#e6e3e3',
    }
}));

const operations = [
  {
    value: '0',
    label: '--Select--',
  },
  {
    value: '1',
    label: 'Second Arrival Scan',
  },
  {
    value: '2',
    label: 'Reassign Delivery Status',
  },
  {
    value: '3',
    label: 'Self Pickup',
  },
  {
    value: '4',
    label: 'Second Delivery',
  },
];


const TrackingOrderDetails = (props) => {
  const param_id  = useParams();
  
  let history = useHistory()
  const location = useLocation();
  let {state, dispatch} = useContext(AuthContext)
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [search_trackingnumber, setSearchTrackingnumber] = useState(param_id.id);
  const [operation, setOperation] = useState('0');
  const [second_arrival_scan_reasons, setSecondArrivalScanReasons] = useState({
    chk_wrong_address: false,
    chk_unable_to_contact_customer: false,
    chk_package_denied: false,
    chk_wrong_phone: false,
    chk_other:false,
  })

  const [second_arrival_scan_time, setSecondArrivalScanTime]=useState('');
  const [second_arrival_scan_arrivalbatch, setSecondArrivalScanArrivalbatch]=useState('');

  const [selfpickup_locate, setSelfpickupLocate] = useState('');
  const [statuslist, setStatuslist] = useState([]);

  const [scddelivery_fee, setScddeliveryFee] = useState(false);
  const [scddelivery_addrnotes, setScddeliveryAddrnotes] = useState('');
  const [scddelivery_drivernotes, setScddeliveryDrivernotes] = useState('');
  const [scddelivery_buzzcode, setScddeliveryBuzzcode] = useState('');
  const [scddelivery_feeAmount, setScddeliveryFeeAmount] = useState('');

  const [warehouse_input, setWarehouseInput] = useState('');
  const [ref_number_input, setRefNumberInput] = useState('');
  const [second_ref_number_input, setSecondRefNumberInput] = useState('');
  const [pre_arrivalbatchID_input, setPreArrivalbatchIDInput] = useState('');
  const [arrivalbatchID_input, setArrivalbatchIDInput] = useState('');
  const [deliverybatchID_input, setDeliverybatchIDInput] = useState('');
  const [zone_input, setZoneInput] = useState('');
  const [status_input, setStatusInput] = useState('');
  const [orig_status, setOrigStatus] = useState('');
  const [item_input, setItemInput] = useState('');
  const [name_input, setNameInput] = useState('');
  const [addr_input, setAddrInput] = useState('');
  const [streetnumber_input, setStreetnumberInput] = useState('');
  const [unitnumber_input, setUnitnumberInput] = useState('');
  const [street_input, setStreetInput] = useState('');
  const [city_input, setCityInput] = useState('');
  const [province_input, setProvinceInput] = useState('');
  const [country_input, setCountryInput] = useState('');
  const [zip_input, setZipInput] = useState('');
  // const [buzzcode_input, setBuzzcodeInput] = useState('');
  const [phonenumber_input, setPhonenumberInput] = useState('');
  const [latitude_input, setLatitudeInput] = useState('');
  const [longitude_input, setLongitudeInput] = useState('');
  // const [locate_input, setLocateInput] = useState('');
  const [driverID_input, setDriverIDInput] = useState('');
  const [driverName_input, setDriverNameInput] = useState('');
  const [driverphone_input, setDriverphoneInput] = useState('');
  const [ordernotes_input, setOrdernotesInput] = useState('');
  const [photo_info, setPhotoInfo] = useState('');
  const [signature, setSignature] = useState('');
  const [signatureNeeded, setSignatureNeeded] = useState('');
  const [failedReason, setFailedReason] = useState('');
  
  const [displayerrmsg_notes, setDisplayerrmsg_notes] = useState(false);
  // const [drivernotes_input, setDrivernotesInput] = useState('');
  // const [feeAmount_input, setFeeAmountInput] = useState('');

  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    if(param_id.id){
    getParcelDetails(state.token, param_id.id).then(({data}) =>{
      // console.log(data)
      if(data.trackingNumber){
        setOrderDetails(data)

      }else{
        enqueueSnackbar("Order not found",{variant:"warning"});
      }
      
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{ variant:"warning"});
      }
    })
  }


    getOrderStatusList(state.token).then(({data}) =>{
        // console.log(data)
        setStatuslist(data)
          
      }).catch(err => {
        console.log('err', err)
      })
 
  },[])


  const setOrderDetails=(data) => {
    setWarehouseInput(data.warehouseName)
    setRefNumberInput(data.referenceNumber)
    //setSecondRefNumberInput()
    setPreArrivalbatchIDInput(data.preArrivalBatchId)
    setArrivalbatchIDInput(data.arrivalBatchCode)
    setDeliverybatchIDInput(data.deliveryBatchCode)
    setZoneInput(data.zoneCode)
    setStatusInput(data.status)
    setOrigStatus(data.status)
    setItemInput(data.itemDescription)
    setNameInput(data.receiverName)
    setAddrInput(data.address)
    setCityInput(data.city)
    // setStreetnumberInput
    // setUnitnumberInput
    // setStreetInput
    setProvinceInput(data.province)
    // setCountryInput
    setZipInput(data.postCode)
    // setBuzzcodeInput(data.buzzCode)
    setScddeliveryBuzzcode(data.buzzCode)
    setPhonenumberInput(data.phoneNumber)
    setLatitudeInput(data.latitude)
    setLongitudeInput(data.longitude)
    // setLocateInput(data.location)
    setSelfpickupLocate(data.location)
    setDriverIDInput(data.driverId)
    setDriverNameInput(data.driverName)
    setDriverphoneInput(data.driverPhoneNumber)
    setPhotoInfo(data.photo)
    setSignature(data.singnature)
    setOrdernotesInput(data.orderNote)

    setScddeliveryAddrnotes(data.addressNote)
    setScddeliveryDrivernotes(data.driverNote)
    setScddeliveryFee(data.fee)
    setScddeliveryFeeAmount(data.feeAmount)
    setFailedReason(data.failedReason)
    setSignatureNeeded(data.signatureNeeded)
    if(data.operation!==0) {
      setOperation(data.operation)
    }


    if(data.orderReason){
      const reason_arr = data.orderReason.split(',');
      // console.log(reason_arr)
      let default_reason = {
        chk_wrong_address: false,
        chk_unable_to_contact_customer: false,
        chk_package_denied: false,
        chk_wrong_phone: false,
        chk_other:false,
      };

      const reasons_name=['chk_wrong_address','chk_unable_to_contact_customer', 'chk_package_denied','chk_wrong_phone', 'chk_other' ];

      reason_arr.forEach(function(item) {
        if(item) {
          default_reason[reasons_name[item-1]]=true;
        }
      })

      setSecondArrivalScanReasons(default_reason);

    }
    
  }

  const setStatusChange=(val) => {
      setStatusInput(val)

      if(val!==orig_status && ordernotes_input.trim()==="") {
        setDisplayerrmsg_notes(true)
      }else{
        setDisplayerrmsg_notes(false)
      }
  }

  const setOrderNotes=(val) => {
    console.log(val)
    setOrdernotesInput(val)

    if(status_input!==orig_status && val.trim()==="") {
      setDisplayerrmsg_notes(true)
    }else{
      setDisplayerrmsg_notes(false)
    }

  }

  const handleBack=(event) => {
    event.preventDefault();
    if(state.isAdmin) {
      history.push("/admin/ordermanagement?status="+location.state.status+"&trackingNumber="+location.state.trackingNumber+"&arrivalBatch="+location.state.arrivalBatch
      +"&receiverName="+location.state.receiverName+"&address="+location.state.address+"&receiverPhone="+location.state.receiverPhone
      +"&postCode="+location.state.postCode+"&arrivalDateFrom="+location.state.arrivalDateFrom+"&arrivalDateTo="+location.state.arrivalDateTo)
    }
  }

  const handleOperationChanges=(tag, event) => {
    //console.log(tag)
    //console.log(operation)
    //console.log(event.target.value)
    setOperation(event.target.value);
  }

  const str2bool = (value) => {
    if (value && typeof value === "string") {
         if (value.toLowerCase() === "true") return true;
         if (value.toLowerCase() === "false") return false;
    }
    return value;
 }

  const handleChange=(event) => {
  
    const save = event.target.textContent==="Save"?true:false;
    if (save) {
      // console.log('save new values...')

      // console.log(second_arrival_scan_reasons)
      let reasons_str = '';

      // chk_wrong_address: false,
      // chk_unable_to_contact_customer: false,
      // chk_package_denied: false,
      // chk_wrong_phone: false,
      // chk_other:false,
      const key_v={chk_wrong_address:1, chk_unable_to_contact_customer:2, chk_package_denied:3,chk_wrong_phone:4,chk_other:5 }
      for(const key in second_arrival_scan_reasons) {
          if(second_arrival_scan_reasons[key]) {
            reasons_str+=key_v[key]+','
          }
      }
      // console.log(reasons_str)
      // not editable fields:
      // preArrivalBatchId
      // item
      // arrivalBatchCode
      // receiverName
      // address2
      // statusId??
      // weight
      // weightUnit
      // incoterms
      // scanedDateTime
      // warehouseAddress
      // warehosePhoneNumber
      // deliveryBatchCode: deliverybatchID_input
      // driverId
      // driverName
      // driverPhoneNumber
      // photo
      // singnature
      // signatureNeeded
      // warehouseName: warehouse_input,


      const bodyContent = {
        trackingNumber: search_trackingnumber,
        referenceNumber: ref_number_input, 
        itemDescription: item_input,
        //status_input: status_input,
        receiverName: name_input,
        phoneNumber: phonenumber_input,
        address: addr_input,
        city: city_input,
        province: province_input,
        postCode: zip_input,
        zoneCode: zone_input,
        status: status_input,
        latitude: latitude_input,
        longitude: longitude_input,
        location: selfpickup_locate,
        buzzCode: scddelivery_buzzcode,
        fee: str2bool(scddelivery_fee),
        addressNote: scddelivery_addrnotes,
        driverNote: scddelivery_drivernotes,
        feeAmount: scddelivery_feeAmount,
        orderNote: ordernotes_input,
        // reasonId: new_arry,
        operation: operation,
        orderReason: reasons_str,
        operationTime: Commonhelper.getLocalDateTime(),
        signatureNeeded: signatureNeeded
      }

      //console.log(bodyContent)
      updateOrder(state.token, bodyContent).then(({data}) =>{
        // console.log(data)
        // fetch order details
        getParcelDetails(state.token, search_trackingnumber).then(({data}) =>{
          // console.log(data)
          if(data.trackingNumber){
            setOrderDetails(data)
    
          }else{
            enqueueSnackbar("Order not found",{variant:"warning"});
          }
          
        }).catch(err => {
          console.log('err', err)
          if(err.response && err.response.data ) {
            enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
          }else{
            enqueueSnackbar('Something went wrong',{ variant:"warning"});
          }
        })

        enqueueSnackbar("Order updated",{variant:"success"});
          
      }).catch(err => {
        console.log('err', err)
        if(err.response && err.response.data ) {
          enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
        }else{
          enqueueSnackbar('Something went wrong',{ variant:"warning"});
        }
      })

      window.scrollTo(0, 0)
    }

  }

  return (
    <>
    <h2>Order Details</h2>
     <Card>
     <form className="orderedit-form" noValidate autoComplete="off" >
        <div className="row search-report">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Order Number:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="search_trackingnumber" disabled 
                InputProps={{
                        className: classes.disabled_ipt
                      }}
               variant="outlined" value={search_trackingnumber} />
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Warehouse:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="warehouse_input" variant="outlined" value={warehouse_input||''} disabled
                InputProps={{
                  className: classes.disabled_ipt
                }}
                />
              </div>
            </div>
          </div>
          
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Status:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                {/* <TextField  name="status_input" variant="outlined" value={status_input||''} onChange={(e)=>setStatusInput(e.target.value)}/> */}
              
                <TextField id="outlined-select-status" 
                    select
                    value={status_input||''}
                    onChange={(e) => setStatusChange(e.target.value)}
                    SelectProps={{ native: true, }}
                    variant="outlined"
                  >
                    {statuslist.map((option) => (
                      <option key={option.stateName} value={option.stateName}>
                        {option.stateName}
                      </option>
                    ))}
                  </TextField>

              </div>
            </div>
          </div>

    

        </div>

        <div className="row search-report">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Reference Number:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="ref_number_input" variant="outlined" value={ref_number_input||''} onChange={(e)=>setRefNumberInput(e.target.value)}/>
              </div>
            </div>
          </div>

          {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Second delivery Reference Number:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="second_ref_number_input" variant="outlined" value={second_ref_number_input||''} onChange={(e)=>setSecondRefNumberInput(e.target.value)}/>
              </div>
            </div>
          </div> */}

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Pre-Arrival Batch ID:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="pre_arrivalbatchID_input" variant="outlined" value={pre_arrivalbatchID_input||''} disabled 
                InputProps={{
                        className: classes.disabled_ipt
                      }}
                onChange={(e)=>setPreArrivalbatchIDInput(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Arrival Batch ID:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="arrivalbatchID_input" variant="outlined" value={arrivalbatchID_input||''} disabled 
                InputProps={{
                        className: classes.disabled_ipt
                      }}
                onChange={(e)=>setArrivalbatchIDInput(e.target.value)}/>
              </div>
            </div>
          </div>

        </div>

        <div className="row search-report">

  

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Delivery Batch ID:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="deliverybatchID_input" variant="outlined" value={deliverybatchID_input||''} disabled 
                InputProps={{
                  className: classes.disabled_ipt
                }}
                onChange={(e)=>setDeliverybatchIDInput(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Zone:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="zone_input" variant="outlined" value={zone_input||''} onChange={(e)=>setZoneInput(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Customer Phone #:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="phonenumber_input" variant="outlined" value={phonenumber_input||''} onChange={(e)=>setPhonenumberInput(e.target.value)}/>
              </div>
            </div>
          </div>

        </div>

        <div className="row search-report">
  
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Receiver Name:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="name_input" variant="outlined" value={name_input||''} disabled
                InputProps={{
                  className: classes.disabled_ipt
                }}
                 onChange={(e)=>setNameInput(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Receiver Address:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="addr_input" variant="outlined" value={addr_input||''} onChange={(e)=>setAddrInput(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>City:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="city_input" variant="outlined" value={city_input||''} onChange={(e)=>setCityInput(e.target.value)}/>
              </div>
            </div>
          </div>

        </div>

        <div className="row search-report">
  
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Province:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="province_input" variant="outlined" value={province_input||''} onChange={(e)=>setProvinceInput(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Country:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="country_input" variant="outlined" value='Canada' disabled
                InputProps={{
                  className: classes.disabled_ipt
                }}
                onChange={(e)=>setCountryInput(e.target.value)}/>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Postal Code:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="zip_input" variant="outlined" value={zip_input||''} onChange={(e)=>setZipInput(e.target.value)}/>
              </div>
            </div>
          </div>

        </div>


        <div className="row search-report">
   

          {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Buzz code:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="buzzcode_input" variant="outlined" value={buzzcode_input||''} onChange={(e)=>setBuzzcodeInput(e.target.value)} />
              </div>
            </div>
          </div> */}

   

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Latitude:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="latitude_input" variant="outlined" value={latitude_input||''} onChange={(e)=>setLatitudeInput(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Longitude:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="longitude_input" variant="outlined" value={longitude_input||''} onChange={(e)=>setLongitudeInput(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Driver Info:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-5 mb-0">
                <TextField name="driverName_input" variant="outlined" value={driverName_input||''} disabled
                InputProps={{
                  className: classes.disabled_ipt
                }}/>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-5 mb-0">
                <TextField name="driverphone_input" variant="outlined" value={driverphone_input||''} disabled
                InputProps={{
                  className: classes.disabled_ipt
                }}/>
              </div>
            </div>
          </div>

        </div>

        <div className="row search-report">
     
{/* 
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Locate #:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <TextField name="locate_input" variant="outlined" value={locate_input||''} onChange={(e)=>setLocateInput(e.target.value)}/>
              </div>
            </div>
          </div> */}

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Item Description:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <textarea className={classes.full_width} rows="4" name="item_input" variant="outlined" value={item_input||''} onChange={(e)=>setItemInput(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Order Notes:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <textarea className={classes.full_width} rows="4" name="ordernotes_input" variant="outlined" value={ordernotes_input||''} onChange={(e)=>setOrderNotes(e.target.value)}/>
                {displayerrmsg_notes?<span style={{color:'red'}}>Order status is changed, order notes is required</span>:undefined}
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <Typography variant="overline" gutterBottom>Failed Reason:</Typography>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <textarea className={classes.full_width} rows="4" name="failedReason" variant="outlined" disabled
                style={{backgroundColor:"#e6e3e3", border:"none"}} value={failedReason||''} onChange={(e)=>setFailedReason(e.target.value)}/>
              </div>
            </div>
          </div>
         
          <div className="row search-report">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <br/>
                <FormControlLabel
                    style={{marginBottom:10}}
                    control={
                      <Checkbox
                        checked={signatureNeeded}
                        onChange={(event) => setSignatureNeeded(event.target.checked)}
                        name="signatureNeeded"
                      />
                    }
                    label="Signature Needed?"
                  />
                </div>
              </div>
          </div>


        </div>
        <hr/>
        <div className="row search-report">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                <Typography variant="overline" gutterBottom>Actions:</Typography>
              </div>
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                  <TextField id="outlined-select-currency-native" 
                    select
                    //label="Native select"
                    value={operation||''}
                    onChange={(e) => handleOperationChanges("tags", e)}
                    SelectProps={{ native: true, }}
                    // helperText="Please select your operations"
                    variant="outlined"
                  >
                    {operations.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                  {operation!=='0'&&<TicketOperations tag={operation} selfpickup_locate ={selfpickup_locate} 
                  second_arrival_scan_reasons={second_arrival_scan_reasons}
                  second_arrival_scan_time={second_arrival_scan_time}
                  second_arrival_scan_arrivalbatch={second_arrival_scan_arrivalbatch}
                  scddelivery_fee={scddelivery_fee}
                  scddelivery_addrnotes={scddelivery_addrnotes}
                  scddelivery_drivernotes={scddelivery_drivernotes}
                  scddelivery_buzzcode={scddelivery_buzzcode}
                  scddelivery_feeAmount={scddelivery_feeAmount}
                  setSelfpickupLocate_general={(val) => setSelfpickupLocate(val)}
                  setSecondArrivalScanReasons_general={(val) => setSecondArrivalScanReasons(val)}
                  setSecondArrivalScanTime_general={(val) => setSecondArrivalScanTime(val)}
                  setSecondArrivalScanArrivalbatch_general={(val) => setSecondArrivalScanArrivalbatch(val)}
                  setScddeliveryFee_general={(val) => setScddeliveryFee(val)}
                  setScddeliveryAddrnotes_general={(val) => setScddeliveryAddrnotes(val)}
                  setScddeliveryDrivernotes_general={(val) => setScddeliveryDrivernotes(val)}
                  setScddeliveryBuzzcode_general={(val) => setScddeliveryBuzzcode(val)}
                  setScddeliveryFeeAmount_general={(val) => setScddeliveryFeeAmount(val)}
                  />}
                </div>
              </div>
            </div>
        </div>
  

        <hr/>
        <div className="row search-report">
           <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                  <h4>Photo:</h4>
              </div>
              <img className={classes.margin}
                src={`${photo_info}`}
                alt=""
             />
          </div>
        </div>
        <hr/>
        <div className="row search-report">
           <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
                  <h4>Signature:</h4>
              </div>
              <img className={classes.margin, classes.fourth_width}
                src={`${signature}`}
                alt=""
             />
          </div>
        </div>

        <div className="row search-btns">
             <Button variant="contained" disabled={displayerrmsg_notes} color="primary" className={classes.margin} onClick={handleChange} >Save</Button>
             <Button variant="contained" color="primary" className={classes.margin} onClick={handleBack}>Back</Button>
        </div>

        
        </form>
     </Card>
    </>
  );
}

export default withSnackbar(TrackingOrderDetails);

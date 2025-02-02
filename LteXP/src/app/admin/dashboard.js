import React, { useState,useEffect,useContext } from 'react';

import Select from 'react-select';
import { AuthContext } from "../App"
import {useHistory} from 'react-router-dom'
import {useSnackbar, withSnackbar} from 'notistack'
import {getDashboardSummary_today} from '../store/actions/admin'
import {getDashboardSummary_monthly} from '../store/actions/admin'
import {getDashboardSummary_yearly} from '../store/actions/admin'
import Commonhelper from '../helper/Commonhelper'

 const Dashboard = (props) => {
  let history = useHistory()  
  let {state, dispatch} = useContext(AuthContext)
  
  const [total_Orders, setTotalOrders] = useState('');
  const [pending_deliveryOrders, setPendingDeliveryOrder] = useState('');
  const [unscanned_orders, setUnscannedOrders] = useState('');
  const [arrived_orders, setArrivedOrders] = useState('');
  const [failed_orders, setFailedOrders] = useState('');
  const [type, setType] = useState('sel_today');
  const [type_lable, setTypeLable] = useState('Today');
  const { enqueueSnackbar } = useSnackbar();

  const select_opts = [
            { value: 'sel_today', label: 'Today' },
            { value: 'sel_monthly', label: 'Month to Date' },
            { value: 'sel_yearly', label: 'Year to Date' },
   ];


   function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

   useEffect(() => {

    getDashboardSummary_today(state.token).then(({data}) =>{
      //  console.log(data)
      //  let ret = [ 1000,20,300,500, 20  ];
      setTotalOrders(data.total)
      setPendingDeliveryOrder(data.pendingDelivery)
      setUnscannedOrders(data.unscanned)
      setArrivedOrders(data.arrived)
      setFailedOrders(data.failed)
        
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

   const handleSelectedType = (value) => {
    // console.log('value', value)
    setType(value)

    if(value==='sel_yearly') {
        getDashboardSummary_yearly(state.token).then(({data}) =>{
          setTotalOrders(data.total)
          setPendingDeliveryOrder(data.pendingDelivery)
          setUnscannedOrders(data.unscanned)
          setArrivedOrders(data.arrived)
          setFailedOrders(data.failed)
              
          }).catch(err => {
            console.log('err', err)
          })
    }else if(value==='sel_monthly'){
        getDashboardSummary_monthly(state.token).then(({data}) =>{
          setTotalOrders(data.total)
          setPendingDeliveryOrder(data.pendingDelivery)
          setUnscannedOrders(data.unscanned)
          setArrivedOrders(data.arrived)
          setFailedOrders(data.failed)
              
          }).catch(err => {
            console.log('err', err)
          })
    }else{
        getDashboardSummary_today(state.token).then(({data}) =>{
           
          setTotalOrders(data.total)
          setPendingDeliveryOrder(data.pendingDelivery)
          setUnscannedOrders(data.unscanned)
          setArrivedOrders(data.arrived)
          setFailedOrders(data.failed)

           setType('sel_today')
         }).catch(err => {
           console.log('err', err)
         })
    }
 
  }

    return (
      <div>
    
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Dashboard</h4>
       
            </div>
          </div>
          <div className="col-md-12">
            <div className="page-header-toolbar">
         
              <div className="filter-wrapper">
                <div style={{marginLeft:'11px', marginBottom:'14px', width:'30%'}}>
                <Select
                          onChange={(e)=>handleSelectedType(e.value)}
                          options={select_opts}
                          defaultValue={{ label:type_lable, value: type }}
                  />
                </div>
               
              </div>
      
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-sm-6 grid-margin-xl-0 grid-margin">
                    <div className="d-flex">
                      <div className="wrapper">
                        <h3 className="mb-0 font-weight-semibold">{total_Orders?total_Orders:0}</h3>
                        <h5 className="mb-0 font-weight-medium text-primary">Total Orders</h5>
                        
                      </div>
                  
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-sm-6 mt-md-0 mt-4 grid-margin-xl-0 grid-margin">
                    <div className="d-flex">
                      <div className="wrapper">
                        <h3 className="mb-0 font-weight-semibold">{pending_deliveryOrders?pending_deliveryOrders:0}</h3>
                        <h5 className="mb-0 font-weight-medium text-primary">Pending Delivery Orders</h5>
                      
                      </div>
                   
                    </div>
                  </div>
               
                </div>
              <br />
              <br />
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-sm-6 mt-md-0 mt-4 grid-margin-xl-0 grid-margin">
                      <div className="d-flex">
                        <div className="wrapper">
                          <h3 className="mb-0 font-weight-semibold">{unscanned_orders?unscanned_orders:0}</h3>
                          <h5 className="mb-0 font-weight-medium text-primary">Unscanned Orders</h5>
                          
                        </div>
                  
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6 col-sm-6 mt-md-0 mt-4 grid-margin-xl-0 grid-margin">
                      <div className="d-flex">
                        <div className="wrapper">
                          <h3 className="mb-0 font-weight-semibold">{arrived_orders?arrived_orders:0}</h3>
                          <h5 className="mb-0 font-weight-medium text-primary">Arrived Orders</h5>
                        
                        </div>
                    
                      </div>
                    </div>

                  </div>

                  <br />
              <br />


              <div className="row">
                  <div className="col-xl-6 col-lg-6 col-sm-6 grid-margin-xl-0 grid-margin">
                    <div className="d-flex">
                      <div className="wrapper">
                        <h3 className="mb-0 font-weight-semibold">{failed_orders?failed_orders:0}</h3>
                        <h5 className="mb-0 font-weight-medium text-primary">Failed Orders</h5>
                        
                      </div>
                  
                    </div>
                  </div>
        
               
              </div>

                
              </div>
       

            </div>
          </div>
        </div>
  
   
      </div> 
    );

}
export default withSnackbar(Dashboard);
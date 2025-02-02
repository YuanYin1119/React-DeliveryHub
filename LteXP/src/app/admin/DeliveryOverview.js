import React, {useState, useEffect, useContext} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

import {withSnackbar} from 'notistack'
import { AuthContext } from "../App"
import {useHistory, useLocation} from 'react-router-dom'
import {useSnackbar} from 'notistack'
import MaterialTable from 'material-table'
import Commonhelper from '../helper/Commonhelper'
import {deliveryOverviewAPI} from '../store/actions/admin'
import {routePlanning} from '../store/actions/admin'
import Loader from "../common/Loader";

const DeliveryOverview = (props) => {
  const history = useHistory();
  const location = useLocation();
  const {state: authState, dispatch} = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar();

  const [groupedBatchList, setGroupedBatchList] = useState([])
  // const [sel_arrivalbatch, setSelArrivalbatch] = useState([])
  // const [route_number, setRouteNumber] = useState('')
  const [selected_rows, setSelectedRows] = useState([])
  const [routenum_list, setRoutenumList] = useState({})
  const [loading, setLoading] = useState('');

  const [is_continue, setIsContinue] = useState(false);

  useEffect(() => {
    // console.log('in useEffect')
    window.scrollTo(0, 0)
    if(location.state) {

      let route_num = location.state.route_number;
      let temp_numarry = Array.from({length: route_num}, (_, i) => i + 1);
      let rv = {};
      for (var i = 0; i < temp_numarry.length; ++i)
          rv[i+1] = temp_numarry[i];
      setRoutenumList(rv);
  
      let params=[];
      location.state.selected_arrivalbatch.forEach((resObj) => {
        // console.log(resObj)
        params.push(resObj);
      })
      // console.log("deliveryOverviewAPI")
      deliveryOverviewAPI(authState.token, params).then(({data}) =>{
        //console.log(data)
        let groupList=[];
        if(data.postcodeMap) {
          for (const [key, value] of Object.entries(data.postcodeMap)) {
            let temp_obj = {};
            temp_obj.postcode = key;
            temp_obj.zone = value.zoneCode;
            temp_obj.amountofParcel = value.ordersAmount;
            temp_obj.sel_routnumber = '';
            // temp_obj.tableData={checked:false}
            groupList.push(temp_obj);

          }
        }
        setGroupedBatchList(groupList)
        
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
 
  },[])

  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  function check_continue(group_arr){
    console.log('check_continue')
    let tmp_flag=true;
    group_arr.forEach(function(item) {
      console.log(item.sel_routnumber)
      if(item.sel_routnumber==="") {
        tmp_flag = false;
      }
    })
    console.log(tmp_flag)
    setIsContinue(tmp_flag)
  }
  // const handleBackArrivalBatch = () => {
  //   history.push('/admin/arrivalbatchmanagement/')
  // }

  const handleRoutePlanning = () => {

    const groupPostcodes={};
    groupedBatchList.forEach(function(item) {
      if(item.sel_routnumber) {
        if(groupPostcodes[item.sel_routnumber]) {
          groupPostcodes[item.sel_routnumber.toString()].push(item.postcode);
        }else{

          groupPostcodes[item.sel_routnumber.toString()]=[];
          groupPostcodes[item.sel_routnumber.toString()].push(item.postcode);
        }
      }
   
    });
    //console.log(groupPostcodes)

    const arrivalBatchCodes=[];
    if(location.state.selected_arrivalbatch) {
        location.state.selected_arrivalbatch.forEach((resObj) => {
          // console.log(resObj)
          arrivalBatchCodes.push(resObj);
        })
    }
 
    setLoading(true);

    let newDate = new Date();
    let newDate_string = Commonhelper.formatDateTime(newDate);
    let params=  {
      "arrivalBatchCodes": arrivalBatchCodes,
      "groupPostcodes": groupPostcodes,
      "createDate":newDate_string
    };

    routePlanning(authState.token, params).then(({data}) =>{
      // console.log(data.code)
      if(data.code ){
        if(data.code.includes('200')) {
          history.push('/admin/deliverymanagement')
        }else{
          enqueueSnackbar(data.code,{variant:"warning"});
        }
       
      }
      setLoading(false);
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
   
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{variant:"warning"});
      }
      setLoading(false);
    })
    }

  if (loading) return <Loader />;
  return (
    <>
       <h2>Delivery Overview</h2>
       <Card>
          <div>
          <br />
          {/*<Button variant="contained" color="primary"  onClick={handleBackArrivalBatch}>Back to Arrival Batch Management</Button>*/}
          {location.state && <Button variant="contained" color="secondary" onClick={handleRoutePlanning}>Route Planning</Button>}
          </div>
                
      </Card>

      <Card>
        <MaterialTable
        title='Group List'
        columns={[
          { title: 'Postal Code', field: 'postcode', editable:'never' },
          { title: 'Zone', field: 'zone', editable:'never' },
          { title: 'Order #', field: 'amountofParcel', editable:'never' },
          { title: 'Group #', field: 'sel_routnumber', lookup: routenum_list, editable:'always' },
      
        ]}

        data={groupedBatchList}

        localization={{
          body: {
              editRow:{
                saveTooltip: 'Confirm'
              }
          }
        }}

        editable={{

          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...groupedBatchList];
                const index = oldData.tableData.id;

                oldData.sel_routnumber = newData.sel_routnumber;
                dataUpdate[index] = oldData;
         
                selected_rows.forEach(function(item) {
                  //console.log(item);
                  dataUpdate[item].sel_routnumber=newData.sel_routnumber
                })
                check_continue([...dataUpdate]);
                setGroupedBatchList([...dataUpdate]);
                resolve();
              }, 500)
            })

          // onBulkUpdate: changes =>
          //   new Promise((resolve, reject) => {
          //     setTimeout(() => {
          //       console.log(changes)
          //       const dataUpdate = [...groupedBatchList];
          //       for (const key  in changes) {
          //           // console.log(key)
          //           // console.log(changes[key])
          //           dataUpdate[key] = changes[key].newData;
          //        }
          //       setGroupedBatchList(dataUpdate);
  
          //       resolve();
          //     }, 500)
          //   })
        }}
        options={{
          actionsColumnIndex: -1,
          pageSize: 20,
          paginationPosition:'both',
          selection: true,
          headerStyle: {
            backgroundColor: 'transperant',
            color: '#23263d'
          }
        }}

        onSelectionChange={(rows) => {let selectedArray = []; rows.forEach(row=>{selectedArray.push(row.tableData.id)}); setSelectedRows(selectedArray); } }
     
      />
      </Card>
    </>
    
  );
}

export default withSnackbar(DeliveryOverview);

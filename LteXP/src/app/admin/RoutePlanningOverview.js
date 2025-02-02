import React, { useState, useEffect, useContext } from 'react';
import { Card,TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack'
import { withSnackbar } from 'notistack'
import { AuthContext } from "../App"
import { useParams, useHistory } from 'react-router-dom'
import MaterialTable from 'material-table'
import { ZoomOutMap , Visibility} from "@material-ui/icons";
import Button from '@material-ui/core/Button';
import CompleteConfirmDialog from '../shared/CompleteConfirmDialog';
// import TextSearch from '../common/TextSearch';
// import _ from 'lodash'
import Commonhelper from '../helper/Commonhelper'
import { groupOfParcels, Driverlist, submitRoutePlanning, addOrdertoDeliveryBatch } from '../store/actions/admin'

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    }

}));

const RoutePlanningOverview = (props) => {

  // const map_part_location = '"location":$longlat$';
  // const map_part_addhandler = '"addHandler":"mouseover"';
  // const map_part_infobox = '"infoboxOption": { title: $title$, description: $desc$ }';
  // const map_part_pushpin = '"pushPinOption":{ title: $pushpin$, description: "Pushpin" }';
  // const map_part_infoboxaddhandler = '"infoboxAddHandler": {"type" : "click", callback: this.callBackMethod }';
  // const map_part_pushpinaddhandler = '"pushPinAddHandler": {"type" : "click", callback: this.callBackMethod }';

  const param_id = useParams();
  const classes = useStyles();
  // const formRef = useRef(null);
  // console.log(param_id);
  const history = useHistory();
  let { state, dispatch } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar();

  const [groupIDlist, setGroupIDlist] = useState([]);
  const [deliveryBatchID, setDeliveryBatchID] = useState(param_id.id);
  const [deliveryBatchStatus, setDeliveryBatchStatus] = useState(param_id.status);
  const [is_editable, setIsEditable] = useState(true);
  const [driverlist, setDriverlist] = useState({});
  const [groupDriverList, setGroupDriverList] = useState([]);
  const [parcelList, setParcelList] = useState([]);
  const [selectedGroupID, setSelectedGroupID] = useState('');
  const [selectedDriverName, setSelectedDriverName] = useState('');
  const [all_mapinfo, setAllMapinfo] = useState({});
  const [avg_lanlong, setAvgLanlong] = useState({});

  const [deleted_orders, setDeletedOrders] = useState({});

  const [input_seqnumber, setInputSeqnumber] = useState('');
  const [input_trackingnumber, setInputTrackingnumber] = useState('');
  const [selectedRow, setSelectedRow] = useState(0);

  const [openComplete, setOpenComplete] = useState(false);  
  const [openDelete, setOpenDelete] = useState(false);  
  const [is_complete, setIsComplete] = useState(false);  
  
  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  function find_key( key_str){
    let rtn = '';
    groupIDlist.forEach(function(item) {
      // console.log(item.sequence)
      if(item.sequence==key_str) {
        rtn = item.id;
        return ;
      }
    })

    return rtn;
  }

  function find_driverName(list, driver_id){
    // console.log(list)
    // console.log(driver_id)
    let rtn = '';
    
    if(parseInt(driver_id)===-1) {
      return rtn;
    }
    for (let k in list){
      if(parseInt(driver_id) === parseInt(k)) {
        rtn=rtn + list[k];
      }
      // console.log(k)
   } 
  //  console.log(rtn)
    return rtn?"Driver - "+ rtn:"";
  }

  function check_complete(group_arr){
    // console.log('check_complete')
    let tmp_flag=true;
    group_arr.forEach(function(item) {
      // console.log(item)
      if(item.driverId===-1 || item.driverId==='-1') {
        tmp_flag = false;
      }
    })
    // console.log(tmp_flag)
    setIsComplete(tmp_flag)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsEditable(!(deliveryBatchStatus==="Complete"));
    
    Driverlist(state.token).then(({data}) =>{
        // console.log(data);
         let rv = {};
         rv[-1]='--SELECT--';
        for (var i = 0; i < data.length; ++i) {
           rv[`${data[i].id}`] = data[i].name;
        }
        
        // console.log(rv)
      //  const ordered = Object.keys(rv).sort().reduce(
      //     (obj, key) => { 
      //       obj[key] = rv[key]; 
      //       return obj;
      //     }, 
      //     {}
      //   );
        setDriverlist(rv);

        groupOfParcels(state.token, deliveryBatchID).then(({ data }) => {
        
          setGroupIDlist(data.groupList)

          let grpdriver_map=[];
          let groupedParcels={};
          let tmp_ID='';
          let tmp_driverName='';

          let grouped_mapinfo={};
          let grouped_lanlong_avg={};

          data.groupList.sort(function (a, b) {
            return a.sequence - b.sequence
          })

          data.groupList.forEach(function(item) {
            if (tmp_ID === '') {
                   tmp_ID = item.sequence;
            }
            grpdriver_map.push({"group":item.sequence, "driverId":data.groupDriverMap[item.id]?data.groupDriverMap[item.id]:-1, "groupid":item.id })

            if(tmp_driverName===''){
              tmp_driverName = find_driverName(rv, data.groupDriverMap[item.id]?data.groupDriverMap[item.id]:-1);
            }
          
            let new_arry = data.groupOrderMap[item.id].map(function(element){
              // console.log({ ...element, group_seq: item.sequence });
              return  { ...element, group_seq: item.sequence };
            });

            grouped_mapinfo[item.sequence] =  data.groupOrderMap[item.id].map(function(element){
              // let tmp_url="https://www.google.com/maps/place/"+element.latitude+","+element.longitude;
              // <a href="${tmp_url}" target="_blank">View in Google Map</a>

                let tmp =  {
                  "location":[element.latitude, element.longitude],
                  "addHandler":"mouseover",
                  "infoboxOption": { title: element.postCode, description: element.address },
                  "pushPinOption":{ title: String(element.sequence), description: 'Pushpin' },
                }
                return tmp;
            });
         


            let lanlong_obj = data.groupOrderMap[item.id].reduce(function(prev, cur) 
            { 
                if(!prev){
                  prev={"latitude":0, "longitude":0, "cnt":0};
                }
                 let tmp={"latitude":0, "longitude":0, "cnt":0};
                 if(cur.latitude && cur.longitude){
                   tmp.latitude=parseFloat(cur.latitude);
                   tmp.longitude = parseFloat(cur.longitude);
                   tmp.cnt = 1;
                 }
                 return {"latitude":prev.latitude+tmp.latitude, "longitude":prev.longitude+tmp.longitude, "cnt":prev.cnt+tmp.cnt };
            }, 0); 

            if(lanlong_obj.cnt>0) {
              grouped_lanlong_avg[item.sequence] = {"avg_latitude": lanlong_obj.latitude/lanlong_obj.cnt, "avg_longitude":lanlong_obj.longitude/lanlong_obj.cnt }
            }else{
              grouped_lanlong_avg[item.sequence] = {"avg_latitude": 43.651070, "avg_longitude": -79.347015 }
            }
           

            new_arry.sort(function (a, b) {
              var keyA = parseFloat(a.sequence),
                keyB = parseFloat(b.sequence);
              // Compare the 2 keys
              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            });

            groupedParcels[item.sequence] = new_arry;
         
          })

       
          // console.log(grouped_lanlong_avg);
          setGroupDriverList(grpdriver_map);
          check_complete(grpdriver_map)
          setParcelList(groupedParcels);
          setSelectedGroupID(tmp_ID);
          setSelectedDriverName(tmp_driverName);

          setAllMapinfo(grouped_mapinfo);
          setAvgLanlong(grouped_lanlong_avg)

       }).catch(err => {
         console.log('err', err)
         if(err.response && err.response.data ) {
          check_logout(Commonhelper.geterrorcode(err.response.data));
          enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
          }else{
            enqueueSnackbar('Something went wrong',{autoHideDuration:5000, variant:"warning"});
          }
       })
 
        
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{autoHideDuration:5000, variant:"warning"});
      }
    })
   }, [])

   const  handleAction = (action_sel, dialog_button=false) => {
    // console.log(action_sel)
    // console.log(dialog_button)
    
    if(dialog_button===true) {
      if(action_sel) {
        // console.log('call api')
        let groupOrderMap={};
        let groupDriverMap={};
        for(const key in parcelList) {

        let g_id = find_key( key);
          // console.log(g_id)
          groupOrderMap[g_id]=parcelList[key];
        }
    
        groupDriverList.map(function(element){
          // console.log(element)
          let g_id = find_key( element.group);
          groupDriverMap[g_id]= element.driverId;
        
        })
        //  console.log(groupDriverMap);

        let params= {
          "action": action_sel,
          "operationTime": Commonhelper.getLocalDateTime(),
          "deliveryBatchCode":  deliveryBatchID,
          "groupOrderMap":groupOrderMap,
          "groupDriverMap":groupDriverMap
        };

        // console.log(params);
        setOpenComplete(false)
        setOpenDelete(false)

        submitRoutePlanning(state.token, params).then(({data}) =>{
          // console.log(data);
          if(action_sel!=='save') {
            history.push('/admin/deliverymanagement/')
          }else{
            enqueueSnackbar('Saved Successfully',{variant:"success"});
          }
          
        }).catch(err => {
          console.log('err', err)
          if(err.response && err.response.data ) {
            enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
          }else{
            enqueueSnackbar('Something went wrong',{autoHideDuration:5000, variant:"warning"});
          }
        })

      }else{
        enqueueSnackbar('Please Select Action',{autoHideDuration:5000,variant:"warning"});
      }
  }else{
    setOpenComplete(false)
    setOpenDelete(false)
  }
 
  }


  const handleSubmit = (event) => {
    // console.log("submited")
    // console.log(deleted_orders)
    let action_sel='';
    if(event.target.textContent==='Delete') {
      action_sel='redo';
      setOpenDelete(true)
    }else if(event.target.textContent==='Save'){
      action_sel='save';
      handleAction(action_sel, true);
 
    }else if(event.target.textContent==='Complete'){
      action_sel='complete';
      setOpenComplete(true)
    }


  }

  const handleAddOrder = (event) => {
    // selectedGroupID
    if(input_seqnumber && input_trackingnumber && (event.keyCode===13 || event.target.textContent==='Add Order') ) {
      //  console.log("handleAddOrder");

      let groupId_p = find_key(selectedGroupID);

      let params= {
        "deliveryBatchCode": deliveryBatchID,
        "trackingNumber": input_trackingnumber,
        "groupId":groupId_p,
        "sequence": input_seqnumber,
        "operationTime": Commonhelper.getLocalDateTime()
      };
      addOrdertoDeliveryBatch(state.token, params).then(({data}) =>{
        // console.log(data);
        data['group_seq']=selectedGroupID;

        let saved_selectedGroupID = selectedGroupID;
        setSelectedGroupID('')

        let newArr = parcelList[selectedGroupID];
        newArr.push(data);
        newArr.sort(function (a, b) {
          var keyA = parseFloat(a.sequence),
            keyB = parseFloat(b.sequence);
          // Compare the 2 keys
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

        let new_parcellist = parcelList;
        new_parcellist[selectedGroupID] = newArr;

        setParcelList(new_parcellist);
        setSelectedGroupID(saved_selectedGroupID)
        setInputTrackingnumber('')
        setInputSeqnumber('')
        
      }).catch(err => {
        console.log('err', err)
        if(err.response && err.response.data ) {
          enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{autoHideDuration:5000,variant:"warning"});
        }else{
          enqueueSnackbar('Something went wrong',{autoHideDuration:5000,variant:"warning"});
        }
      })
    }
  }


  return (
    <>
      <h2>Route Planning</h2>
      <Card>
        <div className="row search-report">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
              <h4>Delivery Batch ID: {deliveryBatchID}</h4>
            </div>
          </div>
        </div>



        <MaterialTable
          title='Group List'
          columns={[
            { title: 'Group #', field: 'group', editable: 'never' },
            { title: 'Driver', field: 'driverId', lookup: driverlist, editable: 'always'},

          ]}

          data={groupDriverList}


          localization={{
            body: {
                editRow:{
                  saveTooltip: 'Confirm'
                }
            }
          }}

          cellEditable={is_editable?{
            onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
              return new Promise((resolve, reject) => {
                // console.log(newValue)
                const clonedData = [...groupDriverList]
                clonedData[rowData.tableData.id][columnDef.field] = newValue
                check_complete(clonedData)
                setGroupDriverList(clonedData)
                setTimeout(resolve, 500);
                // console.log(rowData);
                // console.log(selectedGroupID)
                if(parseInt(rowData.group)===parseInt(selectedGroupID)) {
                  setSelectedDriverName(find_driverName(driverlist,newValue ))
                }
              
              });
            }
          }:undefined}

          // editable={{
          //   onBulkUpdate: is_editable ? changes =>
          //     new Promise((resolve, reject) => {
          //       setTimeout(() => {
          //         // console.log(changes)
          //         const dataUpdate = [...groupDriverList];
          //         for (const key  in changes) {
          //             // console.log(key)
          //             // console.log(changes[key])
          //             dataUpdate[key] = changes[key].newData;
          //          }
          //          setGroupDriverList(dataUpdate);
    
          //         resolve();
          //       }, 500)
          //     }):undefined
          // }}
        
          // editable={{
          //   onRowUpdate: is_editable ? (newData, oldData) =>
          //     new Promise((resolve, reject) => {
          //       setTimeout(() => {
          //         const clonedData = [...groupDriverList]
          //         const index = oldData.tableData.id;
          //         clonedData[index] = newData
          //         setGroupDriverList(clonedData)

          //         resolve();
          //       }, 1000)
          //     }): undefined,
          //   }}

          actions={[
            {
              icon: Visibility,
              tooltip: 'View Orders',
              onClick: (event, rowData) => {
      
                const found = groupDriverList.find(e => e.group === rowData.group);
                setSelectedGroupID(found.group);
                setSelectedDriverName(find_driverName(driverlist, found.driverId))
                setSelectedRow(rowData.tableData.id)
              }
            },

            {
              icon: ZoomOutMap,
              tooltip: 'View Map',
              onClick: (event, rowData) => {
              // console.log(rowData.driverId)
                localStorage.setItem("map_info", JSON.stringify({"driver_name":rowData.driverId===-1?'':driverlist[rowData.driverId],
                 "map_data":all_mapinfo[rowData.group],
                 "avg_latitude": avg_lanlong[rowData.group].avg_latitude,
                 "avg_longitude": avg_lanlong[rowData.group].avg_longitude }));

                window.open("/admin/viewmap", "_blank")
              }

            }
          ]}
       
          options={{
            actionsColumnIndex: -1,
            pageSize: 5,
            headerStyle: {
              backgroundColor: 'transperant',
              color: '#23263d'
            },
            rowStyle: rowData => ({
              backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
            })
          }}

        />

      <div className="row search-report">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-1 mb-0">
              <Typography variant="overline" gutterBottom>Seq #:</Typography>
           </div>

          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-0">
            <TextField id="standard-start-adornment" name="input_seqnumber" disabled={!is_editable} variant="outlined" value={input_seqnumber}  
            onChange={(e)=>setInputSeqnumber(e.target.value)}/>
          </div>

          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-2 mb-0">
              <Typography variant="overline" gutterBottom>Order Number:</Typography>
          </div>

           <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-0">
            <TextField id="standard-start-adornment"  name="input_trackingnumber" disabled={!is_editable} variant="outlined" value={input_trackingnumber} onKeyDown={handleAddOrder} onChange={(e)=>setInputTrackingnumber(e.target.value)}/>
           </div>

           <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-2 mb-0">
            <Button variant="contained" color="primary" disabled={ !is_editable || (!input_seqnumber || !input_trackingnumber) } onClick={handleAddOrder}>Add Order</Button>
          </div>

      </div>


        <MaterialTable
          title= {selectedDriverName}
          columns={[
            { title: 'Order Seq#', field: 'sequence' },
            { title: 'Order Number', field: 'trackingNumber', editable: 'onAdd'},
            { title: 'Postal Code', field: 'postCode',  editable: 'never' },
            { title: 'Address', field: 'address',  editable: 'never' },
            { title: 'Group #', field: 'group_seq', initialEditValue: selectedGroupID, editable: 'never' },
          ]}

          data={parcelList[selectedGroupID]}
          localization={{
            body: {
                editRow:{
                  saveTooltip: 'Confirm'
                }
            }
          }}

          editable={{
            onRowUpdate: is_editable ? (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  let saved_selectedGroupID = selectedGroupID;
                  setSelectedGroupID('')

                  const dataUpdate = [...parcelList[selectedGroupID]];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;

                  dataUpdate.sort(function (a, b) {
                    var keyA = parseFloat(a.sequence),
                      keyB = parseFloat(b.sequence);
                    // Compare the 2 keys
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                  });

                  let new_parcellist = parcelList;
                  new_parcellist[selectedGroupID] = dataUpdate;

                  setParcelList(new_parcellist);
                  setSelectedGroupID(saved_selectedGroupID)


                  resolve();
                }, 1000)
              }): undefined,

            onRowDelete: is_editable ? oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  let saved_selectedGroupID = selectedGroupID;
                  setSelectedGroupID('')
                  const dataDelete = [...parcelList[selectedGroupID]];
                  const index = oldData.tableData.id;
                  // console.log(oldData.trackingNumber);
                  dataDelete.splice(index, 1);
                  let new_parcellist = parcelList;
                  new_parcellist[selectedGroupID] = dataDelete;
                  setParcelList(new_parcellist);
                  setSelectedGroupID(saved_selectedGroupID)

                  let groupId_p = find_key(selectedGroupID);
                  let tmp_deleted = [];
                  if(!deleted_orders[groupId_p]){
                    tmp_deleted.push(oldData.trackingNumber);
                  }else{
                    tmp_deleted = [...deleted_orders[groupId_p]];
                    tmp_deleted.push(oldData.trackingNumber);
                  }
             
                  let new_deleted_orders = deleted_orders;
                  new_deleted_orders[groupId_p] = tmp_deleted; 
                  setDeletedOrders(new_deleted_orders);
                  
                  resolve()
                }, 1000)
              }):undefined
          }}

          options={{
            actionsColumnIndex: -1,
            // pageSize: 200,
            paging: false,
            headerStyle: {
              backgroundColor: 'transperant',
              color: '#23263d'
            }
          }}
        />

   
        <div>
        <br />
         <Button variant="contained" disabled={!is_editable} className={classes.margin} color="secondary"  onClick={handleSubmit}>Delete</Button>
         <Button variant="contained" disabled={!is_editable} className={classes.margin} color="secondary" onClick={handleSubmit}>Save</Button>
         <Button variant="contained" disabled={!is_editable || !is_complete} className={classes.margin} color="secondary" onClick={handleSubmit}>Complete</Button>
        </div>
    
      </Card>


    {openComplete?
      <CompleteConfirmDialog open={openComplete} action='complete' message="Are you sure to Complete?" onClose={handleAction}/> : null
    }

    {openDelete?
      <CompleteConfirmDialog open={openDelete} action='redo' message="Are you sure to Delete?" onClose={handleAction}/> : null
    } 
    </>
  );
}

export default withSnackbar(RoutePlanningOverview);
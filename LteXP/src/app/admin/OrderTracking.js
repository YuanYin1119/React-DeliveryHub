import React, {useState, useEffect, useContext} from 'react';
import {withSnackbar} from 'notistack'
import Commonhelper from '../helper/Commonhelper'
import { AuthContext } from "../App"
import {useParams, useHistory} from 'react-router-dom'
import {useSnackbar} from 'notistack'
import MaterialTable from 'material-table'
import {getParcelTracking} from '../store/actions/admin'

const OrderTracking = (props) => {

  const param_id  = useParams();

  let history = useHistory()
  let {state: authState, dispatch} = useContext(AuthContext)
  const [ordertrackings, setOrdertrackings] = useState([])
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getParcelTracking(authState.token, param_id.id).then(({data}) =>{
      // console.log(data)
      setOrdertrackings(data.orderState)
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{ variant:"warning"});
      }
    })
  },[])

  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  return (
    <>
     <h2>Order Tracking</h2>
      <MaterialTable
        title={param_id.id}
        columns={[
          { title: 'Status', field: 'status' },
          { title: 'Desctiption', field: 'description', width: "70%", },
          { title: 'Time', field: 'time' },
          // { title: 'Operator', field: 'action_user' },
        ]}

        data={ordertrackings}

        options={{
          actionsColumnIndex: -1,
          paging: false,
          headerStyle: {
            backgroundColor: 'transperant',
            color: '#23263d'
          }
        }}  
      />

    </>
    
  );
}

export default withSnackbar(OrderTracking);

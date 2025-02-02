import React, {useState, useEffect, useContext} from 'react';
import {withSnackbar} from 'notistack'
import Commonhelper from '../helper/Commonhelper'
import { AuthContext } from "../App"
import {useHistory} from 'react-router-dom'
// import {useSnackbar} from 'notistack'
import MaterialTable from 'material-table'


const OrderHistory = (props) => {
  let history = useHistory()
  let {state: authState, dispatch} = useContext(AuthContext)
  const [orderHistorys, setOrderHistorys] = useState([])
  // const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // getOrderHistory();
    let order_historys = [
   
    ];
    // console.log(order_historys)
    setOrderHistorys(order_historys)
  },[])

  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  return (
    <>
     <h2>Order History</h2>
      <MaterialTable
        title=''
        columns={[
          { title: 'Action', field: 'action' },
          { title: 'Desctiption', field: 'description', width: "70%", },
          { title: 'Operator', field: 'action_user' },
        ]}

        data={orderHistorys}

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

export default withSnackbar(OrderHistory);

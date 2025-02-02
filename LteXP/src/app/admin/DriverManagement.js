import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import MaterialTable from 'material-table'
import Commonhelper from '../helper/Commonhelper'
import { DriverlistBySearch } from '../store/actions/admin'
import { AuthContext } from "../App";
import EditDriverDialog from './EditDriverDialog';
import ConfirmDialog from '../shared/ConfirmDialog';
import {useSnackbar} from 'notistack'

export default function DriverManagement() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">Driver Management</h3>
        </div>

        <div>
          <DriverListTable title='Driver List'></DriverListTable>
        </div>
      </div>
    )

}

function DriverListTable(props) {
  const { state: authState, dispatch } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();

  let page_size = 20;
  let [data, setData] = useState([])
  let [total_count, setTotalCount] = useState(0)

  const [openEditDriver, setOpenEditDriver] = useState(false);
  const [openConfirmDriver, setOpenConfirmDriver] = useState(false);

  const [driver_id, setDriverId] = useState('');
  const [driver_fname, setDriverFname] = useState('');
  const [driver_lname, setDriverLname] = useState('');
  const [user_id, setUserId] = useState('');
  const [driver_zone, setDriverZone] = useState('');
  const [driver_type, setDriverType] = useState('');
  const [driver_phone, setDriverPhone] = useState('');

  const [driveraddress, setDriveraddress] = useState('');
  const [drivercity, setDrivercity] = useState('');
  const [driverprovince, setDriverprovince] = useState('');

  const [operation, setOperation] = useState(1);
  

  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  useEffect(() => {

    let params= {
      "firstName": "",
      "lastName": "",
      "phoneNumber":"",
      "address": "",
      "city":"",
      "province":"",
      "postcode":"",
      "valid": true,
      // "online": true
      // "online": false
    };

    DriverlistBySearch(authState.token, params).then(({data}) =>{
      // console.log(data)
      setData(data)
      setTotalCount(data.length)
    }).catch(err => {
      console.log('err', err)

      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{ variant:"warning"});
      }
    })
  }, [])

  const handleEditClose = () => {
    setOpenEditDriver(false);
    // fetchData()

    let params= {
      "firstName": "",
      "lastName": "",
      "phoneNumber":"",
      "address": "",
      "city":"",
      "province":"",
      "postcode":"",
      "valid": true,
      // "online": true
      // "online": false
    };

    DriverlistBySearch(authState.token, params).then(({data}) =>{
      // console.log(data)
      setData(data)
      setTotalCount(data.length)
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{ variant:"warning"});
      }
    })
  };

  const handleConfirmClose = () => {
    setOpenConfirmDriver(false);
    // fetchData()

    let params= {
      "firstName": "",
      "lastName": "",
      "phoneNumber":"",
      "address": "",
      "city":"",
      "province":"",
      "postcode":"",
      "valid": true,
      // "online": true
      // "online": false
    };

    DriverlistBySearch(authState.token, params).then(({data}) =>{
      // console.log(data)
      setData(data)
      setTotalCount(data.length)
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{ variant:"warning"});
      }
    })

  }

  const history = useHistory();

  return (
    <>
    <MaterialTable
      title={props.title}
      columns={[
        { title: 'Driver ID', field: 'id' },
        // { title: 'User ID', field: 'user_id' },
        { title: 'Phone #', field: 'phoneNumber' },
        { title: 'Last Name', field: 'lastName' },
        { title: 'First Name', field: 'firstName' },
        { title: 'Post Code', field: 'postcode' },
        { title: 'Address', field: 'address' },
        { title: 'City', field: 'city' },
        { title: 'Province', field: 'province' },
        { title: 'System Driver?', field: 'systemDriver' },
        { title: 'Online?', field: 'online' },
      ]}

      data={data}
      totalCount={total_count}

      actions={[
        {
          icon: 'edit',
          tooltip: 'Edit Driver',
          onClick: (event, rowData) => {
            const found = data.find(e=>e.id===rowData.id);
            setOpenEditDriver(true);
            setDriverId(found.id)
            // setUserId(found.user_id);
            setDriverPhone(found.phoneNumber);
            setDriverFname(found.firstName);
            setDriverLname(found.lastName);
            setDriverZone(found.postcode)
            setDriverType(found.systemDriver);
            setDriveraddress(found.address)
            setDrivercity(found.city)
            setDriverprovince(found.province)
            setOperation(2)
    
          }
        },
        {
          icon: 'delete',
          tooltip: 'Delete Driver',
          onClick: (event, rowData) => {
            const found = data.find(e=>e.id===rowData.id);
            setOpenConfirmDriver(true);
            setDriverId(found.id)
            setDriverFname(found.firstName);
            setDriverLname(found.lastName);
          }
        },
        {
          icon: 'add',
          tooltip: 'Add Driver',
          isFreeAction: true,
          onClick: () => {
           
            setOpenEditDriver(true);
            setDriverId('');
            // setUserId(found.user_id);
            setDriverPhone('');
            setDriverFname('');
            setDriverLname('');
            setDriverZone('')
            setDriverType(false)
            setDriveraddress('')
            setDrivercity('')
            setDriverprovince('')
            setOperation(1)
          }
        }
      ]}
      options={{
        actionsColumnIndex: -1,
        pageSize: page_size,
        paginationPosition:'both',
        headerStyle: {
          backgroundColor: '#01579b',
          color: '#FFF'
        }
      }}
    />

    { openEditDriver?
      <EditDriverDialog driver_id={driver_id} driver_fname={driver_fname} driver_lname={driver_lname} user_id={user_id} driveraddress={driveraddress} drivercity={drivercity}
      driverprovince={driverprovince} driver_zone={driver_zone} driver_type={driver_type} driver_phone={driver_phone} open={openEditDriver} onClose={handleEditClose} operation={operation}/> : null
    }

    {openConfirmDriver?
      <ConfirmDialog id={driver_id} name={driver_lname+' '+driver_fname} open={openConfirmDriver} onClose={handleConfirmClose}/> : null
    }
    </>
  )
}

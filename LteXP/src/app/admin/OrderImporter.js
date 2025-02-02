import React, {useState, useEffect, useContext} from 'react';
import {withSnackbar} from 'notistack'
import {useSnackbar} from 'notistack'
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Commonhelper from '../helper/Commonhelper'
import { AuthContext } from "../App"
import {useHistory} from 'react-router-dom'
import MaterialTable from 'material-table'
import { LoaderDots } from '@thumbtack/thumbprint-react';
import ExcelUpload from './components/ExcelUpload'
import {ImportOrders} from '../store/actions/admin'
import {getWareHouseList} from '../store/actions/oper'
import {F_SEPARATOR, L_SEPARATOR} from '../store/actions/type'


const OrderImporter = (props) => {
  let history = useHistory()
  let {state:authState, dispatch} = useContext(AuthContext)
  const [order_rows, setOrderRows] = useState([])
  const [proceeding, setProceeding] = useState(false)
  const [proceeding_import, setProceedingImport] = useState(false)
  const [selected_rows, setSelectedRows] = useState([])
  const [sel_warehouse, setSelWarehouse] = useState('')
  const [wareHouseList, setWareHouseList] = useState([])

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getWareHouseList(authState.token, authState.userId).then(({data}) =>{
       setWareHouseList(data);
  
       
    }).catch(err => {
      console.log('err', err)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{variant:"warning"});
      }
    })
  },[])

  function check_logout(err_code){
    if(!Commonhelper.checklogout(err_code)){
      dispatch({type: "LOGOUT"});
      history.push("/");
    }
  }

  function handleCheckboxClick(row, sel_rows) {
    // console.log(row);
    // console.log(sel_rows)
   
    if(row) {
    
        let new_parcellist = order_rows;
        let selected_order =order_rows[row.tableData.id];
        selected_order.is_selected=!selected_order.is_selected;
        selected_order.tableData.checked=selected_order.is_selected;
        new_parcellist[row.tableData.id] = selected_order;
     
        setOrderRows(new_parcellist);
    }else{
        if(sel_rows.length>0) {
            let new_arr = order_rows.map(function(element){
              return  { ...element, tableData: {checked:true}, is_selected:true };
            })
         
            setOrderRows(new_arr);
        }else{
         
            let new_arr = order_rows.map(function(element){
               return  { ...element, tableData: {checked:false}, is_selected:false };
            })
          
            setOrderRows(new_arr);
        }
    }    
  
    setSelectedRows(sel_rows)
  }

  function handleImport() {
   
    // let new_selected = selected_rows;
    // let new_arr = new_selected.map(function(element){
    //   delete element.is_selected;
    //   delete element.row_color;
    //   delete element.tableData;
    //   return  element;
    //  });
    //  console.log(new_arr)

    // format of array list
    // let new_selected = Object.assign([], selected_rows);
    // let new_arr = new_selected.map(function(element){
    //   let phone_num = String(element.phoneNumber).split('.')[0];

    //   return  [String(element.trackingNumber), String(element.referenceNumber), element.receiverName, element.address,
    //     element.address2, element.city, element.province, element.postCode, phone_num,
    //     element.weight, element.weightUnit,element.incoterms, element.itemDescription,element.item ];
    //  });
    //  console.log(new_arr)
    // format of array list

    // format of string
    setProceedingImport(true);

     let post_str = '';

     selected_rows.forEach(function(element) {
      post_str =post_str+ String(element.trackingNumber)+F_SEPARATOR+String(element.referenceNumber)+F_SEPARATOR+element.receiverName 
      +F_SEPARATOR+element.address+F_SEPARATOR+element.address2+F_SEPARATOR+element.city +F_SEPARATOR+ element.province +F_SEPARATOR
      +element.postCode+F_SEPARATOR+element.phoneNumber+F_SEPARATOR+element.weight+F_SEPARATOR+element.weightUnit+F_SEPARATOR
      +element.incoterms+F_SEPARATOR+(element.itemDescription?element.itemDescription:' ')+L_SEPARATOR;
    })

    post_str = post_str.slice(0, -2)
     // format of string

     ImportOrders(authState.token, sel_warehouse, post_str ).then(({data}) =>{
      enqueueSnackbar("importing orders, please wait for a moment and check orders",{variant:"success"});
      setProceedingImport(false);
      alert("importing orders, please wait for a moment and check orders");
    }).catch(err => {
      setProceedingImport(false); 
      console.log('err', err)
      if(err.response && err.response.data ) {
        alert(err.response.data.message);
        // enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{ variant:"warning"});
      }
    })


  }

  return (
    <>
    <div className="row search-report">
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-4 mb-0">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mb-0">
            <Typography variant="overline" gutterBottom>Select Warehouse:</Typography>
          </div>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-6 mb-0">
              <Select className="textarea_clinic" value={sel_warehouse}  name="sel_warehouse" variant="outlined" onChange={(e)=>setSelWarehouse(e.target.value)} displayEmpty>
                                  {wareHouseList?wareHouseList.map(option => {
                                        return (<MenuItem key={option.id} value={option.name}>
                                                {option.name}
                                              </MenuItem>);
                                  }):''}
              </Select>
            </div>
          </div>
      </div>
    </div>


  <hr />
  
    <ExcelUpload setOrderRows={setOrderRows} setSelectedRows={setSelectedRows} setProceeding={setProceeding} sel_warehouse={sel_warehouse} handleImport={handleImport}/>
    
    <h2>Orders Preview</h2>
    
    {proceeding||proceeding_import? <LoaderDots size="medium" /> : <MaterialTable
        title=''
        columns={[
          { title: 'Tracking Number', field: 'trackingNumber' },
          { title: 'Reference', field: 'referenceNumber' },
          { title: 'Internal Account Number', field: 'internal_account' },
         
          { title: 'Consignee', field: 'receiverName' },
          { title: 'Address1', field: 'address' },
          { title: 'Address2', field: 'address2' },
          { title: 'Address3', field: 'address3' },
          { title: 'City', field: 'city' },
          { title: 'Province', field: 'province_name' },
          { title: 'Province Code', field: 'province' },
          { title: 'Zip', field: 'postCode' },
          { title: 'Country Code', field: 'country_code' },
          { title: 'Email', field: 'email' },
          { title: 'Phone', field: 'phoneNumber' },
          { title: 'Pieces', field: 'pieces' },
          { title: 'Total Weight', field: 'weight' },
          { title: 'Weight UOM', field: 'weightUnit' },
          { title: 'Incoterms', field: 'incoterms' },
          { title: 'Item Description', field: 'itemDescription' },
          { title: 'Item HS Code', field: 'hs_code' },
          { title: 'Item Quantity', field: 'quantity' },
          { title: 'Item Value', field: 'item' },
          { title: 'Country Of Origin', field: 'orig_country' },

          { title: 'Shipper', field: 'shipper' },
          { title: 'Shipper Address 1', field: 'shipper_address1' },
          { title: 'Shipper Address 2', field: 'shipper_address2' },
          { title: 'Shipper Address 3', field: 'shipper_address3' },
          { title: 'Shipper City', field: 'shipper_city' },
          { title: 'Shipper County/State', field: 'shipper_county' },
          { title: 'Shipper Zip', field: 'shipper_zip' },
          { title: 'Shipper Country Code', field: 'shipper_countrycode' }
        ]}

        data={order_rows}

        options={{
          actionsColumnIndex: -1,
          // paging: true,
          pageSize: 500,
          pageSizeOptions: [500,1000,2000, 6000],
          paginationPosition:'both',
          selection: true,
          selectionProps: rowData => ({
            checked: rowData.is_selected,
          }),
          // showSelectAllCheckbox: true,
          headerStyle: {
            backgroundColor: 'transperant',
            color: '#23263d'
          },
          rowStyle: rowData => ({
            backgroundColor: rowData.row_color //rowData.has_err ? '#FFD700':'#EEE'
          })
        }}  
        
        onSelectionChange={(evt, rowData) => {
          // console.log(evt)
          // console.log(rowData)
          handleCheckboxClick(rowData, evt);
         }}
      />
      }       
    </>
    
  );
}

export default withSnackbar(OrderImporter);

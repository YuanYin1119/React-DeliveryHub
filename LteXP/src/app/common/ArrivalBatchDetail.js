import React, {useState, useEffect,useContext} from 'react';
import { Card, Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {withSnackbar} from 'notistack'
import { AuthContext } from "../App"
import { useParams, useHistory, useLocation} from 'react-router-dom'
import MaterialTable from 'material-table'
import {useSnackbar} from 'notistack'
// import {getArrivalbatchByID} from '../store/actions/oper'
import {getArrivedParcelList} from '../store/actions/oper'
import {scanedParcel} from '../store/actions/oper'
import Commonhelper from '../helper/Commonhelper'
import Loader from "./Loader";
import A from "../../sounds/A.wav";
import B from "../../sounds/B.wav";
import C from "../../sounds/C.wav";
import D from "../../sounds/D.wav";
import E from "../../sounds/E.wav";
import F from "../../sounds/F.wav";
import G from "../../sounds/G.wav";
import H from "../../sounds/H.wav";
import I from "../../sounds/I.wav";
import J from "../../sounds/J.wav";
import K from "../../sounds/K.wav";
import L from "../../sounds/L.wav";
import M from "../../sounds/M.wav";
import N from "../../sounds/N.wav";
import O from "../../sounds/O.wav";
import P from "../../sounds/P.wav";
import Q from "../../sounds/Q.wav";
import R from "../../sounds/R.wav";
import S from "../../sounds/S.wav";
import T from "../../sounds/T.wav";
import U from "../../sounds/U.wav";
import V from "../../sounds/V.wav";
import W from "../../sounds/W.wav";
import X from "../../sounds/X.wav";
import Y from "../../sounds/Y.wav";
import Z from "../../sounds/Z.wav";
import zero from "../../sounds/0.wav";
import notfound from "../../sounds/notfound.m4a";
import scanned from "../../sounds/scanned.m4a";


import TextSearch from './TextSearch';

const ArrivalBatchDetail = (props) => {
  let history = useHistory()
  const location = useLocation();
  let {state, dispatch} = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar();

  const audio_map = {'A':A, 'B':B, 'C':C, 'D':D, 'E':E, 'F':F, 'G':G, 'H':H, 'I': I, 'J':J, 'K':K, 'L':L, 'M':M,
                     'N':N, 'O':O, 'P':P, 'Q':Q, 'R':R, 'S':S, 'T':T, 'U':U, 'V':V, 'W':W, 'X':X, 'Y':Y, 'Z':Z};
  const [input_trackingorder, setInputTrackingOrder] = useState('');
  const [loading, setLoading] = useState('');

  const [unscanedParcels, setUnscanedParcels] = useState([]);
  const [matchedlist, setMatchedlist] = useState([]);
  const param_id  = useParams();
  const [warehouse, setWarehouse] = useState('');
  const [enable_input, setEnableInput] = useState(true);
  const [errormsg, setErrormsg] = useState('');

  useEffect(() => {
  // if(!props.location.state) {
  //   getArrivalbatchByID(state.token,  ).then(({data}) =>{
  //       let ret =    
  //       {
  //           id: 'w1',
  //           warehouse: 'XXXXXXYYY',
  //       };

  //       setWarehouse(ret.warehouse);
  //   }).catch(err => {
  //     console.log('err', err)
  //   })
  //  }   

   getArrivedParcelList(state.token,state.userId, param_id.id).then(({data}) =>{
    //  console.log(data)
     setUnscanedParcels(data["New"]);
     setMatchedlist(data[param_id.id]?data[param_id.id]:[]);

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
   

  const handlekeyPress = (e) => {
  //  console.log(e)
    setErrormsg('')
    setInputTrackingOrder(e.value['value'])
    if(e.keyval===13) {
      setEnableInput(false)

      if(matchedlist) {
        let obj2 = matchedlist.find(o => o.trackingNumber === e.value['value']);
        if(obj2) { 
          // alert("Order for tracking number " +  obj2.trackingNumber + ' cannot be scanned as the state is not new or failed');
          const Audioobj = new Audio(scanned);
          if(Audioobj) {
            Audioobj.play();
          }

          setErrormsg("already scanned")
          setEnableInput(true)
          // setInputTrackingOrder('')
          return;
        }
      }


    let obj = unscanedParcels.find(o => o.trackingNumber ===e.value['value']);
    if(obj) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
      localISOTime = localISOTime.substr(0,10)+' '+localISOTime.substr(11,8);
      // do insert
      scanedParcel(state.token, { arrivalBatchCode: param_id.id, trackingNumber:obj.trackingNumber, scanedTime:localISOTime, operationTime:localISOTime }).then(({data}) =>{
        // console.log(data);
        const newFirstElement =  [{
          trackingNumber: obj.trackingNumber,
          zoneCode:obj.zoneCode,
          scanedDateTime:localISOTime
        }]

        
// console.log(newFirstElement)
        const newArray = newFirstElement.concat(matchedlist)
        // console.log(obj)
        setMatchedlist(newArray)
        // console.log('to be playing')
        console.log(obj.zoneCode)
        if(obj.zoneCode ) {
          setErrormsg(obj.zoneCode)
          if(obj.zoneCode.length===1 && obj.zoneCode.toUpperCase().match(/[A-Z]/i) ) {
            const Audioobj = new Audio(audio_map[obj.zoneCode.toUpperCase()]);
            if(Audioobj) {
              Audioobj.play();
            }
          } else if(obj.zoneCode==='0'){
            const Audioobj = new Audio(zero);
            if(Audioobj) {
              Audioobj.play();
            }
          }

      }else{
        enqueueSnackbar('Zone code not found',{variant:"warning"});
      }

    }).catch(err => {
      console.log('err', err.message)
      if(err.response && err.response.data ) {
        check_logout(Commonhelper.geterrorcode(err.response.data));
        enqueueSnackbar("Error:"+Commonhelper.geterrorcode(err.response.data)+' '+Commonhelper.geterrormsg(err.response.data),{variant:"warning"});
      }else{
        enqueueSnackbar('Something went wrong',{variant:"warning"});
      }
 
    })
      
      setEnableInput(true)
    }else{
      // alert('not found');
      const Audioobj = new Audio(notfound);
      if(Audioobj) {
        Audioobj.play();
      }
      setErrormsg("not found")
      setEnableInput(true)
    }
    // console.log(e.tartget)
      //setInputTrackingOrder('')
    }

  }

  const handleConfirm = () => {
      // console.log('handleConfirm');
      if(state.isAdmin) {
        // history.push("/admin/arrivalbatchmanagement?search_arrivalbatch="+location.state.search_arrivalbatch+"&search_location="+location.state.search_location
        // +"&search_startdt="+location.state.search_startdt+"&search_enddt="+location.state.search_enddt)
        history.goBack(-1)
      }else{
        //history.push("/")
        history.goBack(-1)
      }
  }

  if (loading) return <Loader />;
  return (
    <>
      <h2>Scan</h2>
     <Card>
        <div className="row search-report">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-0">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-8 mb-0">
              <Typography variant="overline" gutterBottom>Arrival Batch:</Typography>
            </div>
            
          </div>
    
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-10 mb-0">
                <Typography variant="overline" gutterBottom>{param_id?param_id.id:''}</Typography>
            </div>
          </div>
        </div>

        <div className="row search-report">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-0">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-8 mb-0">
              <Typography variant="overline" gutterBottom>User:</Typography>
            </div>
            
          </div>
    
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-0">
                <Typography variant="overline" gutterBottom>{state.userName}</Typography>
            </div>
          </div>
        </div>

        {/* <div className="row search-report">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-0">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-8 mb-0">
              <Typography variant="overline" gutterBottom>Warehouse:</Typography>
            </div>
            
          </div>
    
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-0">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-0">
                <Typography variant="overline" gutterBottom>{props.location.state?props.location.state.location_id:warehouse}</Typography>
            </div>
          </div>
        </div> */}

        <div className="row search-report">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-0">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-8 mb-0">
              <Typography variant="overline" gutterBottom>Tracking Order:</Typography>
            </div>
           </div>

           <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-6 mb-0">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-12 mb-0">
            <TextSearch id="standard-start-adornment" disabled={ !enable_input} name="input_trackingorder" variant="outlined" value={input_trackingorder} clearErrMsg={setErrormsg} onKeyDown={handlekeyPress} onChange={(e)=>setInputTrackingOrder(e.target.value)}/>
           
            <Typography style={{color:"red"}} variant="h3" gutterBottom>{errormsg}</Typography>
            {/* <Typography style={{ color:"red"}} variant="h3" gutterBottom>ERROR!</Typography> */}
            </div>
          </div>

        </div>

    </Card>

        <Card>
        <Button variant="contained"  color="primary"  onClick={handleConfirm}>Back</Button>
        <MaterialTable
        title='Scanned Orders'
        columns={[
          { title: 'Tracking Number', field: 'trackingNumber' },
          { title: 'Zone', field: 'zoneCode' },
          { title: 'Scanned Date', field: 'scanedDateTime' },
        ]}

        data={matchedlist}
        options={{
          actionsColumnIndex: -1,
          paging: false,
          // pageSize:100,
          // toolbar: false,
          headerStyle: {
            backgroundColor: 'transperant',
            color: '#23263d'
          },
          rowStyle: rowData => ({
            backgroundColor: (rowData.tableData.id===0) ? '#19d895' : '#FFF'
          })
        }}
      />

    </Card>
   
    </>
    
  );
}

export default withSnackbar(ArrivalBatchDetail);

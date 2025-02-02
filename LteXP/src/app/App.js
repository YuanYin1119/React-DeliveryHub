import React from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AdminRoutes from './routers/AdminRoutes';
import LoginRoutes from './routers/LoginRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import OperatorNavBar from './oper/OperatorNavBar';
import OperatorSideBar from './oper/OperatorSideBar';
import { SnackbarProvider } from 'notistack';
import Routers from './routers/Routers';

export const AuthContext = React.createContext();


function App()  {
  // const history = useHistory()

  React.useEffect(() => {

    const user = JSON.parse(localStorage.getItem('user') || null) 
    const token = JSON.parse(localStorage.getItem('token') || null)
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin') || null)
    const isClinic = JSON.parse(localStorage.getItem('isClinic') || null)
    const isOnline = JSON.parse(localStorage.getItem('isOnline') || null);
    const userName = JSON.parse(localStorage.getItem('userName') || null);
  
    if(token){
      dispatch({
        type: 'LOGIN',
        userName:userName,
        payload: {
          token:token,
          isAdmin:isAdmin,
          isClinic:isClinic,
          isOnline: isOnline,
          data:{
            ...user,
            userName:userName
          }
        }
      })
    }
    
  }, [])
  
  const initialState = {
    isAuthenticated: false,
    user: null,
    userId: null,
    userName: null,
    token: null,
    isAdmin:null,
    isOnline: true
  };


  const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        localStorage.setItem("user", JSON.stringify(action.payload.data));
        localStorage.setItem("userId", JSON.stringify(action.payload.data.userId));
        localStorage.setItem("userName", JSON.stringify(action.userName));
        localStorage.setItem("token", JSON.stringify(action.payload.data.token));
        localStorage.setItem("isAdmin", JSON.stringify(action.payload.data.role==='admin'?true:false));
        localStorage.setItem("isClinic", JSON.stringify(action.payload.data.role==='operator'?true:false));
        localStorage.setItem("isOnline", true);

        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.data,
          userId: action.payload.data.userId,
          userName: action.userName,
          token: action.payload.data.token,
          isAdmin: action.payload.data.role==='admin'?true:false,
          isClinic: action.payload.data.role==='operator'?true:false,
          isOnline: true
        };
      case "LOGOUT":
        localStorage.clear();
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          userId: null,
          userName: null,
          isAdmin:null,
          isClinic:null,
          isOnline: null
        };
      case "ONLINE":
        localStorage.setItem("isOnline", true);
        return {
          ...state,
          isOnline: true
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  today = yyyy+mm+dd;
//console.log(parseInt(today,10))

    if(parseInt(today,10)<20211227 && state.isAuthenticated && state.isAdmin){
      //console.log(state)
      return (
        <AuthContext.Provider value={{state, dispatch}}>
          <div>
            <AdminDashBoard isAdmin={state.isAdmin} />
          </div>
        </AuthContext.Provider>
      )
      }else if(parseInt(today,10)<20211227 && state.isAuthenticated && state.isClinic){
        return (
            <AuthContext.Provider value={{state, dispatch}}>
              <div>
                <OperatorDashboard isClinic={state.isClinic} />
              </div>
            </AuthContext.Provider>
      
        )
      }else{
        return (
          <AuthContext.Provider value={{state, dispatch}}>
            <div>
              <LoginRoutes />
            </div>
          </AuthContext.Provider>
        )
      }
}

function AdminDashBoard(props) {
  return (
    <SnackbarProvider>
      <div className="container-scroller">
       <Navbar/>
        <div className="container-fluid page-body-wrapper">
          <Sidebar isAdmin={props.isAdmin}/>
          <div className="main-panel">
            <div className="content-wrapper">
              <AdminRoutes isAdmin={props.isAdmin}/>
            </div>
         </div>
        </div>
      </div>
    </SnackbarProvider>
  )
}
function OperatorDashboard(props)  {
  return (
    <SnackbarProvider>
      <div className="container-scroller">
        <OperatorNavBar/>
        <div className="container-fluid page-body-wrapper">
          <OperatorSideBar/>
          <div className="main-panel">
            <div className="content-wrapper">
              <Routers />
            </div>
          </div>
        </div>
      </div>
    </SnackbarProvider>

  )
}


export default withRouter(App);
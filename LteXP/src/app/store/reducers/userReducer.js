import { LOGIN, LOGOUT, CHECKTOKEN } from "../actions/type"

let INTIAL_STATE={
  isLogin:false,
  user:{},
}

export default (state = INTIAL_STATE, action) =>{
  switch(action.type){
    case LOGIN:
      return {...state, isLogin:true, user:action.payload}

    // case CHECKTOKEN:
    //   return {...state, isLogin:action.payload}

    case LOGOUT:
      return {...state, isLogin:false} 
    
    default:
      return state
  }
}
import {combineReducers} from 'redux'
import defaultReducer from './defaultReducers'
import {connectRouter} from 'connected-react-router'
import UserReducer from './userReducer'
export default (history)=> combineReducers({
  router: connectRouter(history),
  default: defaultReducer,
  user:UserReducer,
})

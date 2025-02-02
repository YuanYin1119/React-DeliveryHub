import {LOGIN} from './type'
import axios from '../axios'
import _ from 'lodash'
// import key from './key'


export const userLogin = (user, vm, dis_patch) =>{
  console.log(user);
  axios.post('/users/login', user, {
    headers:{
      // "x-api-key": key,
      "Content-Type":"application/json",
      "Accept": "*/*"
    }
  }).then((data) =>{
    console.log(data)
    vm.enqueueSnackbar('Login Successfully',{variant:"success"});
    dis_patch({
      payload:data,
      userName: user.userName,
      type:LOGIN
    })
    
  }, (error) => {
    console.log(error.response.data);
    vm.enqueueSnackbar(error.response.data.message,{variant:"warning"});
  }).catch(err => {
    console.log(err.response)
    vm.enqueueSnackbar('Something went wrong',{variant:"warning"});
  })
}

export const clinicChangePassword = async (user, token) =>{
  return await axios.post('clinic/changepassword', user, {
    headers:{
      // "x-api-key": key,
      "Authorization": token
    }
  })
}

export const adminChangePassword = async (user, token) =>{
  return await axios.post('changepassword', user, {
    headers:{
      // "x-api-key": key,
      "Authorization": token
    }
  })
}

export const otpVerification = async (data, token) =>{
  return await axios.post('asdas', data, {
    headers:{
      // "x-api-key": key,
      "Authorization": token
    }
  })
}


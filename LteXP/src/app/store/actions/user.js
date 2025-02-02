import axios from './../axios'
// import key from './key'

export const changeForgotPassword = async (data) =>{
  return await axios.post(`/${data.loginAs}/verifyotp`, {...data},{
    headers:{
      // "x-api-key": key,
    }
  })
}

export const submitEmailForUserPassword = async (data) =>{
  return await axios.post(`/${data.loginAs}/sendotp`, {...data},{
    headers:{
      // "x-api-key": key,
    }
  })
}

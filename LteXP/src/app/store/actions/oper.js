import axios from './../axios'
// import key from './key'

export const addNewArrivalBatch = async (token, params) =>{
  console.log(params)
  return await axios.post('/orders/arrivalbatch', params, {
    headers:{
      "Authorization": token,
    }
  }) 
}

export const addConfirmedTrackingOrders = async (resisterForm) =>{

  await new Promise(resolve => setTimeout(resolve, 3000))
  return true;
}

export const getUnfinishedArrivalBatchs = async () =>{
  // return await axios.get('/provincelist', {
  //   headers:{
  //     "x-api-key": key,
  //   }
  // })

  return true;

}

export const getFilteredArrivalBatchs = async (token, params) =>{
  // console.log('getFilteredArrivalBatchs')
  // console.log(token)
  return await axios.post('/orders/arrivalbatchs',params, {
    headers:{
      "Authorization": token,
    }
  })

}


export const getWareHouseList = async (token, userId) =>{
  return await axios.get('orders/warehouses', {
    headers:{
      "Authorization":token, 
    }
  })
}

// export const getOrdersByArrivalBatchID = async () =>{
//   return await axios.get('/provincelist', {
//     headers:{
//       "x-api-key": key,
//     }
//   })

// }


export const getArrivalbatchByID = async (token, arrivalbatchcode) =>{


  return true;
 
}

export const getArrivedParcelList = async (token, userId, arrivalBatch ) =>{

  return await axios.get('/orders/arrivalbatch?arrivalBatchCode='+arrivalBatch, {
    headers:{
      "Authorization": token,
    }
  })

}


export const scanedParcel = async (token, data ) =>{
  // console.log(data)
  return await axios.post('/orders/order', data, {
    headers:{
      "Authorization": token,
    }
  })

}






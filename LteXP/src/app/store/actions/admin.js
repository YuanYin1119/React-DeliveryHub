import axios from './../axios'
// import key from './key'

export const getDashboardSummary_today = async (token) =>{
  // console.log(token)
  return await axios.get('/orders/dashboard?range=1', {
    headers:{
      "Authorization": token,
    }
  })
}

export const getDashboardSummary_monthly = async (token) =>{
    return await axios.get('/orders/dashboard?range=2', {
      headers:{
        "Authorization": token,
      }
    })
 
  }
 
  export const getDashboardSummary_yearly = async (token) =>{
    return await axios.get('/orders/dashboard?range=3', {
      headers:{
        "Authorization": token,
      }
    })

  }
  
  export const getOrderStatusList = async (token) =>{
    return await axios.get('/orders/status', {
      headers:{
        "Authorization": token,
      }
    })

  }

  export const getTrackingOrdersbySearch = async (token,savedCriterias) =>{
    // console.log(savedCriterias)
    return await axios.post('/orders/admin/orders', savedCriterias, {
      headers:{
        "Authorization": token,
      }
    })

  }

  export const deliveryOverviewAPI = async (token, params) =>{
    // deliveryOverview
    // console.log(params)
    return await axios.post('/orders/deliveryoverview', params, {
      headers:{
        "Authorization": token,
      }
    })
  }


  export const routePlanning = async (token, params) =>{
    // routePlanning
    // console.log(params)
    return await axios.post('/orders/routeplan',params, {
      headers:{
        "Authorization": token,
      }
    })

  }

  export const deliveryBatchList = async (token, params) =>{
    // deliveryBatchList
    // console.log(params)
    return await axios.post('/orders/deliverybatchs',params, {
      headers:{
        "Authorization": token,
      }
    })

  }


  export const groupOfParcels = async (token, deliveryBatchID) =>{
    return await axios.get('/orders/deliverybatch?deliveryBatchCode='+deliveryBatchID, {
      headers:{
        "Authorization": token,
      }
    })
  }

  export const getParcelDetails = async (token, orderID) =>{
    return await axios.get('/orders/admin/order?trackingNumber='+orderID, {
      headers:{
        "Authorization": token,
      }
    })
  }

  export const getParcelTracking = async (token, orderID) =>{
    return await axios.get('/orders/ordertracking?trackingNumber='+orderID, {
      headers:{
        "Authorization": token,
      }
    })
  }


  export const Driverlist = async (token) =>{
    // orders/drivers
    return await axios.get('/orders/drivers', {
      headers:{
        "Authorization": token,
      }
    })
  }

  export const DriverlistBySearch = async (token,params) =>{
    // drivers/drivers
    return await axios.post('/drivers/drivers',params, {
      headers:{
        "Authorization": token,
      }
    })
  }

  export const Driverupdate = async (token,params) =>{
    // drivers/drivers
    return await axios.post('drivers/driver',params, {
      headers:{
        "Authorization": token,
      }
    })
  }


  export const submitRoutePlanning = async (token, params) =>{
    // routePlanning
    // console.log(params)
    return await axios.post('/orders/deliverybatch',params, {
      headers:{
        "Authorization": token,
      }
    })

  }


  export const addOrdertoDeliveryBatch = async (token, params) =>{
    // routePlanning
    //console.log(params)
    return await axios.post('/orders/orderrouteplan',params, {
      headers:{
        "Authorization": token,
      }
    })

  }

  export const updateOrder = async (token, params) =>{
    // routePlanning
    // console.log(params)
    return await axios.post('/orders/admin/order',params, {
      headers:{
        "Authorization": token,
      }
    })

  }

  // not used yet
  export const ReasonList = async (token) =>{
    // orders/drivers
    return await axios.get('/orders/reason', {
      headers:{
        "Authorization": token,
      }
    })
  }

    export const ImportOrders = async (token, warehouse, params) =>{
      // /orders/ordersbatch?warehouseName=Markham165
      return await axios.post('/orders/ordersbatch?warehouseName='+warehouse,params, {
        headers:{
          "Authorization": token,
          // "Accept": 'application',
          "Content-Type": 'text/plain'
        },
      })
  
    }
  
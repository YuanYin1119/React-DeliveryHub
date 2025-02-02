import React, { Suspense, lazy } from 'react';
import { Switch, Route} from 'react-router-dom';
import OrderImporter from '../admin/OrderImporter';

// import { AuthContext } from "../App";
import Spinner from '../shared/Spinner';
// import PrivateRoute from './PrivateRoute';

const Dashboard = lazy(() => import('../admin/dashboard'));
const ArrivalBatchManagement = lazy(() => import('../common/ArrivalBatchManagement'));
const ArrivalBatchDetail = lazy(() => import('../common/ArrivalBatchDetail'));
const TrackingOrders = lazy(() => import('../admin/TrackingOrders'));
const TrackingOrderDetails = lazy(() => import('../admin/TrackingOrderDetails'));
const DeliveryOverview = lazy(() => import('../admin/DeliveryOverview'));
const DeliveryManagement = lazy(() => import('../admin/DeliveryManagement'));
const RoutePlanningOverview = lazy(() => import('../admin/RoutePlanningOverview'));
const BingmapDisplay = lazy(() => import('../common/BingmapDisplay'));
const OrderTracking = lazy(() => import('../admin/OrderTracking'));
const OrderHistory = lazy(() => import('../admin/OrderHistory'));
const DriverManagement = lazy(() => import('../admin/DriverManagement'));


const AdminRoutes = (props) => {
  // const history = useHistory();
  // const context = useContext(AuthContext)

    return ( 
      <Suspense fallback={<Spinner/>}>
        
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/dashboard" component={Dashboard}  />
            <Route exact path="/admin/arrivalbatchmanagement" component={ ArrivalBatchManagement }  />
            <Route exact path="/arrivalbatch/:id" component={ArrivalBatchDetail}  />
            <Route exact path="/admin/ordermanagement" component={TrackingOrders} />
            <Route exact path="/admin/orderdetails/:id" component={TrackingOrderDetails}  />
            <Route exact path="/admin/deliveryoverview" component={DeliveryOverview}  />
            <Route exact path="/admin/deliverymanagement" component={DeliveryManagement}  />
            <Route exact path="/admin/routeplanning/:status/:id" component={RoutePlanningOverview}  />
            <Route exact path="/admin/viewmap" component={BingmapDisplay}  />
            <Route exact path="/admin/ordertracking/:id" component={OrderTracking}  />
            <Route exact path="/admin/orderhistory/:id" component={OrderHistory}  />
            <Route exact path="/admin/drivers" component={DriverManagement}  />
            <Route exact path="/admin/importorders" component={OrderImporter}  />
          </Switch>
     
      </Suspense>
    );
}

export default AdminRoutes;

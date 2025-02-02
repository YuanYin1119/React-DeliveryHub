import React, { Suspense, lazy} from 'react';
import { Route, Switch } from 'react-router-dom';
import Spinner from '../shared/Spinner';

// import { AuthContext } from "../App"
// import {useHistory} from 'react-router-dom'

const ArrivalBatchManagement = lazy(() => import('../common/ArrivalBatchManagement'));
const ArrivalBatchDetail = lazy(() => import('../common/ArrivalBatchDetail'));


const Routers = (props) =>  {
  // let history = useHistory()
  // let context = useContext(AuthContext)

  return (
    <Suspense fallback={<Spinner/>}>
      <Switch>
        <Route exact path="/" component={ArrivalBatchManagement} />
        <Route exact path="/arrivalbatch/:id" component={ArrivalBatchDetail} />

      </Switch>
    </Suspense>
  );
}

export default Routers;
import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import Spinner from '../shared/Spinner';
import { SnackbarProvider } from 'notistack';

const AdminLogin = lazy(() => import('../login/AdminLogin'));
const AdminResetPwd = lazy(() => import('../login/AdminResetPwd'));
const ChangePassword = lazy(() => import('../login/ChangePassword'));

const LoginRoutes = (props) =>  {
  return (
    <Suspense fallback={<Spinner/>}>
      <SnackbarProvider>
        <Switch>
          <Route exact path="/" component={ AdminLogin } />
          <Route exact path="/dashboard" component={ AdminLogin } />
          <Route exact path="/admin/arrivalbatchmanagement" component={ AdminLogin } />
          <Route exact path="/admin/ordermanagement" component={ AdminLogin } />
          <Route exact path="/admin/orderdetails/:id" component={ AdminLogin } />
          <Route exact path="/admin/deliverymanagement" component={ AdminLogin } />
          <Route exact path="/admin/deliveryoverview" component={ AdminLogin } />
          <Route exact path="/admin/drivers" component={ AdminLogin } />
          <Route exact path="/admin/importorders" component={ AdminLogin } />
          <Route exact path="/arrivalbatch/:id" component={ AdminLogin } />
          <Route exact path="/admin/routeplanning/:status/:id" component={ AdminLogin } />
          <Route exact path="/admin/viewmap" component={ AdminLogin } />
          <Route exact path="/admin/ordertracking/:id" component={ AdminLogin } />
          <Route exact path="/admin/orderhistory/:id" component={ AdminLogin } />
          <Route exact path="/admin-reset-pwd" component={ AdminResetPwd } />
          <Route exact path="/change_password" component={ ChangePassword } />
        </Switch>
      </SnackbarProvider>
    </Suspense>
  );
}

export default LoginRoutes;
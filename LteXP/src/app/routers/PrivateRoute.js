// This is used to determine if a user is authenticated and

// if they are allowed to visit the page they navigated to.

 

// If they are: they proceed to the page

// If not: they are redirected to the login page.

import React from 'react'

import { Redirect, Route } from 'react-router-dom'


const PrivateRoute = ({ component: Component, ...rest }) => {

 

  // Add your own authentication on the below line.

  const isLoggedIn = false

 

  return (

    <Route

      {...rest}

      render={props =>

        isLoggedIn ? (

          <Component {...props} />

        ) : (

          <Redirect to={{ pathname: '/', state: { from: props.location } }} />

        )

      }

    />

  )

}

 

export default PrivateRoute
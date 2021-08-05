import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import IndexPage from './IndexPage';
import { useAuth0 } from '@auth0/auth0-react'
import Profile from '../components/Profile'
import ProfilePage from './ProfilePage'
import ProtectedRoute from '../auth/ProtectedRoute'
import Loading from '../auth/Loading'

export default function MainRouter() {
  
  // const { isLoading } = useAuth0();
  //
  // console.log(useAuth0())
  //
  // console.log(isLoading)
  //
  // if (isLoading) {
  //   return (<p>This page is loading!</p>)
  // }
  
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={'/'} component={IndexPage} />
        <Route exact path={'/loading'} component={Loading} />
        <ProtectedRoute path="/profile" component={ProfilePage} />

        {/* Default path if nothing matches */}
        <Route path={'/'} component={IndexPage} />
      </Switch>
    </BrowserRouter>
  );
}

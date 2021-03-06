import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import IndexPage from './IndexPage';
import ProfilePage from './ProfilePage';
import ProtectedRoute from '../auth/ProtectedRoute';
import Loading from '../auth/Loading';
import OnboardingPage from './OnboardingPage';
import CreateAccountPage from './CreateAccountPage';

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={'/'} component={IndexPage} />
        <Route exact path={'/loading'} component={Loading} />
        <ProtectedRoute path={'/profile'} component={ProfilePage} />
        <Route exact path={'/start'} component={CreateAccountPage} />
        <Route exact path={'/onboarding'} component={OnboardingPage} />

        {/* Default path if nothing matches */}
        <Route path={'/'} component={IndexPage} />
      </Switch>
    </BrowserRouter>
  );
}

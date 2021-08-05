import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import IndexPage from './IndexPage';
import OnboardingPage from './OnboardingPage';
import CreateAccountPage from './CreateAccountPage';

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={'/'} component={IndexPage} />
        <Route exact path={'/start'} component={CreateAccountPage} />
        <Route exact path={'/onboarding'} component={OnboardingPage} />

        {/* Default path if nothing matches */}
        <Route path={'/'} component={IndexPage} />
      </Switch>
    </BrowserRouter>
  );
}

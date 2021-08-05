import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './styles/style.scss';
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory'

ReactDOM.render(
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
  </BrowserRouter>,
  document.getElementById('root'));

import React from 'react';

import Dashboard from './components/Dashboard/Dashboard';

import { SystemInfoProvider } from './contexts/systemInfo';

import './App.global.css';

const App = () => (
  <SystemInfoProvider>
    <Dashboard />
  </SystemInfoProvider>
);

export default App;
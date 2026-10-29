import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TransportationProvider } from './context/TransportationContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TransportationProvider>
        <AppRoutes />
      </TransportationProvider>
    </BrowserRouter>
  );
};

export default App;


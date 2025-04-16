import React from 'react';
import { Outlet } from 'react-router-dom';
import ProviderBottomNavigation from './ProviderBottomNavigation';

const ProviderLayout = () => {
  return (
    <div className="app-container min-h-screen bg-white dark:bg-secondary-900">
      <main className="pb-24">
        <Outlet />
      </main>
      <ProviderBottomNavigation />
    </div>
  );
};

export default ProviderLayout;
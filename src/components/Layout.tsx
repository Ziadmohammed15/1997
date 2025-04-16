import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  userType: 'client' | 'provider' | null;
}

const Layout: React.FC<LayoutProps> = ({ userType }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <div className="max-w-md mx-auto relative pb-20">
        <main>
          <Outlet />
        </main>
        <BottomNavigation userType={userType} />
      </div>
    </div>
  );
};

export default Layout;
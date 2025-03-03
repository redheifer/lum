import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingHelpButton from './FloatingHelpButton';

const Layout = () => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <FloatingHelpButton />
    </div>
  );
};

export default Layout; 
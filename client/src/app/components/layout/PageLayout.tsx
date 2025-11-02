import React from 'react';
import { Header } from './Header';
import { SideBar } from './SideBar';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      
      <div className="flex-1" style={{ marginLeft: 'var(--sidebar-width, 16rem)', transition: 'margin-left 300ms' }}>
        <Header />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

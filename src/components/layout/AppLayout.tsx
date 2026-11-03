import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NavView } from '../../types/navigation';

export interface AppLayoutProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  lastSynced: string;
  reviewCount: number;
  businessCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSync,
  isSyncing,
  lastSynced,
  reviewCount,
  businessCount,
  theme,
  onToggleTheme,
  children,
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        reviewCount={reviewCount}
        businessCount={businessCount}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Main View Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSync={onSync}
          isSyncing={isSyncing}
          lastSynced={lastSynced}
        />

        <main className="flex-1 overflow-y-auto p-8 bg-surface-subtle/40">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};


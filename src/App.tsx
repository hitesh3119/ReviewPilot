import React, { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewView } from './features/overview/OverviewView';
import { BusinessesView } from './features/businesses/BusinessesView';
import { ReviewsView } from './features/reviews/ReviewsView';
import { AnalyticsView } from './features/analytics/AnalyticsView';
import { ExportsView } from './features/exports/ExportsView';
import { SettingsView } from './features/settings/SettingsView';
import { ReviewDetailDrawer } from './features/reviews/ReviewDetailDrawer';
import { AddBusinessModal } from './features/businesses/AddBusinessModal';
import {
  MOCK_BUSINESSES,
  MOCK_REVIEWS,
  MOCK_EXPORT_JOBS,
} from './mock/mockData';
import { BusinessLocation } from './types/business';
import { Review } from './types/review';
import { ExportJob } from './types/export';
import { NavView } from './types/navigation';
import { loadSettings, saveSettings, AppSettings } from './lib/storage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavView>('overview');
  const [businesses, setBusinesses] = useState<BusinessLocation[]>(MOCK_BUSINESSES);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [exportHistory, setExportHistory] = useState<ExportJob[]>(MOCK_EXPORT_JOBS);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [selectedBusinessFilter, setSelectedBusinessFilter] = useState<string>('all');
  const [inspectingReview, setInspectingReview] = useState<Review | null>(null);
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize dark theme class with DOM
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings(settings);
  }, [settings]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement).tagName
        )
      ) {
        return;
      }

      if (e.key === '1') setCurrentView('overview');
      if (e.key === '2') setCurrentView('businesses');
      if (e.key === '3') setCurrentView('reviews');
      if (e.key === '4') setCurrentView('analytics');
      if (e.key === '5') setCurrentView('exports');
      if (e.key === '6') setCurrentView('settings');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const handleUpdateSettings = (updated: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updated };
      saveSettings(next);
      return next;
    });
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  const handleAddBusiness = (newBiz: BusinessLocation) => {
    setBusinesses((prev) => [newBiz, ...prev]);
  };

  const handleSelectBusinessReviews = (bizId: string) => {
    setSelectedBusinessFilter(bizId);
    setCurrentView('reviews');
  };

  const handleAddExportJob = (job: ExportJob) => {
    setExportHistory((prev) => [job, ...prev]);
  };

  return (
    <>
      <AppLayout
        currentView={currentView}
        onNavigate={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSync={handleSync}
        isSyncing={isSyncing}
        lastSynced="2026-11-03T09:00:00Z"
        reviewCount={reviews.length}
        businessCount={businesses.length}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
      >
        {currentView === 'overview' && (
          <OverviewView
            onNavigate={setCurrentView}
            onOpenReviewDetail={setInspectingReview}
            onOpenAddBusiness={() => setIsAddBusinessOpen(true)}
            onSync={handleSync}
            isSyncing={isSyncing}
          />
        )}

        {currentView === 'businesses' && (
          <BusinessesView
            businesses={businesses}
            onOpenAddBusiness={() => setIsAddBusinessOpen(true)}
            onSelectBusinessReviews={handleSelectBusinessReviews}
          />
        )}

        {currentView === 'reviews' && (
          <ReviewsView
            reviews={reviews}
            businesses={businesses}
            onOpenReviewDetail={setInspectingReview}
            selectedBusinessFilter={selectedBusinessFilter}
            onClearBusinessFilter={() => setSelectedBusinessFilter('all')}
          />
        )}

        {currentView === 'analytics' && <AnalyticsView />}

        {currentView === 'exports' && (
          <ExportsView
            reviews={reviews}
            businesses={businesses}
            exportHistory={exportHistory}
            onAddExportJob={handleAddExportJob}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            businessCount={businesses.length}
            reviewCount={reviews.length}
          />
        )}
      </AppLayout>

      {/* Slide-in Review Detail Drawer */}
      <ReviewDetailDrawer
        review={inspectingReview}
        isOpen={inspectingReview !== null}
        onClose={() => setInspectingReview(null)}
      />

      {/* Add Business Location Modal */}
      <AddBusinessModal
        isOpen={isAddBusinessOpen}
        onClose={() => setIsAddBusinessOpen(false)}
        onAddBusiness={handleAddBusiness}
      />
    </>
  );
};

export default App;


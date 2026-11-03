import React from 'react';
import { RefreshCw, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NavView } from '../../types/navigation';

export interface HeaderProps {
  currentView: NavView;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  lastSynced: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  onSync,
  isSyncing,
}) => {
  const titles: Record<NavView, { title: string; subtitle: string }> = {
    overview: {
      title: 'Intelligence Overview',
      subtitle: 'Real-time performance, sentiment distribution, and review activity.',
    },
    businesses: {
      title: 'Managed Businesses',
      subtitle: 'Google Business Profile locations and verified Places listings.',
    },
    reviews: {
      title: 'Review Explorer',
      subtitle: 'Search, filter, and inspect customer reviews and owner responses.',
    },
    analytics: {
      title: 'Analytics & Trends',
      subtitle: 'Rating trajectories, keyword sentiment extraction, and growth velocity.',
    },
    exports: {
      title: 'Export Center',
      subtitle: 'Generate formatted CSV, XLSX, and JSON datasets for downstream systems.',
    },
    settings: {
      title: 'Application Settings',
      subtitle: 'Local-first database configuration, appearance, and API credentials.',
    },
  };

  const { title, subtitle } = titles[currentView] || titles.overview;

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md px-8 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Title & View Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm font-semibold text-foreground tracking-tight">
            {title}
          </h1>
          <Badge variant="indigo" size="sm" className="font-mono">
            MOCK DATA
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground hidden sm:block">
          {subtitle}
        </p>
      </div>

      {/* Action and Search Controls */}
      <div className="flex items-center gap-3">
        {/* Global Quick Search */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Quick search reviews, businesses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 pl-8 pr-12 text-xs rounded-md border border-input bg-surface-subtle text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <kbd className="absolute right-2 top-1.5 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground bg-surface-highlight border border-border rounded">
            /
          </kbd>
        </div>

        {/* Sync Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">GBP Connected</span>
        </div>

        {/* Sync Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onSync}
          isLoading={isSyncing}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {isSyncing ? 'Syncing...' : 'Sync Locations'}
        </Button>

        {/* Pro Action button */}
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={() => alert('Phase 1 Notice: ReviewPilot Phase 1 is in typed mock verification mode.')}
        >
          Phase 1 Active
        </Button>
      </div>
    </header>
  );
};


import React from 'react';
import {
  LayoutDashboard,
  Building2,
  MessageSquareQuote,
  BarChart3,
  Download,
  Settings,
  Database,
  Compass,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { NavView } from '../../types/navigation';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  reviewCount: number;
  businessCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  reviewCount,
  businessCount,
  theme,
  onToggleTheme,
}) => {
  const navItems = [
    {
      id: 'overview' as NavView,
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'businesses' as NavView,
      label: 'Businesses',
      icon: <Building2 className="w-4 h-4" />,
      badge: businessCount,
    },
    {
      id: 'reviews' as NavView,
      label: 'Reviews',
      icon: <MessageSquareQuote className="w-4 h-4" />,
      badge: reviewCount,
    },
    {
      id: 'analytics' as NavView,
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'exports' as NavView,
      label: 'Exports',
      icon: <Download className="w-4 h-4" />,
    },
    {
      id: 'settings' as NavView,
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col justify-between select-none">
      {/* Top Branding Section */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2.5 px-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-foreground">
                ReviewPilot
              </span>
              <span className="rounded bg-primary/10 px-1 py-0.2 text-[9px] font-mono font-medium text-primary">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Reviews Intelligence
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={`Navigate to ${item.label}`}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-surface-highlight hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-mono',
                      isActive
                        ? 'bg-primary text-white font-medium'
                        : 'bg-surface-highlight text-muted-foreground'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Database status & Theme switch */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Local Storage Indicator */}
        <div className="rounded-lg bg-surface-subtle border border-border p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>SQLite Engine</span>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-[10px] text-muted-foreground font-mono truncate">
            local_first: active
          </p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-0.5">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span>Authorized GBP & Places</span>
          </div>
        </div>

        {/* Bottom Bar: Theme toggle & Version */}
        <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
          <span className="font-mono text-[10px]">v1.0.0-phase1</span>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-surface-highlight hover:text-foreground transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};


import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem<T extends string | number> {
  id: T;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps<T extends string | number> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function Tabs<T extends string | number>({
  tabs,
  activeTab,
  onChange,
  className,
  size = 'md',
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-lg bg-surface-subtle border border-border/70 select-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={String(tab.id)}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-md',
              size === 'sm' ? 'px-2.5 py-1 text-xs gap-1.5' : 'px-3 py-1.5 text-xs font-medium gap-2',
              isActive
                ? 'bg-card text-foreground shadow-subtle border border-border/80 font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-highlight/50'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-tight',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-highlight text-muted-foreground'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


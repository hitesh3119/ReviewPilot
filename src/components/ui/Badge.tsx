import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'success'
    | 'warning'
    | 'danger'
    | 'indigo';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center font-medium transition-colors select-none';

  const variants = {
    default:
      'bg-primary/10 text-primary border border-primary/20',
    secondary:
      'bg-surface-highlight text-muted-foreground border border-border',
    outline:
      'bg-transparent text-foreground border border-border',
    success:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    indigo:
      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  };

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 rounded',
    md: 'text-xs px-2.5 py-0.5 rounded-full',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};


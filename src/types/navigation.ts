export type NavView =
  | 'overview'
  | 'businesses'
  | 'reviews'
  | 'analytics'
  | 'exports'
  | 'settings';

export interface NavItem {
  id: NavView;
  label: string;
  badge?: string | number;
}


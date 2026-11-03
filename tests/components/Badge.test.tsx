import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../src/components/ui/Badge';

describe('Badge Component', () => {
  it('renders badge children text', () => {
    render(<Badge>Verified</Badge>);
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('renders success variant with emerald styling', () => {
    render(<Badge variant="success">Positive</Badge>);
    const badge = screen.getByText('Positive');
    expect(badge).toHaveClass('text-emerald-600');
  });

  it('renders danger variant with rose styling', () => {
    render(<Badge variant="danger">Critical</Badge>);
    const badge = screen.getByText('Critical');
    expect(badge).toHaveClass('text-rose-600');
  });

  it('renders small size when specified', () => {
    render(<Badge size="sm">Small</Badge>);
    const badge = screen.getByText('Small');
    expect(badge).toHaveClass('text-[11px]');
  });
});


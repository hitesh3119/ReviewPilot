import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('Application Shell & Navigation Integration', () => {
  it('renders overview view by default', () => {
    render(<App />);
    expect(screen.getByText('Intelligence Overview')).toBeInTheDocument();
    expect(screen.getByText('Total Managed Businesses')).toBeInTheDocument();
    expect(screen.getByText('Global Average Rating')).toBeInTheDocument();
  });

  it('navigates to Businesses view when Businesses sidebar link is clicked', () => {
    render(<App />);
    const bizNav = screen.getByRole('button', { name: /navigate to businesses/i });
    fireEvent.click(bizNav);

    expect(screen.getByText('Managed Business Directory')).toBeInTheDocument();
    expect(screen.getByText('Apex Dental Care & Implant Center')).toBeInTheDocument();
  });

  it('navigates to Reviews view when Reviews sidebar link is clicked', () => {
    render(<App />);
    const reviewsNav = screen.getByRole('button', { name: /navigate to reviews/i });
    fireEvent.click(reviewsNav);

    expect(screen.getByText('Review Intelligence Explorer')).toBeInTheDocument();
  });

  it('navigates to Analytics view when Analytics sidebar link is clicked', () => {
    render(<App />);
    const analyticsNav = screen.getByRole('button', { name: /navigate to analytics/i });
    fireEvent.click(analyticsNav);

    expect(screen.getByText('Customer Intelligence & Sentiment Analytics')).toBeInTheDocument();
    expect(screen.getByText('Positive Sentiment')).toBeInTheDocument();
  });

  it('navigates to Exports view when Exports sidebar link is clicked', () => {
    render(<App />);
    const exportsNav = screen.getByRole('button', { name: /navigate to exports/i });
    fireEvent.click(exportsNav);

    expect(screen.getByText('Data Export Engine')).toBeInTheDocument();
    expect(screen.getByText('Configure Export Dataset')).toBeInTheDocument();
  });

  it('navigates to Settings view when Settings sidebar link is clicked', () => {
    render(<App />);
    const settingsNav = screen.getByRole('button', { name: /navigate to settings/i });
    fireEvent.click(settingsNav);

    expect(screen.getByText('System Settings & Local Configuration')).toBeInTheDocument();
    expect(screen.getByText('Local-First Storage Engine')).toBeInTheDocument();
  });
});


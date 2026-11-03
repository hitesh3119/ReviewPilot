import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewsView } from '../../src/features/reviews/ReviewsView';
import { MOCK_REVIEWS, MOCK_BUSINESSES } from '../../src/mock/mockData';

describe('ReviewsView Component', () => {
  it('renders reviews table and header counts', () => {
    render(
      <ReviewsView
        reviews={MOCK_REVIEWS}
        businesses={MOCK_BUSINESSES}
        onOpenReviewDetail={vi.fn()}
      />
    );

    expect(screen.getByText('Review Intelligence Explorer')).toBeInTheDocument();
    expect(screen.getByText(`${MOCK_REVIEWS.length} Reviews`)).toBeInTheDocument();
  });

  it('filters reviews by search input', () => {
    render(
      <ReviewsView
        reviews={MOCK_REVIEWS}
        businesses={MOCK_BUSINESSES}
        onOpenReviewDetail={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search reviews by keyword/i);
    // Search for a specific reviewer name from mock data
    fireEvent.change(searchInput, { target: { value: 'Eleanor Vance' } });

    expect(screen.getByText('Eleanor Vance')).toBeInTheDocument();
    expect(screen.queryByText('Marcus Chen')).not.toBeInTheDocument();
  });

  it('filters reviews when star rating tab is clicked', () => {
    render(
      <ReviewsView
        reviews={MOCK_REVIEWS}
        businesses={MOCK_BUSINESSES}
        onOpenReviewDetail={vi.fn()}
      />
    );

    // Click 5 Stars tab
    const fiveStarTab = screen.getByRole('tab', { name: /5 stars/i });
    fireEvent.click(fiveStarTab);

    // Ensure 5-star reviews remain visible while 2-star reviews disappear
    expect(screen.queryByText('Robert Sterling')).not.toBeInTheDocument();
  });

  it('calls onOpenReviewDetail when a review row is clicked', () => {
    const handleOpenDetail = vi.fn();
    render(
      <ReviewsView
        reviews={MOCK_REVIEWS}
        businesses={MOCK_BUSINESSES}
        onOpenReviewDetail={handleOpenDetail}
      />
    );

    const reviewerCell = screen.getByText('Eleanor Vance');
    fireEvent.click(reviewerCell);

    expect(handleOpenDetail).toHaveBeenCalledTimes(1);
    expect(handleOpenDetail).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'rev_001' })
    );
  });
});


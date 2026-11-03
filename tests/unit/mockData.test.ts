import { describe, it, expect } from 'vitest';
import {
  MOCK_BUSINESSES,
  MOCK_REVIEWS,
  MOCK_OVERVIEW_METRICS,
  MOCK_RATING_BREAKDOWN,
  MOCK_SENTIMENT_DISTRIBUTION,
} from '../../src/mock/mockData';

describe('Domain Data Integrity & Verification', () => {
  describe('Businesses Fixture', () => {
    it('has exactly 8 managed business locations', () => {
      expect(MOCK_BUSINESSES.length).toBe(8);
    });

    it('each business has unique ID and valid Place ID', () => {
      const ids = new Set(MOCK_BUSINESSES.map((b) => b.id));
      const placeIds = new Set(MOCK_BUSINESSES.map((b) => b.placeId));
      expect(ids.size).toBe(MOCK_BUSINESSES.length);
      expect(placeIds.size).toBe(MOCK_BUSINESSES.length);
    });

    it('all businesses have ratings between 1.0 and 5.0', () => {
      MOCK_BUSINESSES.forEach((b) => {
        expect(b.rating).toBeGreaterThanOrEqual(1.0);
        expect(b.rating).toBeLessThanOrEqual(5.0);
        expect(b.reviewCount).toBeGreaterThanOrEqual(0);
      });
    });

    it('all records are explicitly tagged as mock data', () => {
      MOCK_BUSINESSES.forEach((b) => {
        expect(b.isMock).toBe(true);
      });
    });
  });

  describe('Reviews Fixture', () => {
    it('contains valid customer reviews', () => {
      expect(MOCK_REVIEWS.length).toBeGreaterThanOrEqual(12);
    });

    it('every review points to an existing business location', () => {
      const validBizIds = new Set(MOCK_BUSINESSES.map((b) => b.id));
      MOCK_REVIEWS.forEach((r) => {
        expect(validBizIds.has(r.businessId)).toBe(true);
      });
    });

    it('all reviews have star ratings between 1 and 5', () => {
      MOCK_REVIEWS.forEach((r) => {
        expect([1, 2, 3, 4, 5]).toContain(r.rating);
        expect(['positive', 'neutral', 'critical']).toContain(r.sentiment);
        expect(r.text.length).toBeGreaterThan(10);
      });
    });

    it('positive reviews have 4 or 5 stars, critical reviews have 1 or 2 stars', () => {
      MOCK_REVIEWS.forEach((r) => {
        if (r.sentiment === 'positive') {
          expect(r.rating).toBeGreaterThanOrEqual(4);
        } else if (r.sentiment === 'critical') {
          expect(r.rating).toBeLessThanOrEqual(2);
        }
      });
    });
  });

  describe('Overview Metrics & Distributions', () => {
    it('rating breakdown percentages sum to ~100%', () => {
      const totalPct = MOCK_RATING_BREAKDOWN.reduce((acc, curr) => acc + curr.percentage, 0);
      expect(Math.round(totalPct)).toBe(100);
    });

    it('sentiment percentages sum to 100%', () => {
      const { positivePercentage, neutralPercentage, criticalPercentage } =
        MOCK_SENTIMENT_DISTRIBUTION;
      expect(Math.round(positivePercentage + neutralPercentage + criticalPercentage)).toBe(100);
    });

    it('overview metrics correctly aggregate businesses count', () => {
      expect(MOCK_OVERVIEW_METRICS.totalBusinesses).toBe(MOCK_BUSINESSES.length);
    });
  });
});


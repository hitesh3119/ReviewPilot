export interface RatingBreakdown {
  stars: 1 | 2 | 3 | 4 | 5;
  count: number;
  percentage: number;
}

export interface SentimentDistribution {
  positiveCount: number;
  positivePercentage: number;
  neutralCount: number;
  neutralPercentage: number;
  criticalCount: number;
  criticalPercentage: number;
}

export interface MonthlyReviewTrend {
  month: string;
  reviewCount: number;
  averageRating: number;
}

export interface KeywordTopic {
  id: string;
  topic: string;
  mentionCount: number;
  averageRating: number;
  sentiment: 'positive' | 'neutral' | 'critical';
}

export interface OverviewMetrics {
  totalBusinesses: number;
  availableReviews: number;
  averageRating: number;
  positivePercentage: number;
  monthlyGrowthRate: number;
  unansweredReviewsCount: number;
  lastSyncTimestamp: string;
}


export type ReviewSentiment = 'positive' | 'neutral' | 'critical';

export interface Reviewer {
  id: string;
  displayName: string;
  avatarUrl?: string;
  isLocalGuide?: boolean;
  totalReviewsCount?: number;
  profileUrl?: string;
}

export interface OwnerResponse {
  responseText: string;
  respondedAt: string;
  authorName: string;
}

export interface Review {
  id: string;
  businessId: string;
  businessName: string;
  reviewer: Reviewer;
  rating: number; // 1 to 5
  text: string;
  originalText?: string;
  language: string;
  publishedAt: string;
  relativeTime: string;
  sentiment: ReviewSentiment;
  ownerResponse?: OwnerResponse;
  photoUrls?: string[];
  likesCount: number;
  tags?: string[];
  isMock: boolean;
}

export type ReviewSortField = 'date' | 'rating' | 'likes';
export type SortOrder = 'asc' | 'desc';

export interface ReviewFilterState {
  searchQuery: string;
  selectedBusinessId: string;
  selectedRating: number | 'all';
  selectedSentiment: ReviewSentiment | 'all';
  hasOwnerResponse: boolean | 'all';
  sortBy: ReviewSortField;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}


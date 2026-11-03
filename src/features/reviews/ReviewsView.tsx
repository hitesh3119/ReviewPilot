import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Filter,
  Eye,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import { Review, ReviewSentiment } from '../../types/review';
import { BusinessLocation } from '../../types/business';
import { formatDate } from '../../lib/utils';

export interface ReviewsViewProps {
  reviews: Review[];
  businesses: BusinessLocation[];
  onOpenReviewDetail: (review: Review) => void;
  selectedBusinessFilter?: string;
  onClearBusinessFilter?: () => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews,
  businesses,
  onOpenReviewDetail,
  selectedBusinessFilter = 'all',
  onClearBusinessFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [activeBusinessId, setActiveBusinessId] = useState<string>(selectedBusinessFilter);
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'rating_desc' | 'rating_asc'>('date_desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        const matchesSearch =
          r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.reviewer.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.businessName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBusiness =
          activeBusinessId === 'all' || r.businessId === activeBusinessId;

        const matchesRating =
          selectedRating === 'all' || r.rating === parseInt(selectedRating, 10);

        const matchesSentiment =
          selectedSentiment === 'all' || r.sentiment === selectedSentiment;

        return matchesSearch && matchesBusiness && matchesRating && matchesSentiment;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        }
        if (sortBy === 'rating_desc') {
          return b.rating - a.rating;
        }
        if (sortBy === 'rating_asc') {
          return a.rating - b.rating;
        }
        return 0;
      });
  }, [reviews, searchQuery, activeBusinessId, selectedRating, selectedSentiment, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredReviews.length / pageSize) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage]);

  const starTabs = [
    { id: 'all', label: 'All Stars' },
    { id: '5', label: '5 Stars' },
    { id: '4', label: '4 Stars' },
    { id: '3', label: '3 Stars' },
    { id: '2', label: '2 Stars' },
    { id: '1', label: '1 Star' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Review Intelligence Explorer
            </h2>
            <Badge variant="secondary" size="sm">
              {filteredReviews.length} Reviews
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search customer experiences, inspect owner responses, and detect critical feedback.
          </p>
        </div>

        {activeBusinessId !== 'all' && onClearBusinessFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveBusinessId('all');
              onClearBusinessFilter();
            }}
          >
            Clear Business Filter
          </Button>
        )}
      </div>

      {/* Star Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          tabs={starTabs}
          activeTab={selectedRating}
          onChange={(tabId) => {
            setSelectedRating(tabId);
            setCurrentPage(1);
          }}
        />

        {/* Business Select */}
        <div className="w-56">
          <Select
            value={activeBusinessId}
            onChange={(e) => {
              setActiveBusinessId(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Businesses</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Search and Secondary Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-lg border border-border bg-card">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search reviews by keyword, author, or business..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Sentiment Filter */}
          <div className="w-36">
            <Select
              value={selectedSentiment}
              onChange={(e) => {
                setSelectedSentiment(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="critical">Critical</option>
            </Select>
          </div>

          {/* Sort By */}
          <div className="w-40">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              leftIcon={<ArrowUpDown className="w-3.5 h-3.5" />}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="rating_desc">Rating (High to Low)</option>
              <option value="rating_asc">Rating (Low to High)</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Review Table Card */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Reviewer</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold">Review Snippet</th>
                <th className="py-3 px-4 font-semibold">Sentiment</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-foreground">
              {paginatedReviews.map((rev) => (
                <tr
                  key={rev.id}
                  onClick={() => onOpenReviewDetail(rev)}
                  className="hover:bg-surface-highlight/50 transition-colors cursor-pointer group"
                >
                  {/* Reviewer */}
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {rev.reviewer.displayName}
                      </span>
                      {rev.reviewer.isLocalGuide && (
                        <span className="text-[10px] text-indigo-500 font-medium">
                          Local Guide
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Business Name */}
                  <td className="py-3.5 px-4 text-muted-foreground truncate max-w-[160px]">
                    {rev.businessName}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <StarRating rating={rev.rating} size="sm" showNumber />
                  </td>

                  {/* Review text snippet */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="line-clamp-2 text-foreground/90 leading-relaxed">
                      {rev.text}
                    </p>
                    {rev.ownerResponse && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>Owner Replied</span>
                      </div>
                    )}
                  </td>

                  {/* Sentiment */}
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        rev.sentiment === 'positive'
                          ? 'success'
                          : rev.sentiment === 'critical'
                          ? 'danger'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {rev.sentiment}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                    {formatDate(rev.publishedAt)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReviewDetail(rev);
                      }}
                      aria-label="Inspect review"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty Search Result */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <ShieldAlert className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-semibold text-foreground">No reviews matched filters</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your star rating or search terms.
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filteredReviews.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredReviews.length)} of{' '}
            {filteredReviews.length} reviews
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-3 h-3" />}
            >
              Previous
            </Button>
            <span className="px-2 font-mono text-foreground font-semibold">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              rightIcon={<ChevronRight className="w-3 h-3" />}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};


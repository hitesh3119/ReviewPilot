import React from 'react';
import {
  Building2,
  MessageSquare,
  Star,
  TrendingUp,
  Download,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';
import {
  MOCK_BUSINESSES,
  MOCK_REVIEWS,
  MOCK_OVERVIEW_METRICS,
  MOCK_RATING_BREAKDOWN,
  MOCK_MONTHLY_TRENDS,
  MOCK_EXPORT_JOBS,
} from '../../mock/mockData';
import { formatNumber, formatPercentage, formatDate } from '../../lib/utils';
import { Review } from '../../types/review';
import { NavView } from '../../types/navigation';

export interface OverviewViewProps {
  onNavigate: (view: NavView) => void;
  onOpenReviewDetail: (review: Review) => void;
  onOpenAddBusiness: () => void;
  onSync: () => void;
  isSyncing: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenReviewDetail,
  onOpenAddBusiness,
  onSync,
  isSyncing,
}) => {
  const metrics = MOCK_OVERVIEW_METRICS;
  const recentReviews = MOCK_REVIEWS.slice(0, 4);
  const recentExports = MOCK_EXPORT_JOBS.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner: Status & Sync State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                All 8 Locations Synchronized
              </h2>
              <Badge variant="success" size="sm">
                Up to Date
              </Badge>
              <Badge variant="secondary" size="sm" className="font-mono">
                MOCK DATA
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified connection to Google Business Profile API. Next scheduled auto-sync in 45 minutes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onSync}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Now
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddBusiness}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Location
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Businesses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Managed Businesses
            </CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.totalBusinesses}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% active in SQLite local</span>
            </div>
          </CardContent>
        </Card>

        {/* Available Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Indexed Customer Reviews
            </CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(metrics.availableReviews)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+{metrics.monthlyGrowthRate}% past 30 days</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Global Average Rating
            </CardTitle>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {metrics.averageRating.toFixed(2)}
              </span>
              <StarRating rating={metrics.averageRating} size="sm" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Across all 8 active locations
            </p>
          </CardContent>
        </Card>

        {/* Positive Sentiment */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Positive Review Ratio
            </CardTitle>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.positivePercentage)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <span>Only 3.6% critical ratings</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row: Review Volume Sparkline & Star Rating Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Volume Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Review Volume Trajectory (12 Months)</CardTitle>
                <CardDescription>
                  Aggregated review acquisition across verified locations
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('analytics')}>
                Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Clean CSS-based bar visualization */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
              {MOCK_MONTHLY_TRENDS.map((trend) => {
                const heightPercent = Math.round((trend.reviewCount / 350) * 100);
                return (
                  <div
                    key={trend.month}
                    className="flex flex-col items-center flex-1 group relative h-full justify-end"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-mono rounded px-1.5 py-0.5 pointer-events-none whitespace-nowrap z-10 shadow-sm">
                      {trend.reviewCount} reviews ({trend.averageRating.toFixed(2)}★)
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[28px] rounded-t bg-primary/80 group-hover:bg-primary transition-all duration-150"
                    />
                    <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center">
                      {trend.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rating Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown by star volume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_RATING_BREAKDOWN.map((item) => (
              <div key={item.stars} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <span>{item.stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {formatNumber(item.count)} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-highlight overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Recent Reviews Feed & Recent Export Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reviews Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Customer Reviews</CardTitle>
                <CardDescription>
                  Real-time incoming customer feedback with sentiment flags
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('reviews')}>
                View All Reviews
              </Button>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => onOpenReviewDetail(review)}
                className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4 cursor-pointer hover:bg-surface-highlight/40 rounded-lg p-2 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">
                      {review.reviewer.displayName}
                    </span>
                    {review.reviewer.isLocalGuide && (
                      <Badge variant="indigo" size="sm">
                        Local Guide
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      for {review.businessName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-[11px] text-muted-foreground">
                      {review.relativeTime}
                    </span>
                    <Badge
                      variant={
                        review.sentiment === 'positive'
                          ? 'success'
                          : review.sentiment === 'critical'
                          ? 'danger'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {review.sentiment}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/90 line-clamp-2 leading-relaxed">
                    {review.text}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-40 hover:opacity-100" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Exports Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Exports</CardTitle>
                <CardDescription>Download history & formats</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('exports')}>
                Export All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExports.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-lg border border-border/70 bg-surface-subtle flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" size="sm" className="font-mono uppercase font-semibold">
                      {exp.format}
                    </Badge>
                    <span className="text-xs font-medium text-foreground truncate">
                      {exp.targetBusinessName}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {formatNumber(exp.rowCount)} rows • {formatDate(exp.createdAt)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 shrink-0"
                  aria-label="Download export"
                  onClick={() => onNavigate('exports')}
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => onNavigate('exports')}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Configure New Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


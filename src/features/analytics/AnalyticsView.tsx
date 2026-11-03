import React from 'react';
import {
  TrendingUp,
  Sparkles,
  MessageSquare,
  BarChart2,
  PieChart,
  Tag,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  MOCK_MONTHLY_TRENDS,
  MOCK_SENTIMENT_DISTRIBUTION,
  MOCK_KEYWORD_TOPICS,
  MOCK_RATING_BREAKDOWN,
} from '../../mock/mockData';
import { formatNumber, formatPercentage } from '../../lib/utils';

export const AnalyticsView: React.FC = () => {
  const sentiment = MOCK_SENTIMENT_DISTRIBUTION;
  const topics = MOCK_KEYWORD_TOPICS;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Customer Intelligence & Sentiment Analytics
          </h2>
          <Badge variant="indigo" size="sm" className="font-mono">
            MOCK DATA
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Machine learning sentiment scoring, natural language keyword clustering, and rating velocity.
        </p>
      </div>

      {/* Top 3 Analytical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Positive Sentiment */}
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Positive Sentiment
              </CardTitle>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(sentiment.positivePercentage)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(sentiment.positiveCount)} customer reviews
            </p>
          </CardContent>
        </Card>

        {/* Neutral Sentiment */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Neutral / Balanced
              </CardTitle>
              <PieChart className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(sentiment.neutralPercentage)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(sentiment.neutralCount)} reviews with minor suggestions
            </p>
          </CardContent>
        </Card>

        {/* Critical Sentiment */}
        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                Critical Attention Needed
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(sentiment.criticalPercentage)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(sentiment.criticalCount)} negative feedback reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trajectory Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Velocity Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Average Rating Trajectory</CardTitle>
                <CardDescription>
                  12-month rolling rating stability (4.71★ to 4.88★)
                </CardDescription>
              </div>
              <BarChart2 className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2 pt-8 pb-2">
              {MOCK_MONTHLY_TRENDS.map((t) => {
                // Scale 4.5 to 5.0 onto 0% to 100%
                const heightPercent = Math.min(
                  100,
                  Math.max(20, Math.round(((t.averageRating - 4.5) / 0.5) * 100))
                );
                return (
                  <div
                    key={t.month}
                    className="flex flex-col items-center flex-1 group relative h-full justify-end"
                  >
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-mono rounded px-1.5 py-0.5 pointer-events-none whitespace-nowrap z-10 shadow-sm">
                      {t.averageRating.toFixed(2)}★ ({t.month})
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[26px] rounded-t bg-amber-400 group-hover:bg-amber-500 transition-all"
                    />
                    <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center font-mono">
                      {t.averageRating.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Review Acquisition Monthly Volume */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Review Volume</CardTitle>
                <CardDescription>New incoming reviews per calendar month</CardDescription>
              </div>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2 pt-8 pb-2">
              {MOCK_MONTHLY_TRENDS.map((t) => {
                const heightPercent = Math.round((t.reviewCount / 350) * 100);
                return (
                  <div
                    key={t.month}
                    className="flex flex-col items-center flex-1 group relative h-full justify-end"
                  >
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-mono rounded px-1.5 py-0.5 pointer-events-none whitespace-nowrap z-10 shadow-sm">
                      {t.reviewCount} reviews
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[26px] rounded-t bg-primary/80 group-hover:bg-primary transition-all"
                    />
                    <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center">
                      {t.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Topics & Semantic Clusters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Common Review Topics & Semantic Clusters</CardTitle>
              <CardDescription>
                Extracted operational themes with associated customer sentiment scores
              </CardDescription>
            </div>
            <Tag className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-lg border border-border bg-surface-subtle flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {t.topic}
                    </span>
                    <Badge
                      variant={
                        t.sentiment === 'positive'
                          ? 'success'
                          : t.sentiment === 'critical'
                          ? 'danger'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {t.sentiment}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {formatNumber(t.mentionCount)} customer mentions
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground text-[11px]">Average Score</span>
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <span>{t.averageRating.toFixed(1)}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


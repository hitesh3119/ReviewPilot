import React from 'react';
import {
  Star,
  User,
  MessageCircle,
  Calendar,
  ThumbsUp,
  Tag,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Drawer } from '../../components/ui/Drawer';
import { Badge } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Review } from '../../types/review';
import { formatDateTime } from '../../lib/utils';

export interface ReviewDetailDrawerProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewDetailDrawer: React.FC<ReviewDetailDrawerProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  if (!review) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Review Inspection"
      subtitle={`Review ID: ${review.id}`}
      width="lg"
    >
      {/* Reviewer Header Card */}
      <div className="p-4 rounded-xl border border-border bg-surface-subtle flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
            {review.reviewer.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {review.reviewer.displayName}
              </h3>
              {review.reviewer.isLocalGuide && (
                <Badge variant="indigo" size="sm">
                  Local Guide
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {review.reviewer.totalReviewsCount ?? 1} reviews on Google Maps
            </p>
          </div>
        </div>

        <Badge
          variant={
            review.sentiment === 'positive'
              ? 'success'
              : review.sentiment === 'critical'
              ? 'danger'
              : 'secondary'
          }
          size="md"
          className="uppercase tracking-wider font-semibold"
        >
          {review.sentiment}
        </Badge>
      </div>

      {/* Target Location Card */}
      <div className="flex items-center gap-2 p-3 rounded-lg border border-border/80 bg-card text-xs">
        <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">Location:</span>
        <strong className="text-foreground truncate">{review.businessName}</strong>
      </div>

      {/* Star Rating & Published Date */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-surface-subtle border border-border/60">
        <div>
          <span className="text-[11px] text-muted-foreground block mb-1">
            Star Rating
          </span>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="md" />
            <span className="text-sm font-bold text-foreground">
              {review.rating}.0 / 5.0
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-muted-foreground block mb-1">
            Publication Timestamp
          </span>
          <span className="text-xs font-mono text-foreground font-medium">
            {formatDateTime(review.publishedAt)}
          </span>
        </div>
      </div>

      {/* Full Review Text Body */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground block">
          Review Content
        </label>
        <div className="p-4 rounded-xl border border-border bg-card text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {review.text}
        </div>
      </div>

      {/* Helpful Likes & Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{review.likesCount} people found this review helpful</span>
        </div>

        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {review.tags.map((tag) => (
              <Badge key={tag} variant="secondary" size="sm">
                <Tag className="w-2.5 h-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Official Business Owner Reply */}
      {review.ownerResponse ? (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <MessageCircle className="w-4 h-4" />
            <span>Response from the Owner</span>
          </div>
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-foreground">
                {review.ownerResponse.authorName}
              </span>
              <span className="text-muted-foreground font-mono">
                {formatDateTime(review.ownerResponse.respondedAt)}
              </span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed italic">
              "{review.ownerResponse.responseText}"
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-border bg-card/50 text-center space-y-1">
          <span className="text-xs font-semibold text-foreground block">
            No Owner Response Yet
          </span>
          <p className="text-[11px] text-muted-foreground">
            This review has not been answered by the business owner yet.
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Verified Google Maps Review</span>
        </div>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Inspection
        </Button>
      </div>
    </Drawer>
  );
};


import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  MapPin,
  ExternalLink,
  Phone,
  Globe,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { BusinessLocation, BusinessCategory } from '../../types/business';
import { formatNumber, formatDate } from '../../lib/utils';

export interface BusinessesViewProps {
  businesses: BusinessLocation[];
  onOpenAddBusiness: () => void;
  onSelectBusinessReviews: (bizId: string) => void;
}

export const BusinessesView: React.FC<BusinessesViewProps> = ({
  businesses,
  onOpenAddBusiness,
  onSelectBusinessReviews,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minRating, setMinRating] = useState<string>('all');

  // Filter businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.formatted.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || b.category === selectedCategory;

      const matchesRating =
        minRating === 'all' || b.rating >= parseFloat(minRating);

      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [businesses, searchQuery, selectedCategory, minRating]);

  const categories = useMemo(() => {
    const cats = new Set<BusinessCategory>();
    businesses.forEach((b) => cats.add(b.category));
    return Array.from(cats);
  }, [businesses]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Managed Business Directory
            </h2>
            <Badge variant="secondary" size="sm">
              {filteredBusinesses.length} of {businesses.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Synchronized profiles via Google Business Profile and verified Places IDs.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenAddBusiness}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Business
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-lg border border-border bg-card">
        <div className="flex-1 w-full">
          <Input
            placeholder="Filter businesses by name, address, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="w-44">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-36">
            <Select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBusinesses.map((biz) => (
          <Card key={biz.id} className="hover:border-border/90 hover:shadow-elevation transition-all">
            <CardContent className="p-5 space-y-4">
              {/* Top Row: Category and Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="indigo" size="sm" className="mb-1.5">
                    {biz.category}
                  </Badge>
                  <h3 className="text-sm font-semibold text-foreground tracking-tight">
                    {biz.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge
                    variant={biz.syncStatus === 'synced' ? 'success' : 'warning'}
                    size="sm"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {biz.syncStatus === 'synced' ? 'Synced' : 'Pending'}
                  </Badge>
                </div>
              </div>

              {/* Rating and Metrics */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-subtle border border-border/60">
                <div className="flex items-center gap-2">
                  <StarRating rating={biz.rating} size="sm" />
                  <span className="text-xs font-bold text-foreground">
                    {biz.rating.toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {formatNumber(biz.reviewCount)} reviews
                </div>
              </div>

              {/* Address and Contact Details */}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{biz.address.formatted}</span>
                </div>

                {biz.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <span>{biz.phoneNumber}</span>
                  </div>
                )}

                {biz.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <a
                      href={biz.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate hover:text-primary transition-colors"
                    >
                      {biz.websiteUrl.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground font-mono">
                  Synced: {formatDate(biz.lastSyncedAt)}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => onSelectBusinessReviews(biz.id)}
                  >
                    View Reviews
                  </Button>
                  <a
                    href={biz.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Open on Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <h4 className="text-sm font-semibold text-foreground">No matching businesses</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query or category filters.
          </p>
        </div>
      )}
    </div>
  );
};


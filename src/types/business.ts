export type BusinessCategory =
  | 'Dental Clinic'
  | 'Specialty Coffee'
  | 'Law Practice'
  | 'Boutique Hotel'
  | 'Automotive Repair'
  | 'Artisan Bakery'
  | 'Fitness Studio'
  | 'Architecture & Design'
  | 'Restaurant'
  | 'Other';

export type SyncStatus = 'synced' | 'syncing' | 'failed' | 'pending';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formatted: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface BusinessLocation {
  id: string;
  placeId: string;
  name: string;
  category: BusinessCategory;
  address: Address;
  coordinates: GeoCoordinates;
  phoneNumber?: string;
  websiteUrl?: string;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  syncStatus: SyncStatus;
  lastSyncedAt: string;
  createdAt: string;
  isMock: boolean;
}

export interface BusinessStats {
  totalLocations: number;
  totalReviews: number;
  averageRating: number;
  positivePercentage: number;
  syncedLocations: number;
}


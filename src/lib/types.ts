export type DealCategory =
  | 'all'
  | 'loot'
  | 'tech'
  | 'gaming'
  | 'home'
  | 'fashion'
  | 'audio'
  | 'lifestyle';

export interface Deal {
  id: string;
  asin: string;
  title: string;
  slug: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  savingsAmount: number;
  currency: string;
  imageUrl: string;
  affiliateUrl: string;
  category: DealCategory;
  isLoot: boolean;
  isFeatured?: boolean;
  rating?: number;
  ratingCount?: number;
  isPrime?: boolean;
  store: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  clicksCount?: number;
}

export interface PublishDealPayload {
  asin?: string;
  title: string;
  description?: string;
  originalPrice?: number;
  discountPrice: number;
  discountPercentage?: number;
  imageUrl?: string;
  affiliateUrl: string;
  category?: DealCategory;
  isLoot?: boolean;
  isPrime?: boolean;
  rating?: number;
  ratingCount?: number;
}

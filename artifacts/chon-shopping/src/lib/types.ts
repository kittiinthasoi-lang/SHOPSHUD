export type CategoryId =
  | 'electronics'
  | 'home'
  | 'beauty'
  | 'sport'
  | 'fashion'
  | 'desk'
  | 'food'
  | 'baby'
  | 'travel'
  | 'auto'
  | 'pets'
  | 'books';

export type FeatureKey =
  | 'wireless'
  | 'anc'
  | 'lightweight'
  | 'waterproof'
  | 'longbattery'
  | 'quiet'
  | 'compact'
  | 'ergonomic'
  | 'fragrancefree'
  | 'spf'
  | 'energy'
  | 'foldable'
  | 'breathable'
  | 'adjustable'
  | 'organic'
  | 'safety'
  | 'fastcharge'
  | 'nontoxic';

export interface StoreOffer {
  id: string;
  storeId?: string;
  storeName: string;
  platform: string;
  price: number;
  originalPrice?: number;
  shippingFee: number;
  shippingText: string;
  url: string;
  affiliateUrl?: string;
  inStock: boolean;
  rating: number;
  badge?: string; // e.g. "ราคาถูกที่สุด", "ส่งฟรีทันที", "Mall ทางการ"
}

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  platform: string;
  platformColor?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryId;
  price: number;
  originalPrice: number;
  discountPercent: number;
  isDeal: boolean;
  dealBadge?: string;
  image: string;
  storeId: string;
  rating: number;
  reviewCount: number;
  shippingFee: number;
  shippingText: string;
  shippingEstimate: string;
  features: FeatureKey[];
  specs: { label: string; value: string }[];
  keywords: string[];
  hue: number;
  affiliatePlatform: string;
  commissionRate: number; // percentage e.g. 10 for 10%
  commissionType?: string; // e.g. 'CPS (ค่าคอมต่อยอดขาย)'
  affiliateUrl: string;
  storeOffers: StoreOffer[];
  reviews: ReviewItem[];
}

export interface SortKey {
  value: 'relevance' | 'price-asc' | 'price-desc' | 'commission-desc' | 'discount-desc' | 'rating-desc';
}


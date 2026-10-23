import type { CategoryId, FeatureKey, Product, Store } from './types';

// These are category/feature definitions only. The storefront must never seed fabricated products,
// offers, reviews, prices, affiliate commissions, or sales metrics.
export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: 'books', label: 'ความรู้และงานเขียน', blurb: 'eBook คู่มือ บทเรียน และงานเขียนต้นฉบับ' },
  { id: 'music', label: 'เพลงและเสียง', blurb: 'เพลง เนื้อเพลง บีต และเสียงประกอบ' } as { id: CategoryId; label: string; blurb: string },
  { id: 'design', label: 'งานออกแบบดิจิทัล', blurb: 'กราฟิก เทมเพลต และสินทรัพย์ดิจิทัล' } as { id: CategoryId; label: string; blurb: string },
  { id: 'tools', label: 'เครื่องมือดิจิทัล', blurb: 'เครื่องมือและทรัพยากรดิจิทัล' } as { id: CategoryId; label: string; blurb: string },
];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
export const FEATURES: { key: FeatureKey; label: string; words: string[] }[] = [];
export const FEATURE_LABEL: Record<string, string> = {};
export const AFFILIATE_PLATFORMS: { id: string; name: string; color: string; avgCommission: string }[] = [];
export const STORES: Store[] = [];
export const STORE_BY_ID: Record<string, Store> = {};
export const PRODUCTS: Product[] = [];

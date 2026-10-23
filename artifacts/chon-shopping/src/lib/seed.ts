import type { CategoryId, FeatureKey, Product, Store } from './types';

// Product, offer, review, price, affiliate, and sales seed data has intentionally been removed.
export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: 'books', label: 'ความรู้และงานเขียน', blurb: 'eBook คู่มือ บทเรียน และงานเขียนต้นฉบับ' },
];
export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
export const FEATURES: { key: FeatureKey; label: string; words: string[] }[] = [];
export const FEATURE_LABEL: Record<string, string> = {};
export const AFFILIATE_PLATFORMS: { id: string; name: string; color: string; avgCommission: string }[] = [];
export const STORES: Store[] = [];
export const STORE_BY_ID: Record<string, Store> = {};
export const PRODUCTS: Product[] = [];

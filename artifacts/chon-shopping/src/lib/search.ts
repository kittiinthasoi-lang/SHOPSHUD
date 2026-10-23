import { CATEGORY_LABEL, PRODUCTS, STORE_BY_ID } from './seed';
import type { CategoryId, Product } from './types';

export type SortValue = 'relevance' | 'price-asc' | 'price-desc' | 'commission-desc' | 'discount-desc' | 'rating-desc';

export interface SearchParams {
  query: string;
  category: CategoryId | 'all';
  platform?: string | 'all';
  onlyDeals?: boolean;
  min: number | null;
  max: number | null;
  sort: SortValue;
}

export function toBudget(v: string): number | null {
  const n = Number(v.replace(/,/g, '').trim());
  return v.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : null;
}

export function calcCommission(p: Product): number {
  return Math.round((p.price * p.commissionRate) / 100);
}

function score(p: Product, tokens: string[]): number {
  if (!tokens.length) return 1;
  const name = `${p.name} ${p.nameEn}`.toLowerCase();
  const kw = p.keywords.join(' ').toLowerCase();
  const platform = (p.affiliatePlatform || '').toLowerCase();
  const rest = `${CATEGORY_LABEL[p.category]} ${STORE_BY_ID[p.storeId]?.name ?? ''} ${platform} ${p.specs.map((s) => s.value).join(' ')}`.toLowerCase();
  let total = 0;
  for (const t of tokens) {
    let s = 0;
    if (name.includes(t)) s += 5;
    if (kw.includes(t)) s += 4;
    if (platform.includes(t)) s += 3;
    if (rest.includes(t)) s += 2;
    if (s === 0) return 0;
    total += s;
  }
  return total;
}

export function searchProducts(params: SearchParams): Product[] {
  const tokens = params.query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = PRODUCTS.filter((p) => {
    if (params.onlyDeals && !p.isDeal && p.discountPercent < 10) return false;
    if (params.category !== 'all' && p.category !== params.category) return false;
    if (params.platform && params.platform !== 'all' && p.affiliatePlatform !== params.platform) return false;
    if (params.min !== null && p.price < params.min) return false;
    if (params.max !== null && p.price > params.max) return false;
    return true;
  })
    .map((p) => ({ p, s: score(p, tokens) }))
    .filter((x) => x.s > 0);

  scored.sort((a, b) => {
    if (params.sort === 'price-asc') return a.p.price - b.p.price;
    if (params.sort === 'price-desc') return b.p.price - a.p.price;
    if (params.sort === 'discount-desc') return b.p.discountPercent - a.p.discountPercent;
    if (params.sort === 'rating-desc') return b.p.rating - a.p.rating || b.p.reviewCount - a.p.reviewCount;
    if (params.sort === 'commission-desc') {
      const commA = calcCommission(a.p);
      const commB = calcCommission(b.p);
      return commB - commA || b.p.commissionRate - a.p.commissionRate;
    }
    return b.s - a.s || a.p.price - b.p.price;
  });
  return scored.map((x) => x.p);
}

export const thb = (n: number) => `฿${n.toLocaleString('th-TH')}`;

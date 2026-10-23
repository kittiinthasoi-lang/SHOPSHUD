import { FEATURES, FEATURE_LABEL, PRODUCTS } from './seed';
import type { CategoryId, FeatureKey, Product } from './types';

export interface AssistantInput {
  budget: number | null;
  category: CategoryId | 'all';
  requirements: string;
}

export interface Recommendation {
  product: Product;
  matched: FeatureKey[];
  missing: FeatureKey[];
  explanation: string;
}

export interface AssistantResult {
  recommendations: Recommendation[];
  recognized: FeatureKey[];
  unrecognized: string[];
  notes: string[];
  noMatchReason: string | null;
}

export function runAssistant(input: AssistantInput): AssistantResult {
  const text = input.requirements.toLowerCase();
  const recognized = FEATURES.filter((f) => f.words.some((w) => text.includes(w))).map((f) => f.key);

  // Tokens not covered by any known alias word are reported, never guessed.
  const allWords = FEATURES.flatMap((f) => f.words);
  let leftover = text;
  for (const w of allWords.sort((a, b) => b.length - a.length)) leftover = leftover.split(w).join(' ');
  const unrecognized = leftover
    .split(/[\s,.;/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !/^(และ|หรือ|ที่|ราคา|ไม่|ให้|มี|ขอ|อยาก|ได้|ๆ)$/.test(t));

  const notes: string[] = [];
  if (unrecognized.length)
    notes.push(`ไม่รู้จักเงื่อนไขเหล่านี้ จึงไม่ได้ใช้คัดสินค้า: ${unrecognized.join(', ')}`);
  if (input.requirements.trim() && !recognized.length)
    notes.push('ไม่พบเงื่อนไขที่ระบบรู้จัก ผลลัพธ์จึงอิงจากงบและหมวดหมู่เท่านั้น');
  if (input.budget === null) notes.push('ยังไม่ได้ระบุงบ ผลลัพธ์จึงไม่ได้จำกัดราคา');

  const pool = PRODUCTS.filter(
    (p) =>
      (input.category === 'all' || p.category === input.category) &&
      (input.budget === null || p.price <= input.budget),
  );

  if (!pool.length) {
    return {
      recommendations: [],
      recognized,
      unrecognized,
      notes,
      noMatchReason:
        'ไม่มีสินค้าในแคตตาล็อกเดโมที่อยู่ในงบและหมวดหมู่นี้ ลองเพิ่มงบหรือเลือกหมวดอื่น',
    };
  }

  const ranked = pool
    .map((p) => {
      const matched = recognized.filter((k) => p.features.includes(k));
      const missing = recognized.filter((k) => !p.features.includes(k));
      return { p, matched, missing };
    })
    .filter((x) => !recognized.length || x.matched.length > 0)
    .sort((a, b) => b.matched.length - a.matched.length || a.p.price - b.p.price)
    .slice(0, 3);

  if (!ranked.length) {
    return {
      recommendations: [],
      recognized,
      unrecognized,
      notes,
      noMatchReason: `ไม่มีสินค้าในงบที่ตรงกับเงื่อนไข: ${recognized.map((k) => FEATURE_LABEL[k]).join(', ')} จึงไม่แนะนำสินค้าที่ไม่เกี่ยวข้อง`,
    };
  }

  const recommendations = ranked.map(({ p, matched, missing }) => {
    const parts: string[] = [];
    if (input.budget !== null) parts.push(`ราคา ฿${p.price.toLocaleString('th-TH')} อยู่ในงบ ฿${input.budget.toLocaleString('th-TH')}`);
    if (matched.length) parts.push(`ตรงเงื่อนไข: ${matched.map((k) => FEATURE_LABEL[k]).join(', ')}`);
    if (missing.length) parts.push(`ข้อมูลเดโมไม่ระบุว่ามี: ${missing.map((k) => FEATURE_LABEL[k]).join(', ')}`);
    if (!parts.length) parts.push('ตรงกับหมวดหมู่ที่เลือก');
    return { product: p, matched, missing, explanation: parts.join(' · ') };
  });

  return { recommendations, recognized, unrecognized, notes, noMatchReason: null };
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Coins, Filter, PackageSearch, Search as SearchIcon, Sparkles } from 'lucide-react';
import { CATEGORY_ICON } from '@/components/product-art';
import { ProductCard } from '@/components/product-card';
import { searchProducts, toBudget, type SortValue } from '@/lib/search';
import { AFFILIATE_PLATFORMS, CATEGORIES, PRODUCTS } from '@/lib/seed';
import { useStore } from '@/lib/store';
import type { CategoryId } from '@/lib/types';
import { useDocMeta } from '@/lib/use-doc-meta';

import { Flame } from 'lucide-react';
import { Link } from 'wouter';

const field = 'w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm';

export default function Home() {
  useDocMeta('ช้อปชัด — เปรียบเทียบราคาและดีลออนไลน์ทุกหมวดหมู่', 'ค้นหาสินค้า เปรียบเทียบราคา Shopee, Lazada, TikTok Shop พร้อมรีวิว คะแนน ค่าส่ง และลิงก์สั่งซื้อตรง');
  const { recordSearch } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [platform, setPlatform] = useState<string | 'all'>('all');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [sort, setSort] = useState<SortValue>('relevance');
  const [loading, setLoading] = useState(true);
  const first = useRef(true);

  const dq = query, dmin = min, dmax = max;
  const results = useMemo(
    () => searchProducts({ query: dq, category, platform, min: toBudget(dmin), max: toBudget(dmax), sort }),
    [dq, category, platform, dmin, dmax, sort],
  );

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), first.current ? 450 : 250);
    first.current = false;
    return () => clearTimeout(t);
  }, [query, category, platform, min, max, sort]);

  const budgetInvalid = toBudget(min) !== null && toBudget(max) !== null && (toBudget(min) as number) > (toBudget(max) as number);
  const reset = () => { setQuery(''); setCategory('all'); setPlatform('all'); setMin(''); setMax(''); setSort('relevance'); };

  return (
    <div className="space-y-8">
      {/* Hero Banner with Affiliate & Product Highlights */}
      <section className="anim-rise rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-slate-900 p-6 text-primary-foreground md:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--marigold))] px-3 py-1 text-xs font-bold text-[hsl(192_50%_10%)] shadow-sm">
              <Coins className="h-3.5 w-3.5" /> แพลตฟอร์มเปรียบเทียบราคา & ดีลค่าคอมมิชชั่น
            </span>
            <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs text-primary-foreground">
              {PRODUCTS.length} สินค้า · 12 หมวดหมู่ · 9 แพลตฟอร์มพันธมิตร
            </span>
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 px-3 py-1 text-xs font-bold text-white shadow-md transition-all animate-pulse"
            >
              <Flame className="h-3.5 w-3.5 fill-white" /> ดูดีลลดราคาทุกหมวด (ลดสูงสุด 65%) →
            </Link>
          </div>
          <h1 className="font-display text-3xl font-bold md:text-5xl">เลือกให้ชัด เปรียบเทียบราคาได้จริง</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/90 text-sm md:text-base leading-relaxed">
            รวบรวมสินค้าพร้อมโปรโมชั่นและส่วนลดจาก Shopee, Lazada, TikTok Shop, Central, Watsons, Advice และร้านค้าชั้นนำ เปรียบเทียบราคาแต่ละร้าน รีวิว คะแนนจริง ค่าจัดส่ง และกดสั่งซื้อได้ทันที
          </p>

          <form
            role="search"
            className="mt-6 flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => { e.preventDefault(); recordSearch(query); }}
          >
            <label className="sr-only" htmlFor="q">ค้นหาสินค้า</label>
            <input
              id="q" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหา เช่น หูฟังไร้สาย, คอลลาเจน, หุ่นยนต์ดูดฝุ่น, ลิปสติก, ลู่วิ่ง, Shopee"
              data-testid="input-search"
              className="min-w-0 flex-1 rounded-xl border-0 bg-card px-4 py-3.5 text-foreground placeholder:text-muted-foreground text-sm md:text-base shadow-sm focus:outline-hidden"
            />
            <button type="submit" data-testid="button-search" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--marigold))] px-6 py-3.5 font-semibold text-[hsl(192_50%_10%)] active:scale-95 shadow-sm transition-transform hover:brightness-105">
              <SearchIcon className="h-4 w-4" aria-hidden="true" /> ค้นหา
            </button>
          </form>
        </div>
      </section>

      {/* Quick Platform Bar */}
      <section aria-labelledby="plat-h">
        <div className="flex items-center justify-between mb-2">
          <h2 id="plat-h" className="font-display text-lg font-bold flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" /> แพลตฟอร์มแอฟฟิลิเอตที่มีค่าคอมมิชชั่น
          </h2>
          <span className="text-xs text-muted-foreground hidden sm:inline">คลิกเพื่อกรองตามแพลตฟอร์ม</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => setPlatform('all')}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              platform === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-card-border hover:bg-secondary text-foreground'
            }`}
          >
            ทุกแพลตฟอร์ม ({PRODUCTS.length})
          </button>
          {AFFILIATE_PLATFORMS.map((p) => {
            const count = PRODUCTS.filter((item) => item.affiliatePlatform === p.id).length;
            const active = platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(active ? 'all' : p.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card border-card-border hover:bg-secondary text-foreground'
                }`}
              >
                <span>{p.name}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${active ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`}>
                  {count}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                  ({p.avgCommission})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Categories Grid */}
      <section aria-labelledby="cat-h">
        <h2 id="cat-h" className="mb-3 font-display text-xl font-bold">เลือกตามหมวดหมู่สินค้า ({CATEGORIES.length} หมวด)</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICON[c.id];
            const on = category === c.id;
            const count = PRODUCTS.filter((item) => item.category === c.id).length;
            return (
              <button
                key={c.id} type="button" aria-pressed={on}
                onClick={() => setCategory(on ? 'all' : c.id)}
                data-testid={`button-category-${c.id}`}
                className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all hover:-translate-y-0.5 ${on ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-card-border bg-card hover:shadow-md'}`}
              >
                <div className="flex w-full items-center justify-between">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className={`text-[11px] rounded-full px-1.5 py-0.2 ${on ? 'bg-white/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{count}</span>
                </div>
                <span className="text-sm font-semibold line-clamp-1">{c.label}</span>
                <span className={`text-xs line-clamp-1 ${on ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{c.blurb}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter and Products Section */}
      <section aria-labelledby="res-h" className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <form className="h-fit space-y-3 rounded-2xl border border-card-border bg-card p-4 shadow-xs" aria-label="ตัวกรอง" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <h2 className="font-semibold flex items-center gap-1.5 text-sm"><Filter className="h-4 w-4" /> ตัวกรองสินค้า</h2>
            {(category !== 'all' || platform !== 'all' || min || max || sort !== 'relevance') && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>

          <div>
            <label htmlFor="cat" className="mb-1 block text-sm font-medium">หมวดหมู่</label>
            <select id="cat" className={field} value={category} onChange={(e) => setCategory(e.target.value as CategoryId | 'all')} data-testid="select-category">
              <option value="all">ทุกหมวดหมู่ ({PRODUCTS.length})</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label} ({PRODUCTS.filter(p => p.category === c.id).length})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="platform-sel" className="mb-1 block text-sm font-medium">แพลตฟอร์มแอฟฟิลิเอต</label>
            <select id="platform-sel" className={field} value={platform} onChange={(e) => setPlatform(e.target.value)} data-testid="select-platform">
              <option value="all">ทุกแพลตฟอร์ม ({PRODUCTS.length})</option>
              {AFFILIATE_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({PRODUCTS.filter(prod => prod.affiliatePlatform === p.id).length})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="min" className="mb-1 block text-sm font-medium">ราคาต่ำสุด (฿)</label>
              <input id="min" inputMode="numeric" className={field} value={min} onChange={(e) => setMin(e.target.value)} placeholder="0" data-testid="input-min" />
            </div>
            <div>
              <label htmlFor="max" className="mb-1 block text-sm font-medium">ราคาสูงสุด (฿)</label>
              <input id="max" inputMode="numeric" className={field} value={max} onChange={(e) => setMax(e.target.value)} placeholder="ไม่จำกัด" data-testid="input-max" />
            </div>
          </div>
          {budgetInvalid && <p role="alert" className="text-xs text-destructive">ราคาต่ำสุดมากกว่าราคาสูงสุด</p>}

          <div>
            <label htmlFor="sort" className="mb-1 block text-sm font-medium">เรียงตาม</label>
            <select id="sort" className={field} value={sort} onChange={(e) => setSort(e.target.value as SortValue)} data-testid="select-sort">
              <option value="relevance">ความตรงกับคำค้น</option>
              <option value="discount-desc">🔥 ส่วนลดมากที่สุด (% ลดเยอะ)</option>
              <option value="rating-desc">⭐ คะแนนรีวิวสูงสุด</option>
              <option value="commission-desc">ค่าคอมมิชชั่นสูงไปต่ำ</option>
              <option value="price-asc">ราคา: ต่ำไปสูง</option>
              <option value="price-desc">ราคา: สูงไปต่ำ</option>
            </select>
          </div>

          <button type="button" onClick={reset} className="w-full rounded-xl border border-input px-3 py-2 text-sm font-medium hover:bg-secondary transition-colors" data-testid="button-reset-filters">
            ล้างตัวกรองทั้งหมด
          </button>
        </form>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 id="res-h" className="text-sm text-muted-foreground font-medium" aria-live="polite" data-testid="text-result-count">
              {loading ? 'กำลังค้นหา...' : `พบ ${results.length} จากทั้งหมด ${PRODUCTS.length} รายการ`}
            </h2>
            {sort === 'commission-desc' && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                <Sparkles className="h-3.5 w-3.5" /> เรียงตามมูลค่าคอมมิชชั่นสูงสุด
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border bg-card">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="space-y-2 p-4">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-6 w-1/3 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-input p-10 text-center" data-testid="empty-results">
              <PackageSearch className="mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="font-semibold text-lg">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
              <p className="mb-4 text-sm text-muted-foreground">ลองเปลี่ยนคำค้น ขยายช่วงราคา หรือเลือกดูทุกหมวดและแพลตฟอร์ม</p>
              <button type="button" onClick={reset} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

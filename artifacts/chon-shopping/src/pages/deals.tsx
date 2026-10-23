import { useMemo, useState } from 'react';
import { 
  BadgePercent, 
  Clock, 
  ExternalLink, 
  Filter, 
  Flame, 
  GitCompareArrows, 
  Percent, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Store as StoreIcon, 
  Tag, 
  Truck 
} from 'lucide-react';
import { CATEGORY_ICON, ProductArt } from '@/components/product-art';
import { calcCommission, searchProducts, thb, type SortValue } from '@/lib/search';
import { CATEGORIES, CATEGORY_LABEL, PRODUCTS } from '@/lib/seed';
import { useStore } from '@/lib/store';
import type { CategoryId, Product } from '@/lib/types';
import { useDocMeta } from '@/lib/use-doc-meta';

export default function DealsPage() {
  useDocMeta(
    'รวมดีลสินค้าลดราคาพิเศษทุกหมวดหมู่ — ช้อปชัด',
    'หน้าแนะนำสินค้าลดราคาทุกหมวดหมู่ในหน้าเดียว เปรียบเทียบราคาแต่ละร้าน Shopee, Lazada, TikTok Shop รีวิว คะแนน ค่าจัดส่ง พร้อมลิงก์ซื้อตรง'
  );

  const { state, toggleCompare, openPurchase, recordClick } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [discountFilter, setDiscountFilter] = useState<'all' | '40' | '30' | 'freeship'>('all');
  const [sort, setSort] = useState<SortValue>('discount-desc');
  const [activeTab, setActiveTab] = useState<'all' | 'flash' | 'high-rated'>('all');

  // Filter deals
  const deals = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.discountPercent > 0 || p.isDeal);

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (discountFilter === '40') {
      list = list.filter((p) => p.discountPercent >= 40);
    } else if (discountFilter === '30') {
      list = list.filter((p) => p.discountPercent >= 30);
    } else if (discountFilter === 'freeship') {
      list = list.filter((p) => p.shippingFee === 0);
    }

    if (activeTab === 'flash') {
      list = list.filter((p) => p.discountPercent >= 35);
    } else if (activeTab === 'high-rated') {
      list = list.filter((p) => (p.rating ?? 0) >= 4.8);
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sort === 'discount-desc') return b.discountPercent - a.discountPercent;
      if (sort === 'rating-desc') return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'commission-desc') return calcCommission(b) - calcCommission(a);
      return 0;
    });
  }, [selectedCategory, discountFilter, sort, activeTab]);

  // Overall statistics for banner
  const maxDiscount = Math.max(...PRODUCTS.map((p) => p.discountPercent));
  const freeShipCount = PRODUCTS.filter((p) => p.shippingFee === 0).length;
  const totalSavings = PRODUCTS.reduce((acc, p) => acc + (p.originalPrice > p.price ? p.originalPrice - p.price : 0), 0);

  return (
    <div className="space-y-8">
      {/* Hero Banner for All Category Deals */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-700 p-6 text-white shadow-xl md:p-10">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-1 text-xs font-bold text-slate-950 shadow-md">
              <Flame className="h-4 w-4 fill-slate-950" /> ดีลเด็ดลดราคาทุกหมวดหมู่
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-medium text-white">
              <Clock className="h-3.5 w-3.5" /> อัปเดตราคาเปรียบเทียบล่าสุด
            </span>
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            รวมสินค้าลดราคาทุกหมวดหมู่ ช้อปคุ้มในหน้าเดียว
          </h1>

          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
            เช็คราคาถูกที่สุดจาก Shopee, Lazada, TikTok Shop และร้านค้าชั้นนำ พร้อมรีวิวคะแนนจากผู้ใช้จริง ค่าจัดส่ง และลิงก์สั่งซื้อตรง ประหยัดสูงสุดถึง {maxDiscount}%
          </p>

          {/* Quick Stats Grid */}
          <div className="pt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-3 text-center border border-white/15">
              <div className="text-xs text-rose-200">ลดสูงสุดถึง</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">-{maxDiscount}%</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-3 text-center border border-white/15">
              <div className="text-xs text-rose-200">สินค้าลดราคา</div>
              <div className="text-xl sm:text-2xl font-black text-white">{PRODUCTS.length} รายการ</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-3 text-center border border-white/15">
              <div className="text-xs text-rose-200">มีบริการส่งฟรี</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">{freeShipCount} ดีล</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-3 text-center border border-white/15">
              <div className="text-xs text-rose-200">รวมส่วนลดกว่า</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">฿{(totalSavings).toLocaleString('th-TH')}</div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-40 h-80 w-80 rounded-full bg-rose-400/20 blur-3xl" />
      </section>

      {/* Tabs / Filter Highlights */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            <Tag className="h-4 w-4" /> ดีลทั้งหมด ({PRODUCTS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flash')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'flash'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            <Flame className="h-4 w-4 text-rose-500 fill-rose-500" /> แฟลชเซลล์ ลด 35%+
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('high-rated')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'high-rated'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> เรตติ้งยอดนิยม (4.8+)
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">จัดเรียง:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortValue)}
            className="rounded-xl border border-input bg-card px-3 py-1.5 text-xs sm:text-sm font-medium shadow-xs"
          >
            <option value="discount-desc">🔥 ส่วนลดมากที่สุด (% ลดเยอะ)</option>
            <option value="rating-desc">⭐ คะแนนรีวิวสูงสุด</option>
            <option value="price-asc">ราคา: ประหยัดสุด (ต่ำไปสูง)</option>
            <option value="price-desc">ราคา: พรีเมียม (สูงไปต่ำ)</option>
            <option value="commission-desc">ค่าคอมมิชชั่นสูงสุด</option>
          </select>
        </div>
      </div>

      {/* Category Pills - All Categories on One Page */}
      <section aria-labelledby="deal-categories">
        <div className="flex items-center justify-between mb-3">
          <h2 id="deal-categories" className="font-display text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" /> เลือกดูดีลตามหมวดหมู่ (12 หมวด)
          </h2>
          <span className="text-xs text-muted-foreground">คลิกเพื่อเลือกหมวด</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-card-border hover:bg-secondary text-foreground'
            }`}
          >
            ทุกหมวด ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICON[c.id];
            const active = selectedCategory === c.id;
            const count = PRODUCTS.filter((p) => p.category === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(active ? 'all' : c.id)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all border ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card border-card-border hover:bg-secondary text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{c.label}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${active ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter Chips: Discount level & Shipping */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> เงื่อนไขส่วนลด:
        </span>
        <button
          type="button"
          onClick={() => setDiscountFilter('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            discountFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          ลดทุกระดับ
        </button>
        <button
          type="button"
          onClick={() => setDiscountFilter('40')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            discountFilter === '40' ? 'bg-rose-600 text-white font-bold' : 'bg-secondary hover:bg-secondary/80 text-rose-700 dark:text-rose-400'
          }`}
        >
          🔥 ลด 40% ขึ้นไป
        </button>
        <button
          type="button"
          onClick={() => setDiscountFilter('30')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            discountFilter === '30' ? 'bg-amber-600 text-white font-bold' : 'bg-secondary hover:bg-secondary/80 text-amber-700 dark:text-amber-400'
          }`}
        >
          ⚡ ลด 30% ขึ้นไป
        </button>
        <button
          type="button"
          onClick={() => setDiscountFilter('freeship')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            discountFilter === 'freeship' ? 'bg-emerald-600 text-white font-bold' : 'bg-secondary hover:bg-secondary/80 text-emerald-700 dark:text-emerald-400'
          }`}
        >
          🚚 ส่งฟรีเท่านั้น
        </button>

        <span className="ml-auto text-xs text-muted-foreground">
          แสดง <strong>{deals.length}</strong> รายการดีล
        </span>
      </div>

      {/* Deals Products Grid */}
      {deals.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-input p-12 text-center">
          <BadgePercent className="mb-3 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-bold">ไม่พบดีลที่ตรงกับตัวกรองนี้</h3>
          <p className="mt-1 text-sm text-muted-foreground">ลองล้างตัวกรองเพื่อดูสินค้าลดราคาทั้งหมดในระบบ</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('all'); setDiscountFilter('all'); setActiveTab('all'); }}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            แสดงดีลทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((product, idx) => (
            <DealCard
              key={product.id}
              product={product}
              index={idx}
              onCompare={() => toggleCompare(product.id)}
              isCompared={state.compare.includes(product.id)}
              onOpenOffers={() => { recordClick(product.id); openPurchase(product); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DealCard({
  product,
  index,
  onCompare,
  isCompared,
  onOpenOffers,
}: {
  product: Product;
  index: number;
  onCompare: () => void;
  isCompared: boolean;
  onOpenOffers: () => void;
}) {
  const commAmount = calcCommission(product);
  const lowestStore = product.storeOffers?.find((s) => s.badge === 'ราคาถูกที่สุด') ?? product.storeOffers?.[0];
  const savings = product.originalPrice > product.price ? product.originalPrice - product.price : 0;

  return (
    <article
      data-testid={`deal-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
    >
      {/* Product Image and Discount Ribbon */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <ProductArt product={product} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />

        {/* Big Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-lg animate-pulse">
              <Flame className="h-3.5 w-3.5 fill-white" />
              {product.dealBadge ?? `ลด ${product.discountPercent}%`}
            </span>
            {savings > 0 && (
              <span className="rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-semibold text-amber-300 backdrop-blur">
                ประหยัด ฿{savings.toLocaleString('th-TH')}
              </span>
            )}
          </div>
        )}

        {/* Category Pill */}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
          {CATEGORY_LABEL[product.category]}
        </span>

        {/* Shipping badge on image bottom */}
        <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 rounded-lg bg-emerald-600/90 backdrop-blur px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
          <Truck className="h-3 w-3" /> {product.shippingText}
        </span>
      </div>

      {/* Product Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Name */}
        <h3 className="font-semibold text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Star Rating & Review Count */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              <span className="ml-1 font-bold text-foreground text-xs">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">({product.reviewCount.toLocaleString('th-TH')} รีวิว)</span>
          </div>

          <span className="text-[11px] text-muted-foreground">
            จัดส่ง: {product.shippingEstimate}
          </span>
        </div>

        {/* Price & Savings */}
        <div className="mt-3 rounded-xl bg-secondary/50 p-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-muted-foreground">ราคาพิเศษวันนี้:</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-rose-600 dark:text-rose-400">
                  {thb(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {thb(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground">ค่าคอมมิชชั่น</span>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {product.commissionRate}% (~{thb(commAmount)})
              </div>
            </div>
          </div>
        </div>

        {/* Store Comparison Price Highlights */}
        {product.storeOffers && product.storeOffers.length > 0 && (
          <div className="mt-3 space-y-1.5 border-t border-border/50 pt-2.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <StoreIcon className="h-3.5 w-3.5 text-primary" /> เปรียบเทียบราคาแต่ละร้าน ({product.storeOffers.length} ร้าน):
              </span>
              <span className="text-[10px] text-primary">เช็คได้ทันที</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {product.storeOffers.slice(0, 4).map((offer) => (
                <a
                  key={offer.id ?? offer.storeId}
                  href={offer.url ?? offer.affiliateUrl ?? product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between rounded-lg p-1.5 border transition-colors hover:border-primary ${
                    offer.badge === 'ราคาถูกที่สุด'
                      ? 'border-emerald-500/50 bg-emerald-500/5 font-semibold text-emerald-800 dark:text-emerald-300'
                      : 'border-border/60 bg-card hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-1 truncate">
                    <span className="truncate text-[11px]">{offer.storeName}</span>
                  </div>
                  <span className="tabular-nums font-bold text-[11px] shrink-0">
                    {thb(offer.price)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Latest Customer Review Quote */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-3 rounded-lg bg-muted/40 p-2 text-xs italic text-muted-foreground border-l-2 border-primary/50">
            <span className="line-clamp-1 font-normal">
              "{product.reviews[0].comment}"
            </span>
            <span className="mt-0.5 block text-[10px] not-italic text-foreground/70">
              — {product.reviews[0].userName} (ให้ {product.reviews[0].rating} ดาว)
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2 pt-2 border-t border-border/40">
          {/* Direct Buy Link to Lowest Store */}
          <a
            href={lowestStore?.url ?? lowestStore?.affiliateUrl ?? product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:bg-rose-700 active:scale-95"
            data-testid={`deal-buy-${product.id}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            ซื้อเลย {lowestStore ? `(${lowestStore.storeName})` : ''}
          </a>

          {/* Compare Prices Modal Trigger */}
          <button
            type="button"
            onClick={onOpenOffers}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-input bg-card px-3 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
            data-testid={`deal-compare-stores-${product.id}`}
            title="ดูตารางเปรียบเทียบราคา ค่าส่ง และรีวิวทุกร้าน"
          >
            <StoreIcon className="h-3.5 w-3.5 text-primary" />
            เทียบร้าน
          </button>

          {/* Add to comparison table button */}
          <button
            type="button"
            onClick={onCompare}
            className={`inline-flex items-center justify-center rounded-xl p-2 transition-colors border ${
              isCompared
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-input bg-card hover:bg-secondary text-muted-foreground'
            }`}
            title={isCompared ? 'อยู่ในรายการเทียบแล้ว' : 'เพิ่มในตารางเทียบสินค้า'}
            data-testid={`deal-toggle-compare-${product.id}`}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

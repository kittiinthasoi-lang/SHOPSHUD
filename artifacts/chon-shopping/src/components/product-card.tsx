import { Check, Coins, ExternalLink, Plus, ShoppingBag, Star, Store as StoreIcon, Truck } from 'lucide-react';
import { ProductArt } from '@/components/product-art';
import { calcCommission, thb } from '@/lib/search';
import { CATEGORY_LABEL, STORE_BY_ID, highlightsOf } from '@/lib/seed';
import { useStore } from '@/lib/store';
import type { Product } from '@/lib/types';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { state, toggleCompare, openPurchase, recordClick } = useStore();
  const selected = state.compare.includes(product.id);
  const commAmount = calcCommission(product);
  const lowestStore = product.storeOffers?.find((s) => s.badge === 'ราคาถูกที่สุด') ?? product.storeOffers?.[0];

  return (
    <article
      data-testid={`card-product-${product.id}`}
      className="anim-rise group flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
    >
      {/* Product Image and Deal Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <ProductArt product={product} className="h-full w-full" />
        
        {/* Deal / Discount Badge */}
        {product.discountPercent > 0 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-md">
            {product.dealBadge ?? `ลด ${product.discountPercent}%`}
          </span>
        )}

        {/* Category Pill */}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
          {CATEGORY_LABEL[product.category]}
        </span>

        {/* Affiliate Platform pill bottom left */}
        <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 rounded-lg bg-black/70 backdrop-blur px-2 py-0.5 text-[11px] font-medium text-white">
          <StoreIcon className="h-3 w-3" /> {product.affiliatePlatform}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title & Ratings */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1">
            <span className="flex items-center font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 inline mr-0.5" />
              {product.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({product.reviewCount.toLocaleString('th-TH')} รีวิว)</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <Truck className="h-3 w-3" /> {product.shippingText}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors" data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{product.nameEn}</p>
        </div>

        {/* Pricing & Comparison summary */}
        <div className="flex items-baseline justify-between gap-2 border-b border-border/50 pb-2.5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                {thb(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {thb(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              เทียบราคา {product.storeOffers.length} ร้านค้า {lowestStore ? `(ถูกสุดที่ ${lowestStore.platform})` : ''}
            </p>
          </div>

          {/* Commission pill for affiliates/creators */}
          <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-300">
              <Coins className="h-3 w-3 text-amber-500" />
              <span>คอม {product.commissionRate}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">~{thb(commAmount)}/ชิ้น</p>
          </div>
        </div>

        {/* Highlights */}
        <ul className="space-y-1 text-xs text-foreground/85">
          {highlightsOf(product).map((h) => (
            <li key={h} className="flex gap-1.5 items-center">
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span className="line-clamp-1">{h}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { recordClick(product.id); openPurchase(product); }}
              data-testid={`button-stores-${product.id}`}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-primary/30 bg-primary/5 px-2.5 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <StoreIcon className="h-3.5 w-3.5" /> เทียบราคาแต่ละร้าน
            </button>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordClick(product.id)}
              data-testid={`button-buy-direct-${product.id}`}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-2.5 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:opacity-95 active:scale-95 shadow-xs"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> ซื้อที่ {product.affiliatePlatform} <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
          </div>

          <button
            type="button"
            aria-pressed={selected}
            onClick={() => toggleCompare(product.id)}
            data-testid={`button-compare-${product.id}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
              selected ? 'border-primary bg-primary/15 text-primary' : 'border-input bg-background/50 hover:bg-secondary text-muted-foreground'
            }`}
          >
            {selected ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
            {selected ? 'เลือกเทียบสเปกแล้ว' : '+ เลือกเทียบสเปก'}
          </button>
        </div>
      </div>
    </article>
  );
}

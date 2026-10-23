import { Check, Coins, ExternalLink, Plus, ShoppingBag, Star, Store as StoreIcon, Truck } from 'lucide-react';
import { ProductArt } from '@/components/product-art';
import { calcCommission, thb } from '@/lib/search';
import { CATEGORY_LABEL, highlightsOf } from '@/lib/seed';
import type { Product } from '@/lib/types';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const commAmount = calcCommission(product);
  const lowestStore = product.storeOffers?.find((s) => s.badge === 'ราคาถูกที่สุด') ?? product.storeOffers?.[0];

  return (
    <article
      data-testid={`card-product-${product.id}`}
      className="anim-rise group flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <ProductArt product={product} className="h-full w-full" />
        {product.discountPercent > 0 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-md">
            {product.dealBadge ?? `ลด ${product.discountPercent}%`}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 backdrop-blur-xs px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
          {CATEGORY_LABEL[product.category] ?? product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1">
            <span className="flex items-center font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 inline mr-0.5" />
              {product.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({product.reviewCount.toLocaleString('th-TH')} รีวิว)</span>
          </div>
          <h3 className="text-base font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-baseline justify-between gap-2 border-b border-border/50 pb-2.5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-primary">
                {thb(product.price)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-300">
              <Coins className="h-3 w-3 text-amber-500" />
              <span>คอม {product.commissionRate}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">~{thb(commAmount)}/ชิ้น</p>
          </div>
        </div>

        <ul className="space-y-1 text-xs text-foreground/85">
          {highlightsOf(product).map((h: string) => (
            <li key={h} className="flex gap-1.5 items-center">
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span className="line-clamp-1">{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <a
            href={product.affiliateUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-2.5 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:opacity-95 active:scale-95 shadow-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> ซื้อสินค้า <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

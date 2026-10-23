import { ExternalLink, Flame, GitCompareArrows, ShoppingBag, Star, Store as StoreIcon, Trash2, Truck, X } from 'lucide-react';
import { Link } from 'wouter';
import { ProductArt } from '@/components/product-art';
import { calcCommission, thb } from '@/lib/search';
import { CATEGORY_LABEL, FEATURES, PRODUCT_BY_ID, STORE_BY_ID } from '@/lib/seed';
import { useStore } from '@/lib/store';
import { useDocMeta } from '@/lib/use-doc-meta';

export default function Compare() {
  useDocMeta('เทียบสินค้า — ช้อปชัด', 'เปรียบเทียบราคาสินค้า สเปก ส่วนลด รีวิว คะแนน ค่าจัดส่ง และร้านค้าที่จำหน่ายได้สูงสุด 3 ชิ้น');
  const { state, removeCompare, clearCompare, openPurchase, recordClick } = useStore();
  const items = state.compare.map((id) => PRODUCT_BY_ID[id]).filter(Boolean);

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border-2 border-dashed border-input p-10 text-center" data-testid="empty-compare">
        <GitCompareArrows className="mb-3 h-12 w-12 text-primary" aria-hidden="true" />
        <h1 className="font-display text-2xl font-bold">ยังไม่ได้เลือกสินค้าเพื่อเทียบ</h1>
        <p className="mb-5 mt-1 text-muted-foreground">กดปุ่ม เทียบ บนการ์ดสินค้า สามารถเปรียบเทียบได้พร้อมกันสูงสุด 3 ชิ้น</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground" data-testid="link-back-search">
            ไปค้นหาสินค้า
          </Link>
          <Link href="/deals" className="rounded-xl border border-input bg-card px-5 py-2.5 font-medium hover:bg-secondary">
            ดูดีลลดราคา
          </Link>
        </div>
      </div>
    );
  }

  const specLabels = Array.from(new Set(items.flatMap((p) => p.specs.map((s) => s.label))));
  const cheapest = Math.min(...items.map((p) => p.price));
  const featureRows = FEATURES.filter((f) => items.some((p) => p.features.includes(f.key)));
  const th = 'bg-secondary/60 px-4 py-3.5 text-left text-sm font-semibold text-foreground align-top';
  const td = 'px-4 py-3.5 text-sm align-top';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">เปรียบเทียบสินค้า ({items.length}/3)</h1>
          <p className="text-sm text-muted-foreground">เปรียบเทียบสเปก ราคา ส่วนลด ค่าส่ง คะแนนรีวิว และข้อเสนอจากทุกร้านค้า</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCompare}
            data-testid="button-clear-compare"
            className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> ล้างทั้งหมด
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-card-border bg-card shadow-sm">
        <table className="w-full min-w-[700px] border-collapse">
          <caption className="sr-only">ตารางเปรียบเทียบสินค้าและราคา</caption>
          <thead>
            <tr>
              <th scope="col" className={`${th} w-1/5`}>สินค้า</th>
              {items.map((p) => (
                <th key={p.id} scope="col" className="p-4 text-left align-top font-normal" data-testid={`col-compare-${p.id}`}>
                  <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                    <ProductArt product={p} className="h-full w-full object-cover" />
                    {p.discountPercent > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white shadow">
                        {p.dealBadge ?? `ลด ${p.discountPercent}%`}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-base leading-snug line-clamp-2">{p.name}</p>
                  
                  {/* Rating */}
                  <div className="mt-1.5 flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-bold text-foreground">{p.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({p.reviewCount.toLocaleString('th-TH')} รีวิว)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCompare(p.id)}
                    data-testid={`button-remove-${p.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-destructive hover:underline font-medium"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" /> เอาออกจากการเทียบ
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {/* Price & Savings */}
            <tr>
              <th scope="row" className={th}>ราคาพิเศษ</th>
              {items.map((p) => (
                <td key={p.id} className={td}>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-black text-rose-600 dark:text-rose-400">
                        {thb(p.price)}
                      </span>
                      {p.originalPrice > p.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {thb(p.originalPrice)}
                        </span>
                      )}
                    </div>
                    {p.price === cheapest && items.length > 1 && (
                      <span className="mt-1 inline-block w-fit rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        ⭐ ราคาถูกที่สุดในชุดนี้
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Shipping */}
            <tr>
              <th scope="row" className={th}>การจัดส่ง & ค่าส่ง</th>
              {items.map((p) => (
                <td key={p.id} className={td}>
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    <span className={p.shippingFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                      {p.shippingText}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    ระยะเวลาประมาณ: {p.shippingEstimate}
                  </div>
                </td>
              ))}
            </tr>

            {/* Store Price Comparison breakdown */}
            <tr>
              <th scope="row" className={th}>เปรียบเทียบแต่ละร้าน</th>
              {items.map((p) => (
                <td key={p.id} className={td}>
                  <div className="space-y-1.5">
                    {p.storeOffers && p.storeOffers.length > 0 ? (
                      p.storeOffers.map((offer) => (
                        <a
                          key={offer.id ?? offer.storeId}
                          href={offer.url ?? offer.affiliateUrl ?? p.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-2 py-1 text-xs hover:border-primary transition-colors"
                        >
                          <span className="truncate font-medium">{offer.storeName}</span>
                          <span className="font-bold tabular-nums ml-2">{thb(offer.price)}</span>
                        </a>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">ไม่มีข้อมูลร้านเพิ่มเติม</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Platform & Commission */}
            <tr>
              <th scope="row" className={th}>แพลตฟอร์มหลัก</th>
              {items.map((p) => (
                <td key={p.id} className={td}>
                  <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {p.affiliatePlatform}
                  </span>
                  <div className="mt-1 text-xs text-muted-foreground">
                    ค่าคอมมิชชั่น: <strong className="text-emerald-700 dark:text-emerald-400">{p.commissionRate}%</strong> (~{thb(calcCommission(p))})
                  </div>
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <th scope="row" className={th}>หมวดหมู่</th>
              {items.map((p) => (
                <td key={p.id} className={td}>
                  <span className="font-medium">{CATEGORY_LABEL[p.category]}</span>
                </td>
              ))}
            </tr>

            {/* Specs */}
            {specLabels.map((l) => (
              <tr key={l}>
                <th scope="row" className={th}>{l}</th>
                {items.map((p) => (
                  <td key={p.id} className={td}>
                    {p.specs.find((s) => s.label === l)?.value ?? <span className="text-muted-foreground">ไม่มีข้อมูล</span>}
                  </td>
                ))}
              </tr>
            ))}

            {/* Features */}
            {featureRows.map((f) => (
              <tr key={f.key}>
                <th scope="row" className={th}>{f.label}</th>
                {items.map((p) => (
                  <td key={p.id} className={td}>
                    {p.features.includes(f.key) ? (
                      <span className="font-semibold text-emerald-600">✓ มี</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Direct purchase & store comparison actions */}
            <tr>
              <th scope="row" className={th}>สั่งซื้อ / เช็คราคา</th>
              {items.map((p) => {
                const lowest = p.storeOffers?.find((s) => s.badge === 'ราคาถูกที่สุด') ?? p.storeOffers?.[0];
                return (
                  <td key={p.id} className={td}>
                    <div className="space-y-2">
                      <a
                        href={lowest?.url ?? lowest?.affiliateUrl ?? p.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition-colors"
                        data-testid={`button-direct-buy-${p.id}`}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" /> ซื้อทันที {lowest ? `(${lowest.storeName})` : ''}
                      </a>
                      <button
                        type="button"
                        onClick={() => { recordClick(p.id); openPurchase(p); }}
                        data-testid={`button-buy-compare-${p.id}`}
                        className="flex w-full items-center justify-center gap-1 rounded-xl border border-input bg-card px-3 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
                      >
                        <StoreIcon className="h-3.5 w-3.5 text-primary" /> ดูตารางเทียบทุกร้าน
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import {
  CATEGORIES,
  CATEGORY_MAP,
  LICENSE_LABELS,
  type CategoryId,
  type DigitalFile,
} from '@/lib/types';
import { ProductDetailModal } from '@/components/product-detail-modal';

export default function Home() {
  const { files, activeCategory, setActiveCategory, searchQuery, setSearchQuery, buyFile, hasPurchased } = useStore();
  const [selectedFileForPurchase, setSelectedFileForPurchase] = useState<DigitalFile | null>(null);
  const [selectedDetailFile, setSelectedDetailFile] = useState<DigitalFile | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<'review' | 'success'>('review');

  // Filter files by active category and search keyword
  const filteredFiles = files.filter((file) => {
    const matchesCategory = activeCategory === 'all' || file.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      file.title.toLowerCase().includes(q) ||
      file.description.toLowerCase().includes(q) ||
      file.fileFormat.toLowerCase().includes(q) ||
      file.sellerName.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (catId: CategoryId) => {
    return files.filter((f) => f.category === catId).length;
  };

  const handleOpenPurchase = (file: DigitalFile) => {
    setSelectedFileForPurchase(file);
    setPurchaseStep('review');
  };

  const handleConfirmPurchase = () => {
    if (!selectedFileForPurchase) return;
    buyFile(selectedFileForPurchase);
    setPurchaseStep('success');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-1 pb-2">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight text-balance">
          ศูนย์รวมไฟล์ดิจิทัล ซื้อขายสะดวก สิทธิ์ชัดเจน
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
          ดาวน์โหลดไฟล์ต้นฉบับคุณภาพสูงจากผู้สร้าง ทั้งดนตรี ภาพถ่าย งานวาด ข้อสอบ อีบุ๊ก และแบบบ้าน พร้อมส่งมอบไฟล์ทันที
        </p>

        {/* Search Bar */}
        <div className="mt-4 flex max-w-xl mx-auto items-center rounded-2xl border border-input bg-card shadow-sm px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อไฟล์, นามสกุล เช่น PDF, MP3, DWG หรือผู้สร้าง..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-md hover:bg-secondary transition-colors"
            >
              ล้างค้นหา
            </button>
          )}
        </div>
      </section>

      {/* 6 Categories Section (Card Grid) */}
      <section aria-labelledby="categories-heading" className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 id="categories-heading" className="font-display text-2xl font-bold tracking-tight text-foreground">
              หมวดหมู่สินค้า
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              เลือกดูผลงานตามประเภทไฟล์ แตะการ์ดใดก็ได้เพื่อเปลี่ยนสีธีมทั้งแอปเป็นสีประจำการ์ดนั้น
            </p>
          </div>
          {activeCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 bg-secondary/80 px-2.5 py-1.5 rounded-xl border border-border/60"
            >
              <span>รีเซ็ตสี & ดูทุกหมวด ({files.length})</span>
            </button>
          )}
        </div>

        {/* Category Cards with Real Images & Category Theme Glow */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(isSelected ? 'all' : cat.id);
                  document.getElementById('files-catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative flex flex-col text-left overflow-hidden rounded-2xl border bg-card/95 transition-all duration-300 hover:-translate-y-1 ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-2xl scale-[1.02]'
                    : 'border-border/80 hover:border-border shadow-xs hover:shadow-lg'
                }`}
                style={{
                  borderColor: isSelected ? cat.colorId : undefined,
                  boxShadow: isSelected ? `0 0 25px ${cat.colorId}50` : undefined,
                }}
              >
                {/* Real Category Photo Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = `/images/${cat.image.split('/').pop()}`;
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.accentColor} opacity-70`} />

                  {/* Visual Color Dot Badge (No text numbers) */}
                  <div
                    className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-slate-950/85 px-2.5 py-1 backdrop-blur-md border shadow-sm"
                    style={{ borderColor: `${cat.colorId}60` }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: cat.colorId,
                        boxShadow: `0 0 10px ${cat.colorId}`,
                      }}
                    />
                    <span className="text-[10px] font-semibold text-white/95">
                      สีประจำหมวด
                    </span>
                  </div>

                  {/* File Count Badge on Bottom Right */}
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold text-white/95 bg-slate-950/85 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                    {count} ไฟล์
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: cat.colorId,
                            boxShadow: `0 0 8px ${cat.colorId}`,
                          }}
                        />
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: cat.colorId }}
                        >
                          {isSelected ? 'กำลังใช้ธีมสีนี้' : 'แตะเพื่อเปลี่ยนธีม'}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {cat.fileExtensions[0]}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-mono text-[10px]">
                      {cat.fileExtensions.slice(0, 3).join(' ')}
                    </span>
                    <span
                      className="text-xs font-semibold group-hover:translate-x-0.5 transition-transform"
                      style={{ color: cat.colorId }}
                    >
                      {isSelected ? '✓ ธีมนี้ใช้งานอยู่' : 'เลือกดู & เปลี่ยนธีม →'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Files Catalog Section */}
      <section id="files-catalog" aria-labelledby="catalog-heading" className="space-y-6 pt-4">
        {/* Filter Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              ทั้งหมด ({files.length})
            </button>
            {CATEGORIES.map((c) => {
              const count = getCategoryCount(c.id);
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: c.colorId }}
                  />
                  <span>{c.name}</span>
                  {count > 0 && <span className="opacity-80">({count})</span>}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground">
            <span>
              แสดง {filteredFiles.length} รายการ
              {activeCategory !== 'all' && ` ในหมวด ${CATEGORY_MAP[activeCategory]?.name}`}
            </span>
            <Link
              href="/deals"
              className="text-primary font-semibold hover:underline"
            >
              ดูในหน้าร้านค้า →
            </Link>
          </div>
        </div>

        {/* Files Grid / Empty State */}
        {filteredFiles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 sm:p-14 text-center">
            <div className="mx-auto h-16 w-16 overflow-hidden rounded-2xl border border-primary/40 p-1 mb-4">
              <img
                src={
                  activeCategory !== 'all'
                    ? CATEGORY_MAP[activeCategory]?.image
                    : CATEGORIES[0].image
                }
                alt="Category preview"
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {activeCategory !== 'all'
                ? `ยังไม่มีไฟล์ในหมวดหมู่ "${CATEGORY_MAP[activeCategory]?.name}"`
                : 'ยังไม่มีไฟล์ดิจิทัลในระบบ'}
            </h3>
            <p className="mt-1.5 max-w-md mx-auto text-sm text-muted-foreground">
              {activeCategory !== 'all'
                ? `คุณสามารถเป็นผู้สร้างคนแรกที่ลงขายไฟล์ในหมวดหมู่นี้ได้ง่ายๆ ที่หน้าลงขายไฟล์`
                : 'เริ่มต้นลงขายผลงานชิ้นแรกของคุณ ผลงานที่เปิดขายจะถูกจัดหมวดหมู่อัตโนมัติ'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 active:scale-95 transition-all"
              >
                <span>ไปที่หน้าลงขายไฟล์</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {filteredFiles.map((file) => {
              const cat = CATEGORY_MAP[file.category];
              const owned = hasPurchased(file.id);

              return (
                <article
                  key={file.id}
                  onClick={() => setSelectedDetailFile(file)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {/* File Thumbnail with Watermark Hint */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={file.previewUrl || cat?.image || CATEGORIES[0].image}
                      alt={file.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const fallback = cat?.image || CATEGORIES[0].image;
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Watermark Mini Indicator Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors pointer-events-none flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl bg-black/80 backdrop-blur-xs px-3 py-1.5 text-xs font-bold text-amber-300 border border-white/20 shadow-md">
                        🔒 แตะเพื่อดูลายน้ำ & รายละเอียด
                      </span>
                    </div>

                    {/* Category Label with Color ID Dot */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-black/75 backdrop-blur-xs px-2 py-1 text-xs font-medium text-white">
                      {cat && (
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat.colorId }}
                        />
                      )}
                      <span>{cat?.name ?? file.category}</span>
                    </div>

                    {/* Format Badge */}
                    <span className="absolute top-2.5 right-2.5 rounded-lg bg-slate-950/85 backdrop-blur-xs px-2 py-0.5 font-mono text-xs font-bold text-white border border-white/10 shadow-xs">
                      .{file.fileFormat.toUpperCase()}
                    </span>
                  </div>

                  {/* Content Details */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {file.title}
                      </h4>
                      <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {file.description}
                      </p>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
                      <span>ขนาด {file.fileSize}</span>
                      <span aria-hidden="true">·</span>
                      <span>โดย {file.sellerName}</span>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/60">
                      <div>
                        <span className="font-display text-base sm:text-lg font-bold text-primary">
                          {file.price === 0 ? 'ฟรี (0 บาท)' : `฿${file.price.toLocaleString('th-TH')}`}
                        </span>
                      </div>

                      {owned ? (
                        <Link
                          href="/profile"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center rounded-xl bg-emerald-600/15 text-emerald-400 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600/25 transition-colors border border-emerald-500/30"
                        >
                          ดู LINE ในโปรไฟล์
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDetailFile(file);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl border border-input bg-background hover:bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors"
                            title="ดูตัวอย่างสินค้าพร้อมลายน้ำ"
                          >
                            <span>👁️</span>
                            <span className="hidden sm:inline">ดูลายน้ำ</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPurchase(file);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#06C755] text-white px-3 py-1.5 text-xs font-semibold shadow-xs hover:bg-[#05b34c] active:scale-95 transition-all"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            <span>สั่งซื้อทาง LINE</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Watermarked Product Detail Modal */}
      <ProductDetailModal
        file={selectedDetailFile}
        onClose={() => setSelectedDetailFile(null)}
        onProceedPurchase={(file) => {
          setSelectedDetailFile(null);
          handleOpenPurchase(file);
        }}
      />

      {/* LINE Purchase & Contact Dialog Modal */}
      {selectedFileForPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl relative anim-rise max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedFileForPurchase(null)}
              className="absolute top-4 right-4 text-xs font-medium text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-secondary"
            >
              ปิด (✕)
            </button>

            {purchaseStep === 'review' ? (
              <div className="space-y-4">
                {/* Header with LINE Badge */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#06C755]/15 border border-[#06C755]/40 px-3 py-0.5 text-xs font-bold text-[#06C755] mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#06C755]" />
                    <span>ชำระเงินและรับไฟล์ทาง LINE เท่านั้น</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    ติดต่อสั่งซื้อไฟล์กับผู้ขาย
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ระบบจะให้คุณติดต่อผู้ขายโดยตรงผ่าน LINE เพื่อโอนเงินและรับไฟล์ต้นฉบับ
                  </p>
                </div>

                {/* File Details Summary */}
                <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-3.5">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 shrink-0 bg-slate-950">
                    <img
                      src={
                        selectedFileForPurchase.previewUrl ||
                        CATEGORY_MAP[selectedFileForPurchase.category]?.image ||
                        CATEGORIES[0].image
                      }
                      alt="Thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {CATEGORY_MAP[selectedFileForPurchase.category] && (
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: CATEGORY_MAP[selectedFileForPurchase.category].colorId,
                          }}
                        />
                      )}
                      <span>หมวด {CATEGORY_MAP[selectedFileForPurchase.category]?.name}</span>
                      <span>·</span>
                      <span className="font-mono">.{selectedFileForPurchase.fileFormat.toUpperCase()}</span>
                      <span>·</span>
                      <span>{selectedFileForPurchase.fileSize}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground truncate mt-0.5">
                      {selectedFileForPurchase.title}
                    </h4>
                    <div className="font-display text-base font-bold text-primary mt-0.5">
                      {selectedFileForPurchase.price === 0
                        ? 'แจกฟรี'
                        : `฿${selectedFileForPurchase.price.toLocaleString('th-TH')}`}
                    </div>
                  </div>
                </div>

                {/* Seller LINE Contact Card */}
                <div className="rounded-2xl border-2 border-[#06C755]/40 bg-[#06C755]/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">ผู้ขายผลงานชิ้นนี้:</span>
                      <span className="font-bold text-foreground text-sm">
                        {selectedFileForPurchase.sellerName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-muted-foreground block">LINE ID ผู้ขาย:</span>
                      <span className="font-mono text-base font-bold text-[#06C755]">
                        {selectedFileForPurchase.sellerLineId || '@shopshud_seller'}
                      </span>
                    </div>
                  </div>

                  {/* Pre-written Message Box */}
                  <div className="rounded-xl bg-background/90 border border-input p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-muted-foreground text-[11px]">
                        ข้อความสั่งซื้อที่เตรียมให้:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const msg = `สวัสดีครับ สนใจสั่งซื้อไฟล์ "${selectedFileForPurchase.title}" (${selectedFileForPurchase.fileFormat.toUpperCase()}) ราคา ${selectedFileForPurchase.price} บาท รหัส #${selectedFileForPurchase.id.slice(-6)} จาก SHOPSHUD ครับ`;
                          navigator.clipboard.writeText(msg);
                          alert('คัดลอกข้อความสั่งซื้อเรียบร้อย! สามารถนำไปวางในแชท LINE ได้ทันที');
                        }}
                        className="text-[11px] font-semibold text-[#06C755] hover:underline px-2 py-0.5 rounded bg-[#06C755]/10"
                      >
                        คัดลอกข้อความ
                      </button>
                    </div>
                    <p className="text-muted-foreground font-mono text-[11px] bg-secondary/50 p-2 rounded-lg leading-relaxed select-all">
                      "สวัสดีครับ สนใจสั่งซื้อไฟล์ "{selectedFileForPurchase.title}" ({selectedFileForPurchase.fileFormat.toUpperCase()}) ราคา {selectedFileForPurchase.price} บาท รหัส #{selectedFileForPurchase.id.slice(-6)} จาก SHOPSHUD ครับ"
                    </p>
                  </div>

                  {/* 3 Steps Guide */}
                  <div className="text-[11px] text-muted-foreground space-y-1 pt-1">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#06C755]">1.</span>
                      <span>กดปุ่มเปิดแชท LINE ด้านล่าง หรือเพิ่มเพื่อนด้วย LINE ID</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#06C755]">2.</span>
                      <span>ส่งข้อความสั่งซื้อและชำระเงินตรงกับผู้ขายผ่าน LINE</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#06C755]">3.</span>
                      <span>ผู้ขายจะส่งไฟล์ต้นฉบับให้คุณดาวน์โหลดผ่านแชท LINE ทันที</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={`https://line.me/R/ti/p/~${(selectedFileForPurchase.sellerLineId || '@shopshud_seller').replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleConfirmPurchase}
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#06C755] text-white py-3 px-4 text-sm font-bold shadow-md hover:bg-[#05b34c] active:scale-98 transition-all text-center"
                  >
                    <span>เปิดแชท LINE เพื่อซื้อไฟล์</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const lineId = (selectedFileForPurchase.sellerLineId || '@shopshud_seller').replace('@', '');
                      navigator.clipboard.writeText(lineId);
                      alert(`คัดลอก LINE ID: ${lineId} เรียบร้อย! นำไปค้นหาในแอป LINE ได้เลย`);
                      handleConfirmPurchase();
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-input bg-card py-3 px-4 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    <span>คัดลอก LINE ID</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#06C755]/20 text-[#06C755] font-bold text-2xl border border-[#06C755]/40">
                  ✓
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  บันทึกข้อมูลการสั่งซื้อแล้ว!
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  รายการนี้ถูกบันทึกไว้ในหน้าโปรไฟล์ของคุณแล้ว คุณสามารถติดต่อผู้ขายทาง LINE ({selectedFileForPurchase.sellerLineId || '@shopshud_seller'}) เพื่อชำระเงินและรับไฟล์ได้ตลอดเวลา
                </p>

                <div className="pt-3 flex flex-col gap-2.5">
                  <a
                    href={`https://line.me/R/ti/p/~${(selectedFileForPurchase.sellerLineId || '@shopshud_seller').replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-[#06C755] text-white px-4 py-2.5 text-sm font-semibold shadow-xs hover:bg-[#05b34c] transition-colors"
                  >
                    <span>เปิดห้องแชท LINE กับผู้ขายตอนนี้</span>
                  </a>

                  <Link
                    href="/profile"
                    onClick={() => setSelectedFileForPurchase(null)}
                    className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    <span>ไปที่หน้าโปรไฟล์ (ดูรายการที่ติดต่อไว้)</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

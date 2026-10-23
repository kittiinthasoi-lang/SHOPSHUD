import { useState, useMemo } from 'react';
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

export default function DealsPage() {
  const { files, buyFile, hasPurchased, activeCategory, setActiveCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');

  // Purchase Modal State
  const [selectedFile, setSelectedFile] = useState<DigitalFile | null>(null);
  const [selectedDetailFile, setSelectedDetailFile] = useState<DigitalFile | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let result = files.filter((file) => {
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

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [files, activeCategory, searchQuery, sortBy]);

  const handleOpenPurchase = (file: DigitalFile) => {
    setSelectedFile(file);
    setIsSuccess(false);
  };

  const handleConfirmPurchase = () => {
    if (!selectedFile) return;
    buyFile(selectedFile);
    setIsSuccess(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-[#071126] via-[#0b2450] to-[#061020] p-6 sm:p-8">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              ตลาดไฟล์ดิจิทัลลิขสิทธิ์แท้
            </div>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              ร้านค้าผลงานดิจิทัล
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              ค้นหาและเลือกซื้อไฟล์คุณภาพสูง ทั้งเพลง รูปภาพ งานวาด ข้อสอบ อีบุ๊ก และแบบบ้าน พร้อมสิทธิ์การใช้งานที่ชัดเจน
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/store"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              + ลงขายไฟล์ของคุณ
            </Link>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อไฟล์, ผู้สร้าง, นามสกุล เช่น MP3, PDF, DWG..."
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ล้าง
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground whitespace-nowrap">เรียงตาม:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="newest">ไฟล์ล่าสุด</option>
              <option value="popular">ยอดดาวน์โหลดสูงสุด</option>
              <option value="price-asc">ราคา: ต่ำไปสูง</option>
              <option value="price-desc">ราคา: สูงไปต่ำ</option>
            </select>
          </div>
        </div>

        {/* Category Pills with Color ID indicators */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            ทุกหมวดหมู่ ({files.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = files.filter((f) => f.category === cat.id).length;
            const active = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                  active
                    ? 'border-transparent bg-primary text-primary-foreground shadow-sm ring-1 ring-primary'
                    : 'border-border/60 bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: cat.colorId }}
                />
                <span>{cat.name}</span>
                <span className="font-mono text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Catalog Results */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center gap-2">
            <span>แสดงผล {filteredAndSortedFiles.length} รายการ</span>
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_MAP[activeCategory]?.colorId }}
                />
                หมวด {CATEGORY_MAP[activeCategory]?.name}
              </span>
            )}
          </p>
        </div>

        {filteredAndSortedFiles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-muted-foreground mb-4">
              #0
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {files.length === 0 ? 'ยังไม่มีไฟล์ดิจิทัลที่ลงขาย' : 'ไม่พบไฟล์ที่ตรงกับเงื่อนไขการค้นหา'}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              {files.length === 0
                ? 'เริ่มต้นลงขายผลงานชิ้นแรกของคุณในหมวดหมู่ที่ต้องการ ไฟล์จะแสดงที่นี่และหน้าแรกทันที'
                : 'ลองเปลี่ยนคำค้นหา หรือเลือกดูทุกหมวดหมู่'}
            </p>
            <div className="mt-5">
              <Link
                href="/store"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
              >
                ลงขายไฟล์ดิจิทัลทันที
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {filteredAndSortedFiles.map((file) => {
              const cat = CATEGORY_MAP[file.category];
              const owned = hasPurchased(file.id);
              const previewSrc = file.previewUrl || cat?.image || CATEGORIES[0].image;

              return (
                <article
                  key={file.id}
                  onClick={() => setSelectedDetailFile(file)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {/* Photo Cover */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={previewSrc}
                      alt={file.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (cat?.image && e.currentTarget.src !== cat.image) {
                          e.currentTarget.src = cat.image;
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

                    {/* Color ID & Category Tag */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-black/80 backdrop-blur-xs px-2 py-1 text-xs font-medium text-white border border-white/10">
                      {cat && (
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: cat.colorId,
                            boxShadow: `0 0 8px ${cat.colorId}`,
                          }}
                        />
                      )}
                      <span>{cat?.name ?? file.category}</span>
                    </div>

                    {/* Format Badge */}
                    <span className="absolute top-2.5 right-2.5 rounded-lg bg-slate-950/85 backdrop-blur-xs px-2 py-0.5 font-mono text-[11px] font-bold text-white border border-white/10 shadow-xs">
                      .{file.fileFormat.toUpperCase()}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 gap-2">
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {file.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {file.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                      <span>ขนาด: {file.fileSize}</span>
                      <span>โดย: {file.sellerName}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60 mt-auto">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">ราคา</span>
                        <span className="font-display text-base font-bold text-primary">
                          {file.price === 0 ? 'ฟรี' : `฿${file.price.toLocaleString('th-TH')}`}
                        </span>
                      </div>

                      {owned ? (
                        <Link
                          href="/profile"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-colors"
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
                            className="inline-flex items-center gap-1 rounded-xl border border-input bg-background hover:bg-secondary px-2 py-1.5 text-xs font-semibold text-foreground transition-colors"
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
                            <span>สั่งซื้อ LINE</span>
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

      {/* LINE Purchase & Contact Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto anim-rise">
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="absolute top-4 right-4 text-xs font-medium text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-secondary"
            >
              ✕ ปิด
            </button>

            {isSuccess ? (
              <div className="space-y-5 text-center py-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#06C755]/15 text-[#06C755] text-3xl font-bold border border-[#06C755]/30">
                  ✓
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    บันทึกข้อมูลการสั่งซื้อสำเร็จ!
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    ระบบได้บันทึกรายการนี้ไว้ในหน้าโปรไฟล์ของคุณแล้ว คุณสามารถติดต่อผู้ขายทาง LINE ({selectedFile.sellerLineId || '@shopshud_seller'}) เพื่อชำระเงินและรับมอบไฟล์ต้นฉบับได้ทันที
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/50 p-4 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ผลงาน:</span>
                    <span className="font-semibold text-foreground">{selectedFile.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ผู้สร้าง:</span>
                    <span className="font-semibold text-foreground">{selectedFile.sellerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">LINE ID ผู้ขาย:</span>
                    <span className="font-mono font-bold text-[#06C755]">{selectedFile.sellerLineId || '@shopshud_seller'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ยอดเงินที่ต้องชำระ:</span>
                    <span className="font-bold text-primary">{selectedFile.price === 0 ? 'ฟรี' : `฿${selectedFile.price.toLocaleString('th-TH')}`}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <a
                    href={`https://line.me/R/ti/p/~${(selectedFile.sellerLineId || '@shopshud_seller').replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-[#06C755] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:bg-[#05b34c] transition-all"
                  >
                    เปิดห้องแชท LINE กับผู้ขายตอนนี้
                  </a>
                  <Link
                    href="/profile"
                    onClick={() => setSelectedFile(null)}
                    className="inline-flex items-center justify-center rounded-xl border border-input bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ไปที่หน้าโปรไฟล์ (ดูรายการที่ติดต่อไว้)
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header Badge */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#06C755]/15 border border-[#06C755]/40 px-3 py-0.5 text-xs font-bold text-[#06C755] mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#06C755]" />
                    <span>ชำระเงินและรับไฟล์ทาง LINE เท่านั้น</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    ติดต่อสั่งซื้อไฟล์กับผู้ขาย
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ติดต่อผู้ขายโดยตรงผ่านแอป LINE เพื่อตกลงชำระเงินและรับไฟล์ต้นฉบับ
                  </p>
                </div>

                {/* File Details */}
                <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-3.5">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 shrink-0 bg-slate-950">
                    <img
                      src={selectedFile.previewUrl || CATEGORY_MAP[selectedFile.category]?.image || CATEGORIES[0].image}
                      alt={selectedFile.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_MAP[selectedFile.category]?.colorId }}
                      />
                      <span>หมวด {CATEGORY_MAP[selectedFile.category]?.name}</span>
                      <span>·</span>
                      <span className="font-mono">.{selectedFile.fileFormat}</span>
                      <span>·</span>
                      <span>{selectedFile.fileSize}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground truncate mt-0.5">
                      {selectedFile.title}
                    </h4>
                    <div className="font-display text-base font-bold text-primary mt-0.5">
                      {selectedFile.price === 0 ? 'แจกฟรี' : `฿${selectedFile.price.toLocaleString('th-TH')}`}
                    </div>
                  </div>
                </div>

                {/* Seller LINE Card */}
                <div className="rounded-2xl border-2 border-[#06C755]/40 bg-[#06C755]/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">ผู้ขายผลงาน:</span>
                      <span className="font-bold text-foreground text-sm">
                        {selectedFile.sellerName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-muted-foreground block">LINE ID ผู้ขาย:</span>
                      <span className="font-mono text-base font-bold text-[#06C755]">
                        {selectedFile.sellerLineId || '@shopshud_seller'}
                      </span>
                    </div>
                  </div>

                  {/* Pre-written Message */}
                  <div className="rounded-xl bg-background/90 border border-input p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-muted-foreground text-[11px]">
                        ข้อความสั่งซื้อที่เตรียมให้:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const msg = `สวัสดีครับ สนใจสั่งซื้อไฟล์ "${selectedFile.title}" (${selectedFile.fileFormat}) ราคา ${selectedFile.price} บาท รหัส #${selectedFile.id.slice(-6)} จาก SHOPSHUD ครับ`;
                          navigator.clipboard.writeText(msg);
                          alert('คัดลอกข้อความสั่งซื้อเรียบร้อย! สามารถนำไปวางในแชท LINE ได้ทันที');
                        }}
                        className="text-[11px] font-semibold text-[#06C755] hover:underline px-2 py-0.5 rounded bg-[#06C755]/10"
                      >
                        คัดลอกข้อความ
                      </button>
                    </div>
                    <p className="text-muted-foreground font-mono text-[11px] bg-secondary/50 p-2 rounded-lg leading-relaxed select-all">
                      "สวัสดีครับ สนใจสั่งซื้อไฟล์ "{selectedFile.title}" ({selectedFile.fileFormat}) ราคา {selectedFile.price} บาท รหัส #{selectedFile.id.slice(-6)} จาก SHOPSHUD ครับ"
                    </p>
                  </div>

                  {/* Steps Guide */}
                  <div className="text-[11px] text-muted-foreground space-y-1 pt-1">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#06C755]">1.</span>
                      <span>กดปุ่มเปิดแชท LINE หรือค้นหาด้วย LINE ID ผู้ขาย</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#06C755]">2.</span>
                      <span>ส่งข้อความสั่งซื้อและชำระเงินตรงกับผู้ขายใน LINE</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#06C755]">3.</span>
                      <span>ผู้ขายจะส่งไฟล์ต้นฉบับให้คุณทางแชท LINE ทันที</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={`https://line.me/R/ti/p/~${(selectedFile.sellerLineId || '@shopshud_seller').replace('@', '')}`}
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
                      const lineId = (selectedFile.sellerLineId || '@shopshud_seller').replace('@', '');
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

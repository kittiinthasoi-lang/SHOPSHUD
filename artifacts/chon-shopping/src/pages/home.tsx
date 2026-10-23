import { useState } from 'react';
import {
  BookOpen,
  Check,
  Download,
  FileCheck2,
  FileCode,
  FileText,
  Filter,
  GraduationCap,
  Image as ImageIcon,
  Music,
  Paintbrush,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import {
  CATEGORIES,
  CATEGORY_MAP,
  LICENSE_LABELS,
  type CategoryId,
  type DigitalFile,
} from '@/lib/types';

export default function Home() {
  const { files, activeCategory, setActiveCategory, searchQuery, setSearchQuery, buyFile, hasPurchased } = useStore();
  const [selectedFileForPurchase, setSelectedFileForPurchase] = useState<DigitalFile | null>(null);
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

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'music':
        return <Music className="h-5 w-5" />;
      case 'photo':
        return <ImageIcon className="h-5 w-5" />;
      case 'drawing':
        return <Paintbrush className="h-5 w-5" />;
      case 'exam':
        return <GraduationCap className="h-5 w-5" />;
      case 'ebook':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-2 pb-4">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight text-balance">
          ศูนย์รวมไฟล์ดิจิทัล ซื้อขายสะดวก สิทธิ์ชัดเจน
        </h1>
        <p className="mt-3.5 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
          ดาวน์โหลดไฟล์ต้นฉบับคุณภาพสูงจากผู้สร้าง ทั้งดนตรี ภาพถ่าย งานวาด ข้อสอบ และอีบุ๊ก พร้อมส่งมอบไฟล์ทันที
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex max-w-xl mx-auto items-center rounded-2xl border border-input bg-card shadow-sm px-3.5 py-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
          <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อไฟล์, นามสกุล เช่น PDF, MP3 หรือผู้สร้าง..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label="ล้างการค้นหา"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* 5 Categories Section (Card Grid) */}
      <section aria-labelledby="categories-heading" className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 id="categories-heading" className="font-display text-2xl font-bold tracking-tight text-foreground">
              หมวดหมู่สินค้า
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              เลือกดูผลงานตามประเภทไฟล์ที่คุณต้องการ
            </p>
          </div>
          {activeCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              ดูทุกหมวดหมู่ ({files.length})
            </button>
          )}
        </div>

        {/* 5 Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(isSelected ? 'all' : cat.id);
                  // Smooth scroll to files list
                  document.getElementById('files-catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative flex flex-col text-left overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary bg-card shadow-sm'
                    : 'border-border/80 bg-card hover:border-border'
                }`}
              >
                {/* Image Cover */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.accentColor} opacity-70`} />
                  <div className="absolute top-2.5 left-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-sm">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <span className="absolute bottom-2 right-2.5 text-[11px] font-medium text-white/90 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {count} ไฟล์
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
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
                    <span className="text-primary font-medium group-hover:translate-x-0.5 transition-transform">
                      {isSelected ? 'เลือกอยู่' : 'เลือกดู →'}
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
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === c.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {c.name} {count > 0 && <span className="ml-1 opacity-80">({count})</span>}
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
              href="/store"
              className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>ลงขายในหน้านี้</span>
            </Link>
          </div>
        </div>

        {/* Files Grid / Empty State */}
        {filteredFiles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 sm:p-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <Store className="h-7 w-7" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {activeCategory !== 'all'
                ? `ยังไม่มีไฟล์ในหมวดหมู่ "${CATEGORY_MAP[activeCategory]?.name}"`
                : 'ยังไม่มีไฟล์ดิจิทัลในระบบ'}
            </h3>
            <p className="mt-1.5 max-w-md mx-auto text-sm text-muted-foreground">
              {activeCategory !== 'all'
                ? `คุณสามารถเป็นผู้สร้างคนแรกที่ลงขายไฟล์ในหมวดหมู่นี้ได้ง่ายๆ ที่หน้าร้านค้า`
                : 'เริ่มต้นลงขายผลงานชิ้นแรกของคุณ ไฟล์จะถูกจัดหมวดหมู่อัตโนมัติและแสดงที่หน้าแรกทันที'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 active:scale-95 transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>ไปที่หน้าร้านค้าเพื่อลงขายไฟล์</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => {
              const cat = CATEGORY_MAP[file.category];
              const owned = hasPurchased(file.id);

              return (
                <article
                  key={file.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                >
                  {/* File Thumbnail or Cover */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    {file.previewUrl ? (
                      <img
                        src={file.previewUrl}
                        alt={file.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted p-6">
                        <div className="text-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-2">
                            {getCategoryIcon(file.category)}
                          </span>
                          <span className="font-mono text-xs font-bold text-muted-foreground uppercase">
                            {file.fileFormat} · {file.fileSize}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Category Label */}
                    <span className="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur-xs px-2.5 py-1 text-xs font-medium text-white">
                      {cat?.name ?? file.category}
                    </span>

                    {/* Format Badge */}
                    <span className="absolute top-3 right-3 rounded-lg bg-background/90 backdrop-blur-xs px-2 py-0.5 font-mono text-xs font-bold text-foreground shadow-xs">
                      .{file.fileFormat.toUpperCase()}
                    </span>
                  </div>

                  {/* Content Details */}
                  <div className="p-4 flex flex-col flex-1 gap-2.5">
                    <div>
                      <h4 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {file.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {file.description}
                      </p>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
                      <span>ขนาด {file.fileSize}</span>
                      <span aria-hidden="true">·</span>
                      <span>โดย {file.sellerName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{LICENSE_LABELS[file.licenseType]?.title.split(' ')[0]}</span>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/60">
                      <div>
                        <span className="font-display text-xl font-bold text-primary">
                          {file.price === 0 ? 'ฟรี (0 บาท)' : `฿${file.price.toLocaleString('th-TH')}`}
                        </span>
                      </div>

                      {owned ? (
                        <Link
                          href="/profile"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 text-xs font-semibold hover:bg-emerald-600/20 transition-colors"
                        >
                          <FileCheck2 className="h-3.5 w-3.5" />
                          <span>ดูในโปรไฟล์</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenPurchase(file)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-95 active:scale-95 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>{file.price === 0 ? 'รับไฟล์' : 'สั่งซื้อไฟล์'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Purchase / Download Dialog Modal */}
      {selectedFileForPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl relative anim-rise">
            <button
              type="button"
              onClick={() => setSelectedFileForPurchase(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button>

            {purchaseStep === 'review' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border/80 pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    {getCategoryIcon(selectedFileForPurchase.category)}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      หมวด {CATEGORY_MAP[selectedFileForPurchase.category]?.name}
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                      {selectedFileForPurchase.title}
                    </h3>
                  </div>
                </div>

                <div className="rounded-2xl bg-secondary/50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ชนิดไฟล์:</span>
                    <span className="font-semibold text-foreground">.{selectedFileForPurchase.fileFormat.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ขนาดไฟล์:</span>
                    <span className="font-semibold text-foreground">{selectedFileForPurchase.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ผู้สร้าง:</span>
                    <span className="font-semibold text-foreground">{selectedFileForPurchase.sellerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">สิทธิ์การใช้งาน:</span>
                    <span className="font-semibold text-foreground">
                      {LICENSE_LABELS[selectedFileForPurchase.licenseType]?.title}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p>
                    {LICENSE_LABELS[selectedFileForPurchase.licenseType]?.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <span className="text-xs text-muted-foreground">ยอดรวมชำระ</span>
                    <div className="font-display text-2xl font-bold text-primary">
                      {selectedFileForPurchase.price === 0
                        ? 'ฟรี'
                        : `฿${selectedFileForPurchase.price.toLocaleString('th-TH')}`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmPurchase}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 active:scale-95 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>{selectedFileForPurchase.price === 0 ? 'รับไฟล์ฟรีทันที' : 'ยืนยันสั่งซื้อและรับไฟล์'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600">
                  <Check className="h-8 w-8 stroke-[2.5]" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  ทำรายการสำเร็จเรียบร้อย!
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  ไฟล์ "{selectedFileForPurchase.title}" พร้อมดาวน์โหลดแล้ว และถูกบันทึกไว้ในหน้าโปรไฟล์ของคุณ
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={`#download-${selectedFileForPurchase.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`เริ่มการดาวน์โหลดไฟล์: ${selectedFileForPurchase.title}.${selectedFileForPurchase.fileFormat.toLowerCase()}`);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>ดาวน์โหลดไฟล์ทันที ({selectedFileForPurchase.fileFormat.toUpperCase()})</span>
                  </a>

                  <Link
                    href="/profile"
                    onClick={() => setSelectedFileForPurchase(null)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    <span>ไปที่หน้าโปรไฟล์ (ดูรายการไฟล์ที่ซื้อ)</span>
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

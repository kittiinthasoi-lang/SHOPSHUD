import { useState } from 'react';
import type { DigitalFile } from '@/lib/types';
import { CATEGORY_MAP, LICENSE_LABELS } from '@/lib/types';

interface ProductDetailModalProps {
  file: DigitalFile | null;
  onClose: () => void;
  onProceedPurchase: (file: DigitalFile) => void;
}

export function ProductDetailModal({
  file,
  onClose,
  onProceedPurchase,
}: ProductDetailModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!file) return null;

  const cat = CATEGORY_MAP[file.category];
  const licenseInfo = LICENSE_LABELS[file.licenseType];
  const cleanLine = (file.sellerLineId || '@shopshud_seller').replace('@', '');
  const phone = file.sellerPhone || '081-999-8888';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Toast Notification on copy */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-60 rounded-2xl bg-foreground text-background px-4 py-2.5 shadow-2xl text-xs font-semibold flex items-center gap-2 border border-border">
          <span>✓</span>
          <span>คัดลอก {copied} เรียบร้อยแล้ว!</span>
        </div>
      )}

      <div className="w-full max-w-2xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/80 bg-secondary/30 shrink-0">
          <div className="flex items-center gap-2">
            {cat && (
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: cat.colorId,
                  boxShadow: `0 0 10px ${cat.colorId}`,
                }}
              />
            )}
            <span className="text-xs font-semibold text-foreground">
              {cat?.name ?? file.category}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              .{file.fileFormat.toUpperCase()}
            </span>
            <span className="hidden sm:inline-block text-[11px] text-muted-foreground">
              ขนาด {file.fileSize}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary text-sm font-semibold transition-colors"
            title="ปิดหน้าต่าง"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <h2
                id="product-modal-title"
                className="font-display text-xl sm:text-2xl font-bold text-foreground leading-snug"
              >
                {file.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>เจ้าของความคิด: <strong className="text-foreground">{file.sellerName}</strong></span>
                <span>·</span>
                <span className="font-mono text-[#06C755] font-semibold">LINE: {file.sellerLineId}</span>
                <span>·</span>
                <span className="font-mono text-blue-400 font-semibold">โทร: {phone}</span>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                {file.price === 0 ? 'ฟรี (0 บาท)' : `฿${file.price.toLocaleString('th-TH')}`}
              </div>
              <span className="text-[11px] text-muted-foreground">
                สิทธิ์: {licenseInfo?.title ? licenseInfo.title.split(' ')[0] : 'ลิขสิทธิ์แท้'}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* WATERMARKED PRODUCT PREVIEW (ตัวอย่างสินค้าพร้อมลายน้ำปิดไว้ไม่ให้เห็นทั้งหมด) */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <span>🛡️</span>
                <span>ตัวอย่างสินค้า (มีลายน้ำคุ้มครองลิขสิทธิ์)</span>
              </span>
              <span className="text-[11px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                🔒 มีลายน้ำปิดทับ ป้องกันการละเมิด
              </span>
            </div>

            {/* Visual Sample with Repeating Diagonal Watermark Grid */}
            <div className="relative aspect-video sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border bg-slate-950 shadow-inner group">
              <img
                src={file.previewUrl || cat?.image || ''}
                alt={file.title}
                className="h-full w-full object-cover select-none filter contrast-90 brightness-90"
              />

              {/* Watermark Diagonal Repeating Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-around py-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="whitespace-nowrap text-white/30 text-xs sm:text-sm font-mono font-bold tracking-[0.25em] uppercase -rotate-12 transform -translate-x-8 sm:-translate-x-12 drop-shadow-md select-none"
                    style={{
                      textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.4)',
                    }}
                  >
                    SHOPSHUD SAMPLE · ตัวอย่างมีลิขสิทธิ์ · ห้ามคัดลอกก่อนสั่งซื้อ · SHOPSHUD
                    SAMPLE · ตัวอย่างมีลิขสิทธิ์ · ห้ามคัดลอกก่อนสั่งซื้อ
                  </div>
                ))}
              </div>

              {/* Heavy Translucent Cross Hatch for Center Watermark */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/60 pointer-events-none" />

              {/* Center Watermark Stamp Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                <div className="rounded-2xl bg-black/75 backdrop-blur-md border border-white/25 px-4 py-3 shadow-2xl max-w-sm">
                  <div className="text-xl sm:text-2xl mb-1">🔒</div>
                  <div className="font-display text-xs sm:text-sm font-bold text-white tracking-wide">
                    ตัวอย่างสินค้ามีลายน้ำคุ้มครอง
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-amber-300 font-mono mt-0.5">
                    SAMPLE WATERMARK ONLY
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1.5 leading-snug">
                    ภาพต้นฉบับคมชัดระดับ Master แบบไม่มีลายน้ำ จะส่งมอบทาง LINE หลังชำระเงิน
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* WATERMARKED CONTENT / EXCERPT (เนื้อหาตัวอย่างที่ถูกปิดไว้ไม่ให้เห็นทั้งหมด) */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <span>📄</span>
                <span>เนื้อหาตัวอย่าง / พิมพ์เขียวไอเดีย</span>
              </span>
              <span className="text-[11px] text-muted-foreground">
                แสดงเพียง 20% ของชิ้นงาน
              </span>
            </div>

            {/* Container with Partial Blur & Watermark Lock Barrier */}
            <div className="relative rounded-2xl border border-border bg-secondary/40 p-4 sm:p-5 overflow-hidden">
              {/* Visible First Part */}
              <div className="text-xs sm:text-sm text-foreground/90 space-y-2 font-mono leading-relaxed select-none">
                <p className="font-semibold text-primary">
                  [ตัวอย่างเนื้อหา / Sample Excerpt: {file.title}]
                </p>
                <p>
                  {file.sampleSnippet ||
                    file.description ||
                    'โครงสร้างความคิดต้นฉบับ แผนงาน รายละเอียด และพิมพ์เขียวของโครงการ...'}
                </p>
              </div>

              {/* Partially Obscured / Watermarked Hidden Part */}
              <div className="relative mt-3 pt-3 border-t border-border/40 select-none">
                {/* Simulated blurred text lines */}
                <div className="filter blur-xs opacity-50 space-y-1.5 text-xs text-muted-foreground pointer-events-none">
                  <p>••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••</p>
                  <p>••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••</p>
                  <p>••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••</p>
                </div>

                {/* Lock & Watermark Overlay Cover */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-transparent flex flex-col items-center justify-center text-center p-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-300 shadow-sm mb-1">
                    <span>🔒</span>
                    <span>เนื้อหาส่วนที่เหลือถูกปิดด้วยลายน้ำและระบบลิขสิทธิ์</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground max-w-md mt-1 leading-relaxed">
                    คุณจะได้รับไฟล์ต้นฉบับเต็ม (. {file.fileFormat.toUpperCase()}) โค้ด แผนงาน
                    หรือบทเพลงฉบับสมบูรณ์ทันทีผ่านแชท LINE หลังจากติดต่อสั่งซื้อ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ALL PRODUCT DETAILS (รายละเอียดทั้งหมด)                                    */}
          {/* ========================================================================= */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3.5">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <span>📋</span>
              <span>รายละเอียดข้อมูลและเงื่อนไขสิทธิ์ทั้งหมด</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-secondary/50 p-3 border border-border/50">
                <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
                  ประเภทสิทธิ์การใช้งาน
                </span>
                <span className="font-semibold text-foreground mt-0.5 block">
                  {licenseInfo?.title ?? 'ลิขสิทธิ์ถูกต้อง'}
                </span>
                <span className="text-[11px] text-muted-foreground mt-1 block leading-relaxed">
                  {licenseInfo?.desc ?? 'สามารถนำไปใช้งานตามที่ตกลงกับผู้สร้าง'}
                </span>
              </div>

              <div className="rounded-xl bg-secondary/50 p-3 border border-border/50">
                <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
                  รูปแบบไฟล์และขนาด
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-foreground">
                    .{file.fileFormat.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground">({file.fileSize})</span>
                </div>
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  ไฟล์ต้นฉบับพร้อมใช้งาน ไม่มีลายน้ำรบกวน
                </span>
              </div>

              <div className="rounded-xl bg-secondary/50 p-3 border border-border/50">
                <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
                  เจ้าของผลงาน & ข้อมูลติดต่อ
                </span>
                <div className="font-semibold text-foreground mt-0.5">
                  {file.sellerName}
                </div>
                <div className="mt-1 space-y-0.5 font-mono text-[11px]">
                  <div className="text-[#06C755] font-bold">LINE ID: {file.sellerLineId}</div>
                  <div className="text-blue-400">เบอร์โทร: {phone}</div>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/50 p-3 border border-border/50">
                <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
                  การส่งมอบไฟล์
                </span>
                <span className="font-semibold text-emerald-400 mt-0.5 block">
                  ✓ ส่งตรงทางห้องแชท LINE
                </span>
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  รับไฟล์ทันทีหลังจากชำระเงินกับผู้สร้างโดยตรง
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div className="pt-2 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
              <strong className="text-foreground block mb-1">คำอธิบายผลงาน:</strong>
              <p>{file.description}</p>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-5 py-4 border-t border-border bg-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
              title="โทรสอบถามผู้ขาย"
            >
              <span>📞</span>
              <span>โทร {phone}</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopy(cleanLine, 'LINE ID')}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <span>📋</span>
              <span>คัดลอก LINE</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
            >
              ย้อนกลับ
            </button>

            <button
              type="button"
              onClick={() => {
                onProceedPurchase(file);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06C755] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:bg-[#05b34c] active:scale-98 transition-all flex-1 sm:flex-none"
            >
              <span>💬</span>
              <span>สั่งซื้อทาง LINE เพื่อรับไฟล์จริงฉบับเต็ม</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

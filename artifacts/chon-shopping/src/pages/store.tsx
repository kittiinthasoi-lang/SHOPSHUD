import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import {
  CATEGORIES,
  CATEGORY_MAP,
  LICENSE_LABELS,
  type CategoryId,
  type DigitalFile,
  type LicenseType,
} from '@/lib/types';
import { ProductDetailModal } from '@/components/product-detail-modal';

import catMusic from '@/assets/images/cat_music_sheet_1792737285960.jpg';
import catPhoto from '@/assets/images/cat_photo_lens_1792737286086.jpg';
import catDrawing from '@/assets/images/cat_drawing_art_1792737286254.jpg';
import catExam from '@/assets/images/cat_exam_learning_1792737288280.jpg';
import catEbook from '@/assets/images/cat_ebook_novel_1792737287503.jpg';
import catHouse from '@/assets/images/cat_house_plan_1792739923632.jpg';

export default function StorePage() {
  const { files, addFile, deleteFile, buyFile, profile, setActiveCategory } = useStore();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('music');
  const [description, setDescription] = useState('');
  const [sampleSnippet, setSampleSnippet] = useState('');
  const [price, setPrice] = useState<number | ''>(99);
  const [fileFormat, setFileFormat] = useState('MP3');
  const [fileSize, setFileSize] = useState('14.2 MB');
  const [licenseType, setLicenseType] = useState<LicenseType>('personal');
  const [sellerLineId, setSellerLineId] = useState(profile.lineId || '@shopshud_seller');
  const [previewUrl, setPreviewUrl] = useState<string>(catMusic);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentCreatedId, setRecentCreatedId] = useState<string | null>(null);

  // Modal inspection state
  const [modalFile, setModalFile] = useState<DigitalFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick preset loader to help user test all 6 categories easily
  const applyPreset = (presetCategory: CategoryId) => {
    setCategory(presetCategory);
    setActiveCategory(presetCategory);
    switch (presetCategory) {
      case 'music':
        setTitle('Lofi Chill Beats - Ambient Track (BPM 85)');
        setDescription('แทร็กดนตรีบรรเลงสไตล์ Lofi Chill สำหรับใช้เปิดทำงาน หรือประกอบคลิปวิดีโอ มีไฟล์ Master WAV และ MP3 คุณภาพ 320kbps');
        setSampleSnippet('[Intro: Warm electric piano with vinyl crackle]\n"เมื่อสายลมพัดผ่านความคิด และค่ำคืนนี้มีเพียงท่วงทำนองอันเงียบสงบ..."\n[Chord Progression: Dmaj7 - F#m7 - Gmaj7 - A7]');
        setPrice(190);
        setFileFormat('WAV');
        setFileSize('35 MB');
        setLicenseType('commercial');
        setSellerLineId(profile.lineId || '@music_studio_th');
        setFileName('lofi_chill_master_2026.zip');
        setPreviewUrl(catMusic);
        break;
      case 'photo':
        setTitle('เซ็ตภาพถ่ายแนว Street Life กรุงเทพฯ ยามค่ำคืน (50 ภาพ)');
        setDescription('ไฟล์ภาพความละเอียด 24MP ถ่ายด้วยกล้องโปร เหมาะสำหรับงานกราฟิก หน้าปกบทความ และสื่อโฆษณา');
        setSampleSnippet('ตัวอย่างภาพถ่าย: แสงไฟนีออนถนนเยาวราช, ตลาดน้อยยามราตรี, แสงสะท้อนแม่น้ำเจ้าพระยา (ไฟล์ RAW DNG + Full JPG พร้อม Color Grade LUTs)');
        setPrice(250);
        setFileFormat('JPG');
        setFileSize('180 MB');
        setLicenseType('commercial');
        setSellerLineId(profile.lineId || '@lensart_bkk');
        setFileName('bkk_street_raw_pack.zip');
        setPreviewUrl(catPhoto);
        break;
      case 'drawing':
        setTitle('ชุดแปรงและลายเส้น Procreate พฤกษศาสตร์วินเทจ');
        setDescription('รวม 25 แปรงวาดภาพใบไม้และดอกไม้ พร้อมไฟล์เวกเตอร์ SVG สำหรับสร้างภาพประกอบหรือแพตเทิร์นผ้า');
        setSampleSnippet('พรีวิวแปรง: 01_Vintage_Flora_Ink, 02_Botanical_Watercolor_Wash, 03_Leaf_Texture_Grain พร้อมพาเลทสีพฤกษศาสตร์ 12 เฉดสี');
        setPrice(150);
        setFileFormat('PROCREATE');
        setFileSize('48 MB');
        setLicenseType('personal');
        setSellerLineId(profile.lineId || '@procreate_artth');
        setFileName('botanical_procreate_brushes.brushset');
        setPreviewUrl(catDrawing);
        break;
      case 'exam':
        setTitle('สรุปและแนวข้อสอบเข้ามหาวิทยาลัย วิชาคณิตศาสตร์ประยุกต์ 1');
        setDescription('สรุปสูตรครบทุกบท พร้อมโจทย์วิเคราะห์และเฉลยละเอียดแบบจับมือทำ รวม 180 หน้า เหมาะสำหรับทบทวนสอบเร่งด่วน');
        setSampleSnippet('บทที่ 1: เซตและตรรกศาสตร์เชิงซ้อน\n"ข้อ 1. กำหนดให้ A = {x | x^2 - 5x + 6 = 0} จงหาจำนวนสมาชิกของเพาเวอร์เซต P(A)..."\n[เฉลยหน้า 12 พร้อมวิธีคิดลัด]');
        setPrice(129);
        setFileFormat('PDF');
        setFileSize('22.5 MB');
        setLicenseType('personal');
        setSellerLineId(profile.lineId || '@math_tutor_th');
        setFileName('math_admission_summary_full.pdf');
        setPreviewUrl(catExam);
        break;
      case 'ebook':
        setTitle('นิยายสืบสวน: เงาปริศนาใต้แสงจันทร์ (ฉบับสมบูรณ์)');
        setDescription('นวนิยายแนวสืบสวนสอบสวนชวนลุ้นระทึก ความยาว 320 หน้า พร้อมภาพประกอบขาวดำและบทพิเศษท้ายเล่ม');
        setSampleSnippet('บทนำ: เงาที่ไร้เสียง\n"นาฬิกาโบราณบอกเวลาเที่ยงคืนตรง เสียงฝีเท้าเบาหวิวหยุดลงหน้าประตูบานที่สาม สารวัตรหนุ่มจับด้ามปืนแน่นขึ้น..."');
        setPrice(199);
        setFileFormat('EPUB');
        setFileSize('8.4 MB');
        setLicenseType('personal');
        setSellerLineId(profile.lineId || '@novel_writers_th');
        setFileName('mystery_novel_complete.epub');
        setPreviewUrl(catEbook);
        break;
      case 'home':
        setTitle('แบบแปลนบ้านโมเดิร์น 2 ชั้น (3 ห้องนอน 2 ห้องน้ำ) พร้อมไฟล์ 3D');
        setDescription('ชุดแบบก่อสร้างสถาปัตยกรรมครบชุด มีไฟล์ PDF พิมพ์ A3 และไฟล์โมเดล SketchUp (.skp) พร้อมภาพเรนเดอร์ความละเอียดสูง');
        setSampleSnippet('สเปกอาคาร: พื้นที่ใช้สอย 185 ตร.ม. ที่ดินหน้ากว้าง 10 เมตร ชั้นล่าง Double Volume Living Room ชั้นบน 3 ห้องนอนพร้อมระเบียงรับลม');
        setPrice(590);
        setFileFormat('PDF');
        setFileSize('64 MB');
        setLicenseType('commercial');
        setSellerLineId(profile.lineId || '@home_architect_th');
        setFileName('modern_house_plan_full_set.zip');
        setPreviewUrl(catHouse);
        break;
    }
  };

  // Handle local image file upload for sample
  const handleImageFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์ภาพ เช่น JPG, PNG หรือ WebP');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const created = addFile({
      title: title.trim(),
      category,
      description: description.trim(),
      sampleSnippet: sampleSnippet.trim() || undefined,
      price: price === '' ? 0 : Number(price),
      fileFormat: fileFormat.trim().toUpperCase() || 'ZIP',
      fileSize: fileSize.trim() || '10 MB',
      licenseType,
      previewUrl: previewUrl.trim() || CATEGORY_MAP[category]?.image || catMusic,
      fileName: fileName.trim() || `${title.replace(/\s+/g, '_')}.${fileFormat.toLowerCase()}`,
      sellerName: profile.displayName || 'ร้านค้าขายความคิด',
      sellerContact: profile.email,
      sellerLineId: sellerLineId.trim() || profile.lineId || '@shopshud_seller',
      sellerPhone: profile.phoneNumber || '081-999-8888',
    });

    setRecentCreatedId(created.id);
    setIsSubmitting(false);

    // Reset form fields
    setTitle('');
    setDescription('');
    setSampleSnippet('');
    setPrice(99);
    setFileName('');
  };

  return (
    <div className="space-y-8">
      {/* Product Detail Modal for checking watermark */}
      <ProductDetailModal
        file={modalFile}
        onClose={() => setModalFile(null)}
        onProceedPurchase={(file) => {
          buyFile(file);
          setModalFile(null);
          const cleanLine = (file.sellerLineId || '@shopshud_seller').replace('@', '');
          window.open(`https://line.me/R/ti/p/~${cleanLine}`, '_blank');
        }}
      />

      {/* Header */}
      <section className="border-b border-border/80 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <span>💡 สตูดิโอขายความคิด & ลิขสิทธิ์ผลงาน</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              ลงขายความคิดและผลงานดิจิทัล
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              กำหนดข้อมูล ใส่ตัวอย่างสินค้าพร้อมระบบลายน้ำป้องกันลิขสิทธิ์ และรับเงินพร้อมส่งไฟล์ผ่าน LINE โดยตรง
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-input rounded-xl px-3.5 py-2 bg-card hover:bg-secondary transition-colors"
            >
              <span>ดูหน้าแรก →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Grid: Form Left, Inventory / Stats Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs">
            {/* Quick Test Presets */}
            <div className="mb-6 rounded-2xl bg-secondary/40 p-4 border border-border/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>เลือกแม่แบบตัวอย่างผลงานด่วน (Quick Presets)</span>
                </span>
                <span className="text-[10px] text-muted-foreground">คลิกเพื่อโหลดข้อมูลตัวอย่าง</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => applyPreset(cat.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center border transition-all ${
                      category === cat.id
                        ? 'border-primary bg-primary/10 shadow-xs'
                        : 'border-border/60 bg-background/50 hover:bg-secondary'
                    }`}
                  >
                    <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-[10px] font-semibold text-foreground line-clamp-1">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  1. เลือกหมวดหมู่ผลงาน <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id);
                          setActiveCategory(cat.id);
                          if (!previewUrl || Object.values(CATEGORY_MAP).some(c => c.image === previewUrl)) {
                            setPreviewUrl(cat.image);
                          }
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 font-bold text-foreground shadow-xs'
                            : 'border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="h-6 w-6 rounded-md overflow-hidden shrink-0 border border-white/10">
                          <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                        </div>
                        <span className="text-xs truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-xs font-semibold text-foreground mb-1.5">
                  2. ชื่อไอเดียหรือผลงาน <span className="text-destructive">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น พิมพ์เขียวสถาปัตยกรรมโมเดิร์น หรือ โน้ตเพลงพร้อมบีทมาสเตอร์"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-foreground mb-1.5">
                  3. คำอธิบายรายละเอียดผลงาน <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="อธิบายว่าไฟล์นี้คืออะไร มีประโยชน์อย่างไร ใช้ในงานอะไรได้บ้าง..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-hidden resize-none"
                />
              </div>

              {/* ========================================================================= */}
              {/* 4. ตัวอย่างสินค้า (Product Sample & Preview with Watermark)                 */}
              {/* ========================================================================= */}
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>4. ใส่ตัวอย่างสินค้า (ระบบจะใส่ลายน้ำคุ้มครองให้อัตโนมัติ)</span>
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      ผู้ซื้อจะเห็นตัวอย่างและรายละเอียด แต่จะมีลายน้ำปิดทับไว้ไม่ให้เห็นไฟล์จริงทั้งหมด
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-md border border-amber-500/25 self-start sm:self-auto">
                    🔒 ป้องกันการขโมยผลงาน
                  </span>
                </div>

                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    ก. อัปโหลดภาพตัวอย่างสินค้าจากเครื่องของคุณ
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-primary/40 hover:border-primary rounded-2xl p-4 sm:p-5 bg-card/60 hover:bg-card text-center transition-all group"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      📸
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      คลิกเพื่อเลือกไฟล์รูปตัวอย่างสินค้าจากอุปกรณ์ของคุณ
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      รองรับไฟล์ภาพ JPG, PNG, WEBP ความละเอียดสูง
                    </div>
                  </div>
                </div>

                {/* Preset Gallery Picker */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    ข. หรือเลือกภาพตัวอย่างจากคลังภาพตามหมวดหมู่
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {CATEGORIES.map((c) => {
                      const isCurrent = previewUrl === c.image;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setPreviewUrl(c.image)}
                          className={`relative rounded-xl overflow-hidden aspect-video border transition-all ${
                            isCurrent
                              ? 'border-primary ring-2 ring-primary/40 shadow-sm scale-102'
                              : 'border-border/60 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold text-white px-1 text-center">
                            {c.name.split('/')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sample Snippet / Teaser Content Input */}
                <div>
                  <label htmlFor="sample-snippet" className="block text-xs font-semibold text-foreground mb-1">
                    ค. เนื้อหาตัวอย่างสินค้า / พิมพ์เขียวไอเดีย (Sample Excerpt)
                  </label>
                  <p className="text-[10px] text-muted-foreground mb-1.5">
                    เช่น ท่อนฮุกของเนื้อเพลง, โน้ตย่อหน้า 1, บทนำนิยาย หรือสเปกโครงสร้าง (ระบบจะแสดงบางส่วนและปิดทับส่วนที่เหลือด้วยลายน้ำ)
                  </p>
                  <textarea
                    id="sample-snippet"
                    rows={3}
                    value={sampleSnippet}
                    onChange={(e) => setSampleSnippet(e.target.value)}
                    placeholder="ใส่เนื้อหาตัวอย่างที่ต้องการให้ผู้ซื้อเห็นเป็นน้ำจิ้มก่อนสั่งซื้อ..."
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-hidden font-mono resize-none leading-relaxed"
                  />
                </div>

                {/* Live Watermarked Preview */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-muted-foreground block">
                    ตัวอย่างที่จะปรากฏแก่ผู้ซื้อ (พร้อมลายน้ำปิดทับ):
                  </span>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-slate-950">
                    <img
                      src={previewUrl || CATEGORY_MAP[category]?.image || catMusic}
                      alt="Watermarked Sample Preview"
                      className="h-full w-full object-cover filter contrast-90 brightness-90"
                    />

                    {/* Watermark Diagonal Overlay */}
                    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-around py-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="whitespace-nowrap text-white/30 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase -rotate-12 transform -translate-x-6"
                        >
                          SHOPSHUD SAMPLE · ตัวอย่างมีลิขสิทธิ์ · ห้ามคัดลอกก่อนสั่งซื้อ
                        </div>
                      ))}
                    </div>

                    {/* Stamp */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 pointer-events-none">
                      <div className="rounded-xl bg-black/80 border border-white/20 px-3 py-1.5 text-center shadow-lg">
                        <span className="text-[10px] font-bold text-amber-300 block">
                          🔒 WATERMARKED PREVIEW
                        </span>
                        <span className="text-[9px] text-slate-300">
                          มีลายน้ำคุ้มครอง · ส่งไฟล์จริงทาง LINE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-xs font-semibold text-foreground mb-1.5">
                    5. ราคา (บาท) <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="เช่น 190 (ใส่ 0 คือฟรี)"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="file-format" className="block text-xs font-semibold text-foreground mb-1.5">
                    6. นามสกุลไฟล์ (Format) <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="file-format"
                    type="text"
                    required
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    placeholder="เช่น MP3, PDF, PNG, PSD, DWG, ZIP"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground uppercase font-mono focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* License Type */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  7. เงื่อนไขและสิทธิ์การใช้งาน
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.keys(LICENSE_LABELS) as LicenseType[]).map((type) => {
                    const info = LICENSE_LABELS[type];
                    const isSelected = licenseType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setLicenseType(type)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-xs'
                            : 'border-border bg-background hover:bg-secondary'
                        }`}
                      >
                        <div className="text-xs font-bold text-foreground">
                          {type === 'personal'
                            ? 'ส่วนบุคคล'
                            : type === 'commercial'
                              ? 'เชิงพาณิชย์'
                              : 'ซื้อสิทธิ์ขาด'}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                          {info.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact: LINE ID for direct purchase & phone */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="seller-line" className="block text-xs font-semibold text-foreground">
                    8. LINE ID ของผู้ขายสำหรับรับเงินและส่งไฟล์ <span className="text-destructive">*</span>
                  </label>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#06C755]/15 border border-[#06C755]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#06C755]">
                    ● ซื้อขายผ่าน LINE เท่านั้น
                  </span>
                </div>
                <input
                  id="seller-line"
                  type="text"
                  required
                  value={sellerLineId}
                  onChange={(e) => setSellerLineId(e.target.value)}
                  placeholder="เช่น @creator_studio หรือ line_id_2026"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:ring-2 focus:ring-[#06C755] focus:outline-hidden font-mono"
                />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  เมื่อมีผู้ซื้อกดสั่งซื้อ ระบบจะส่งผู้ซื้อไปติดต่อ LINE ID นี้ เพื่อชำระเงินและรับมอบไฟล์ต้นฉบับทางแชท LINE โดยตรง
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95 active:scale-98 transition-all disabled:opacity-50"
                >
                  <span>✓</span>
                  <span>ลงขายผลงานความคิดทันที</span>
                </button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  เมื่อกดลงขาย ผลงานจะไปปรากฏในหน้าแรกตามหมวดหมู่ "{CATEGORY_MAP[category]?.name}" ทันที พร้อมระบบลายน้ำคุ้มครอง
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Store Inventory / Overview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Store Statistics Widget */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              ภาพรวมร้านค้าความคิดของคุณ
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-secondary/50 p-4 border border-border/50">
                <span className="block text-xs text-muted-foreground">ผลงานที่วางขาย</span>
                <span className="font-display text-2xl font-bold text-foreground tabular-nums">
                  {files.length}
                </span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">รายการ</span>
              </div>

              <div className="rounded-2xl bg-secondary/50 p-4 border border-border/50">
                <span className="block text-xs text-muted-foreground">ยอดดาวน์โหลดรวม</span>
                <span className="font-display text-2xl font-bold text-primary tabular-nums">
                  {files.reduce((acc, f) => acc + (f.downloadCount || 0), 0)}
                </span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">ครั้ง</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 pt-1">
              <div className="flex justify-between">
                <span>เจ้าของร้านค้าความคิด:</span>
                <span className="font-semibold text-foreground">{profile.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span>เบอร์โทรศัพท์:</span>
                <span className="font-mono text-foreground font-semibold">{profile.phoneNumber || 'ยังไม่ระบุ'}</span>
              </div>
              <div className="flex justify-between">
                <span>LINE ติดต่อ:</span>
                <span className="font-mono text-[#06C755] font-semibold">{profile.lineId || 'ยังไม่ระบุ'}</span>
              </div>
            </div>
          </div>

          {/* Published Inventory List */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-display text-base font-bold text-foreground">
                รายการผลงานที่ลงขายแล้ว ({files.length})
              </h3>
              {files.length > 0 && (
                <Link
                  href="/"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  ดูในหน้าแรก →
                </Link>
              )}
            </div>

            {files.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                ยังไม่มีผลงานที่ลงขาย กรอกฟอร์มด้านซ้ายเพื่อเปิดจำหน่ายไอเดียแรกของคุณ
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {files.map((file) => {
                  const cat = CATEGORY_MAP[file.category];
                  const isRecent = file.id === recentCreatedId;

                  return (
                    <div
                      key={file.id}
                      className={`rounded-2xl border p-3.5 transition-all ${
                        isRecent
                          ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40'
                          : 'border-border/80 bg-background/60 hover:bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="flex items-start gap-3 flex-1 cursor-pointer"
                          onClick={() => setModalFile(file)}
                          title="คลิกเพื่อดูตัวอย่างสินค้าพร้อมลายน้ำ"
                        >
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 shrink-0 bg-slate-950">
                            <img
                              src={file.previewUrl || cat?.image || catMusic}
                              alt={file.title}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[9px] text-white font-mono">
                              🔒
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              {cat && (
                                <span
                                  className="h-1.5 w-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: cat.colorId }}
                                />
                              )}
                              <span>{cat?.name}</span>
                              <span>·</span>
                              <span className="font-mono">.{file.fileFormat}</span>
                            </div>
                            <h4 className="font-semibold text-xs text-foreground line-clamp-1 hover:text-primary transition-colors">
                              {file.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span className="font-bold text-primary">
                                {file.price === 0 ? 'ฟรี' : `฿${file.price.toLocaleString('th-TH')}`}
                              </span>
                              <span>·</span>
                              <span className="text-[#06C755] font-semibold">LINE: {file.sellerLineId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setModalFile(file)}
                            className="p-1.5 rounded-lg text-xs text-primary hover:bg-primary/10 transition-colors"
                            title="ดูตัวอย่างสินค้าพร้อมลายน้ำ"
                          >
                            👁️ ดูลายน้ำ
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteFile(file.id)}
                            className="p-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="ลบไฟล์นี้"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

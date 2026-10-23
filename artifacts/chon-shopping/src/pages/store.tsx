import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  FileCode,
  FilePlus2,
  FileText,
  FileUp,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Music,
  Paintbrush,
  PlusCircle,
  ShieldCheck,
  Store as StoreIcon,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import {
  CATEGORIES,
  CATEGORY_MAP,
  LICENSE_LABELS,
  type CategoryId,
  type LicenseType,
} from '@/lib/types';

export default function StorePage() {
  const { files, addFile, deleteFile, profile, setActiveCategory } = useStore();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('music');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>(99);
  const [fileFormat, setFileFormat] = useState('MP3');
  const [fileSize, setFileSize] = useState('14.2 MB');
  const [licenseType, setLicenseType] = useState<LicenseType>('personal');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentCreatedId, setRecentCreatedId] = useState<string | null>(null);

  // Quick preset loader to help user test all 5 categories easily
  const applyPreset = (presetCategory: CategoryId) => {
    setCategory(presetCategory);
    switch (presetCategory) {
      case 'music':
        setTitle('Lofi Chill Beats - Ambient Track (BPM 85)');
        setDescription('แทร็กดนตรีบรรเลงสไตล์ Lofi Chill สำหรับใช้เปิดทำงาน หรือประกอบคลิปวิดีโอ มีไฟล์ Master WAV และ MP3 คุณภาพ 320kbps');
        setPrice(190);
        setFileFormat('WAV');
        setFileSize('35 MB');
        setLicenseType('commercial');
        setFileName('lofi_chill_master_2026.zip');
        setPreviewUrl('/src/assets/images/cat_music_sheet_1792737285960.jpg');
        break;
      case 'photo':
        setTitle('เซ็ตภาพถ่ายแนว Street Life กรุงเทพฯ ยามค่ำคืน (50 ภาพ)');
        setDescription('ไฟล์ภาพความละเอียด 24MP ถ่ายด้วยกล้องโปร เหมาะสำหรับงานกราฟิก หน้าปกบทความ และสื่อโฆษณา');
        setPrice(250);
        setFileFormat('JPG');
        setFileSize('180 MB');
        setLicenseType('commercial');
        setFileName('bkk_street_raw_pack.zip');
        setPreviewUrl('/src/assets/images/cat_photo_lens_1792737286086.jpg');
        break;
      case 'drawing':
        setTitle('ชุดแปรงและลายเส้น Procreate พฤกษศาสตร์วินเทจ');
        setDescription('รวม 25 แปรงวาดภาพใบไม้และดอกไม้ พร้อมไฟล์เวกเตอร์ SVG สำหรับสร้างภาพประกอบหรือแพตเทิร์นผ้า');
        setPrice(150);
        setFileFormat('PROCREATE');
        setFileSize('48 MB');
        setLicenseType('personal');
        setFileName('botanical_procreate_brushes.brushset');
        setPreviewUrl('/src/assets/images/cat_drawing_art_1792737286254.jpg');
        break;
      case 'exam':
        setTitle('สรุปและแนวข้อสอบเข้ามหาวิทยาลัย วิชาคณิตศาสตร์ประยุกต์ 1');
        setDescription('สรุปสูตรครบทุกบท พร้อมโจทย์วิเคราะห์และเฉลยละเอียดแบบจับมือทำ รวม 180 หน้า เหมาะสำหรับทบทวนสอบเร่งด่วน');
        setPrice(129);
        setFileFormat('PDF');
        setFileSize('22.5 MB');
        setLicenseType('personal');
        setFileName('math_admission_summary_full.pdf');
        setPreviewUrl('/src/assets/images/cat_exam_learning_1792737288280.jpg');
        break;
      case 'ebook':
        setTitle('นิยายสืบสวน: เงาปริศนาใต้แสงจันทร์ (ฉบับสมบูรณ์)');
        setDescription('นวนิยายแนวสืบสวนสอบสวนชวนลุ้นระทึก ความยาว 320 หน้า พร้อมภาพประกอบขาวดำและบทพิเศษท้ายเล่ม');
        setPrice(199);
        setFileFormat('EPUB');
        setFileSize('8.4 MB');
        setLicenseType('personal');
        setFileName('mystery_novel_complete.epub');
        setPreviewUrl('/src/assets/images/cat_ebook_novel_1792737287503.jpg');
        break;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const created = addFile({
      title: title.trim(),
      category,
      description: description.trim(),
      price: typeof price === 'number' ? Math.max(0, price) : 0,
      fileFormat: fileFormat.trim().toUpperCase() || 'ZIP',
      fileSize: fileSize.trim() || '10 MB',
      licenseType,
      previewUrl: previewUrl.trim() || undefined,
      fileName: fileName.trim() || `${title.replace(/\s+/g, '_')}.${fileFormat.toLowerCase()}`,
      sellerName: profile.displayName || 'ผู้สร้างดิจิทัล',
      sellerContact: profile.email,
    });

    setRecentCreatedId(created.id);
    setIsSubmitting(false);

    // Reset form fields
    setTitle('');
    setDescription('');
    setPrice(99);
    setFileName('');
    setPreviewUrl('');
  };

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'music':
        return <Music className="h-4 w-4" />;
      case 'photo':
        return <ImageIcon className="h-4 w-4" />;
      case 'drawing':
        return <Paintbrush className="h-4 w-4" />;
      case 'exam':
        return <GraduationCap className="h-4 w-4" />;
      case 'ebook':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="border-b border-border/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <StoreIcon className="h-4 w-4" />
              <span>สตูดิโอผู้ขายของฉัน</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              หน้าร้านค้า — ลงไฟล์ดิจิทัลขาย
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              ลงไฟล์ขายที่นี่ ไฟล์จะถูกจัดเข้าหมวดหมู่และแสดงในหน้าแรกของแพลตฟอร์มทันที
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-input rounded-xl px-3.5 py-2 bg-card hover:bg-secondary transition-colors"
            >
              <span>ดูหน้าแรก</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Grid: Form Left, Inventory / Stats Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <FilePlus2 className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    แบบฟอร์มลงขายไฟล์ดิจิทัล
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    กรอกข้อมูลผลงานและกำหนดราคาขาย
                  </p>
                </div>
              </div>

              {/* Preset Shortcuts */}
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-[11px] text-muted-foreground mr-1">ตัวอย่าง:</span>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => applyPreset(c.id)}
                    className="text-[11px] font-medium text-primary hover:underline px-1 py-0.5"
                    title={`โหลดตัวอย่าง ${c.name}`}
                  >
                    {c.name.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  1. เลือกหมวดหมู่สินค้า <span className="text-destructive">*</span>
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
                          // Default format matching category
                          if (cat.id === 'music') setFileFormat('MP3');
                          if (cat.id === 'photo') setFileFormat('JPG');
                          if (cat.id === 'drawing') setFileFormat('PNG');
                          if (cat.id === 'exam') setFileFormat('PDF');
                          if (cat.id === 'ebook') setFileFormat('EPUB');
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary'
                            : 'border-border/80 hover:bg-secondary text-muted-foreground'
                        }`}
                      >
                        <span className="shrink-0">{getCategoryIcon(cat.id)}</span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="file-title" className="block text-xs font-semibold text-foreground mb-1.5">
                  2. ชื่อผลงาน / ชื่อไฟล์ <span className="text-destructive">*</span>
                </label>
                <input
                  id="file-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น สรุปสูตรเคมี ม.ปลาย ฉบับพร้อมสอบ หรือ Lofi Beats Pack"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="file-desc" className="block text-xs font-semibold text-foreground mb-1.5">
                  3. รายละเอียดผลงาน และสิ่งที่ผู้ซื้อจะได้รับ
                </label>
                <textarea
                  id="file-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="อธิบายข้อมูลไฟล์ จุดเด่น ความยาว จำนวนหน้า หรือเงื่อนไขเพิ่มเติม..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-hidden resize-none"
                />
              </div>

              {/* File Specs: Format, Size, Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="file-format" className="block text-xs font-semibold text-foreground mb-1.5">
                    นามสกุลไฟล์ <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="file-format"
                    type="text"
                    required
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    placeholder="เช่น PDF, MP3, ZIP"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden uppercase"
                  />
                </div>

                <div>
                  <label htmlFor="file-size" className="block text-xs font-semibold text-foreground mb-1.5">
                    ขนาดไฟล์โดยประมาณ
                  </label>
                  <input
                    id="file-size"
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="เช่น 12.5 MB"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="file-price" className="block text-xs font-semibold text-foreground mb-1.5">
                    ราคาขาย (บาท) <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="file-price"
                    type="number"
                    min={0}
                    step={1}
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0 = แจกฟรี"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* License Model Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  4. เงื่อนไขสิทธิ์การใช้งาน (License Model)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['personal', 'commercial', 'exclusive'] as LicenseType[]).map((type) => {
                    const isSelected = licenseType === type;
                    const meta = LICENSE_LABELS[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setLicenseType(type)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                            : 'border-border/80 hover:bg-secondary text-muted-foreground'
                        }`}
                      >
                        <span className="block text-xs font-semibold text-foreground">
                          {type === 'personal' && 'สิทธิ์ส่วนบุคคล'}
                          {type === 'commercial' && 'สิทธิ์เชิงพาณิชย์'}
                          {type === 'exclusive' && 'ซื้อสิทธิ์ขาด'}
                        </span>
                        <span className="block text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {meta.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Preview / Image URL */}
              <div>
                <label htmlFor="preview-url" className="block text-xs font-semibold text-foreground mb-1.5">
                  5. รูปภาพตัวอย่าง หรือภาพปก (URL) (ไม่บังคับ)
                </label>
                <div className="flex gap-2">
                  <input
                    id="preview-url"
                    type="url"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="https://... หรือปล่อยว่างเพื่อใช้ไอคอนประจำหมวดหมู่"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(CATEGORY_MAP[category]?.image || '')}
                    className="shrink-0 text-xs font-medium text-primary border border-input rounded-xl px-3 py-2 bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    ใช้รูปหมวดหมู่
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 active:scale-98 transition-all disabled:opacity-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>ลงขายไฟล์ดิจิทัลทันที</span>
                </button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  เมื่อกดลงขาย ไฟล์จะไปปรากฏในหน้าแรกตามหมวดหมู่ "{CATEGORY_MAP[category]?.name}" ทันที
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
              ภาพรวมร้านค้าของคุณ
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-secondary/50 p-4 border border-border/50">
                <span className="block text-xs text-muted-foreground">ไฟล์ที่วางขาย</span>
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
                <span>ผู้ลงผลงาน:</span>
                <span className="font-semibold text-foreground">{profile.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span>บัญชีรับเงิน:</span>
                <span className="font-mono text-foreground">{profile.promptPay || 'ยังไม่ระบุ'}</span>
              </div>
            </div>
          </div>

          {/* Published Inventory List */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-display text-base font-bold text-foreground">
                รายการไฟล์ที่ลงขายแล้ว ({files.length})
              </h3>
              {files.length > 0 && (
                <Link
                  href="/"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  ดูทั้งหมดในหน้าแรก →
                </Link>
              )}
            </div>

            {files.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs space-y-2">
                <FileText className="h-8 w-8 mx-auto opacity-40 mb-1" />
                <p>ยังไม่มีไฟล์ที่ลงขายในร้านค้าของคุณ</p>
                <p className="text-[11px]">
                  เมื่อคุณลงขายไฟล์จากฟอร์มด้านซ้าย รายการจะมาปรากฏที่นี่ และแสดงในหน้าแรกของระบบ
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {files.map((file) => {
                  const cat = CATEGORY_MAP[file.category];
                  const isRecent = file.id === recentCreatedId;

                  return (
                    <div
                      key={file.id}
                      className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                        isRecent
                          ? 'border-emerald-500/80 bg-emerald-500/5 ring-1 ring-emerald-500/30'
                          : 'border-border/70 bg-background/50 hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
                          {getCategoryIcon(file.category)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-foreground truncate">
                            {file.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                            <span>หมวด {cat?.name}</span>
                            <span>·</span>
                            <span className="font-mono">.{file.fileFormat}</span>
                            <span>·</span>
                            <span>{file.fileSize}</span>
                          </div>
                          <div className="font-semibold text-primary text-xs mt-1">
                            {file.price === 0 ? 'ฟรี' : `฿${file.price.toLocaleString('th-TH')}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Link
                          href="/"
                          onClick={() => setActiveCategory(file.category)}
                          className="p-1.5 text-xs text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary transition-colors"
                          title="ดูในหน้าแรก"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteFile(file.id)}
                          className="p-1.5 text-xs text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                          title="ลบไฟล์ออกจากร้าน"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

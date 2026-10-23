import { useEffect, useMemo, useState } from 'react';
import { Eye, FileSearch, Filter, Search, ShieldCheck, X, ExternalLink, Store } from 'lucide-react';
import { useDocMeta } from '@/lib/use-doc-meta';

type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  priceMinor: number;
  currency: string;
  rightsModel: string;
  rightsTerms: string;
  previewUrl?: string | null;
  status: string;
};
const rightsLabels: Record<string, string> = {
  file_sale: 'ขายไฟล์',
  usage_license: 'สิทธิ์ใช้งาน',
  copyright_transfer: 'โอนลิขสิทธิ์',
};
function getFileType(product: Product) {
  const url = product.previewUrl ?? '';
  const match = url.split('?')[0].match(/\.([a-z0-9]{2,6})$/i);
  return match ? match[1].toUpperCase() : 'ยังไม่ระบุ';
}
function formatPrice(product: Product) {
  return (product.priceMinor / 100).toLocaleString('th-TH', {
    style: 'currency',
    currency: product.currency || 'THB',
    maximumFractionDigits: 2,
  });
}

export default function DealsPage() {
  useDocMeta('ร้านค้า — SHOPSHUD', 'ค้นหาและดูรายละเอียดผลงานดิจิทัลที่เผยแพร่ขายใน SHOPSHUD');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/catalog')
      .then(async (response) => {
        if (!response.ok) throw new Error('ยังไม่สามารถโหลดแคตตาล็อกได้');
        return response.json();
      })
      .then((data) => {
        if (active) setProducts(Array.isArray(data.products) ? data.products.filter((p: Product) => p.status === 'published') : []);
      })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'ไม่สามารถเชื่อมต่อแคตตาล็อก'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(), [products]);
  const filtered = useMemo(() => products.filter((p) => {
    const matchesCategory = category === 'all' || p.category === category;
    const text = query.trim().toLocaleLowerCase();
    const matchesQuery = !text || [p.title, p.description, p.category, p.rightsModel, p.rightsTerms].some((value) => value?.toLocaleLowerCase().includes(text));
    return matchesCategory && matchesQuery;
  }), [products, category, query]);

  return <section className="mx-auto max-w-6xl space-y-6">
    <header className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-[#071126] via-[#0b2450] to-[#061020] p-6 sm:p-8">
      <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary"><Store className="h-6 w-6" /></div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">SHOPSHUD DIGITAL STORE</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">ร้านค้าผลงานดิจิทัล</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">ค้นหาสินค้าทั้งหมดที่เปิดเผยแพร่จริง ดูหมวดหมู่ ประเภทไฟล์ ราคา และเงื่อนไขสิทธิ์ก่อนเปิดดูตัวอย่าง</p>
      </div>
    </header>

    <section className="space-y-3 rounded-2xl border border-card-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาชื่อสินค้า รายละเอียด หรือหมวดหมู่…" className="w-full bg-transparent text-sm outline-none" aria-label="ค้นหาสินค้า" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="ล้างการค้นหา"><X className="h-4 w-4" /></button>}
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5 sm:min-w-56">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent text-sm outline-none" aria-label="กรองตามหมวดหมู่">
            <option value="all">ทุกหมวดหมู่</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      {!loading && !error && <p className="text-xs text-muted-foreground">พบ {filtered.length.toLocaleString('th-TH')} รายการที่เปิดขาย</p>}
    </section>

    {loading ? <div className="rounded-2xl border border-input p-6 text-sm text-muted-foreground">กำลังโหลดแคตตาล็อก…</div>
      : error ? <div className="rounded-2xl border border-dashed border-input p-6"><p className="font-medium">ยังโหลดแคตตาล็อกไม่ได้</p><p className="mt-1 text-sm text-muted-foreground">{error}. ตรวจสอบว่า API และฐานข้อมูลตั้งค่าแล้ว</p></div>
      : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-input p-10 text-center"><FileSearch className="mx-auto h-9 w-9 text-muted-foreground" /><h2 className="mt-3 font-semibold">{products.length === 0 ? 'ยังไม่มีสินค้าที่เปิดขาย' : 'ไม่พบสินค้าที่ตรงกับการค้นหา'}</h2><p className="mx-auto mt-1 max-w-lg text-sm text-muted-foreground">{products.length === 0 ? 'สินค้าจะแสดงที่นี่เมื่อเจ้าของร้านตรวจสอบไฟล์และสิทธิ์ครบถ้วนแล้วเผยแพร่จริง ไม่มีสินค้าตัวอย่างหรือราคาสมมติ' : 'ลองเปลี่ยนคำค้นหาหรือเลือกทุกหมวดหมู่'}</p></div>
      : <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {filtered.map((p) => <article key={p.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
          <div className="relative flex aspect-[5/3] items-center justify-center overflow-hidden bg-gradient-to-br from-[#071126] via-[#0b2450] to-[#071126] p-4">
            {p.previewUrl && /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(p.previewUrl)
              ? <img src={p.previewUrl} alt={`ตัวอย่าง ${p.title}`} className="h-full w-full object-cover" />
              : <div className="flex flex-col items-center gap-2 text-primary"><FileSearch className="h-9 w-9" /><span className="font-mono text-xs">{getFileType(p) === 'ยังไม่ระบุ' ? 'DIGITAL FILE' : getFileType(p)}</span></div>}
            <span className="absolute left-2 top-2 max-w-[75%] truncate rounded-lg border border-primary/30 bg-[#071126]/90 px-2 py-1 text-[10px] font-medium text-blue-200">{p.category}</span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
            <div><h2 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary sm:text-base">{p.title}</h2><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p></div>
            <div className="space-y-1.5 border-t border-border/60 pt-3 text-xs">
              <div className="flex items-start justify-between gap-2"><span className="text-muted-foreground">หมวดหมู่</span><span className="text-right font-medium">{p.category}</span></div>
              <div className="flex items-start justify-between gap-2"><span className="text-muted-foreground">ประเภทไฟล์</span><span className="text-right font-medium">{getFileType(p)}</span></div>
            </div>
            <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/60 pt-3">
              <div><p className="text-[10px] text-muted-foreground">ราคา</p><p className="text-base font-bold text-primary sm:text-lg">{formatPrice(p)}</p></div>
              <button type="button" onClick={() => setSelected(p)} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-2.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 sm:px-3"><Eye className="h-3.5 w-3.5" /> ดูตัวอย่าง</button>
            </div>
          </div>
        </article>)}
      </div>}

    <p className="text-xs leading-relaxed text-muted-foreground">หมายเหตุ: แสดงเฉพาะสินค้าที่ API ระบุว่าเผยแพร่แล้ว ระบบชำระเงินและส่งมอบไฟล์จะเปิดใช้เมื่อระบบหลังบ้านพร้อมใช้งาน</p>

    {selected && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="presentation" onClick={() => setSelected(null)}>
      <section role="dialog" aria-modal="true" aria-labelledby="preview-title" className="max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-primary/30 bg-card p-5 shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-primary">{selected.category}</p><h2 id="preview-title" className="mt-1 font-display text-xl font-bold">{selected.title}</h2></div><button type="button" onClick={() => setSelected(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="ปิดตัวอย่าง"><X className="h-5 w-5" /></button></div>
        {selected.previewUrl && /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(selected.previewUrl) && <img src={selected.previewUrl} alt={`ตัวอย่าง ${selected.title}`} className="mt-4 max-h-72 w-full rounded-xl border border-border object-contain bg-background" />}
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/60 p-4 text-sm">
          <div><p className="text-xs text-muted-foreground">หมวดหมู่</p><p className="mt-1 font-medium">{selected.category}</p></div>
          <div><p className="text-xs text-muted-foreground">ประเภทไฟล์</p><p className="mt-1 font-medium">{getFileType(selected)}</p></div>
          <div><p className="text-xs text-muted-foreground">ราคา</p><p className="mt-1 font-bold text-primary">{formatPrice(selected)}</p></div>
          <div><p className="text-xs text-muted-foreground">รูปแบบสิทธิ์</p><p className="mt-1 font-medium">{rightsLabels[selected.rightsModel] ?? selected.rightsModel}</p></div>
        </div>
        <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3"><div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> เงื่อนไขสิทธิ์</div><p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{selected.rightsTerms}</p></div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {selected.previewUrl ? <a href={selected.previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"><ExternalLink className="h-4 w-4" /> เปิดไฟล์ตัวอย่าง</a> : <span className="self-center text-xs text-muted-foreground">เจ้าของผลงานยังไม่ได้เพิ่มไฟล์ตัวอย่าง</span>}
          <button type="button" onClick={() => setSelected(null)} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">ปิดรายละเอียด</button>
        </div>
      </section>
    </div>}
  </section>;
}

import { useEffect, useState } from 'react';
import { BookOpen, FileSearch, ShieldCheck } from 'lucide-react';
import { useDocMeta } from '@/lib/use-doc-meta';

type Product = {
  id: string; title: string; description: string; category: string; priceMinor: number;
  currency: string; rightsModel: string; rightsTerms: string; status: string;
};
const rightsLabels: Record<string, string> = {
  file_sale: 'ขายไฟล์', usage_license: 'สิทธิ์ใช้งาน', copyright_transfer: 'โอนลิขสิทธิ์',
};

export default function DealsPage() {
  useDocMeta('ผลงาน — SHOPSHUD', 'รายการผลงานจริงจากแคตตาล็อก SHOPSHUD');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetch('/api/catalog')
      .then(async (response) => {
        if (!response.ok) throw new Error('ยังไม่สามารถโหลดแคตตาล็อกได้');
        return response.json();
      })
      .then((data) => { if (active) setProducts(Array.isArray(data.products) ? data.products : []); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'ไม่สามารถเชื่อมต่อแคตตาล็อก'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <section className="mx-auto max-w-4xl space-y-6">
    <header><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-6 w-6" /></div><h1 className="font-display text-3xl font-bold">แคตตาล็อกผลงาน</h1><p className="mt-2 text-muted-foreground">แสดงเฉพาะรายการที่เผยแพร่จากฐานข้อมูลร้าน ไม่มีสินค้าตัวอย่างหรือราคาแต่งขึ้น</p></header>
    {loading ? <p className="rounded-2xl border border-input p-5 text-sm text-muted-foreground">กำลังโหลดแคตตาล็อก…</p> : error ? <div className="rounded-2xl border border-dashed border-input p-5"><p className="font-medium">ยังโหลดแคตตาล็อกไม่ได้</p><p className="mt-1 text-sm text-muted-foreground">{error}. ตรวจสอบว่า API และฐานข้อมูลตั้งค่าแล้ว</p></div> : products.length === 0 ? <div className="rounded-2xl border border-dashed border-input p-8 text-center"><FileSearch className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-3 font-semibold">ยังไม่มีผลงานเปิดขาย</h2><p className="mt-1 text-sm text-muted-foreground">เมื่อเจ้าของร้านเพิ่มไฟล์จริง ตรวจสอบสิทธิ์ และเปิดเผยแพร่แล้ว รายการจะแสดงที่นี่</p></div> : <div className="grid gap-4 sm:grid-cols-2">{products.map((p) => <article key={p.id} className="rounded-2xl border border-card-border bg-card p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-primary">{p.category}</p><h2 className="mt-1 font-semibold">{p.title}</h2></div><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /></div><p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{p.description}</p><p className="mt-4 text-xl font-bold">{(p.priceMinor / 100).toLocaleString('th-TH', { style: 'currency', currency: p.currency || 'THB' })}</p><div className="mt-3 rounded-xl bg-secondary p-3"><p className="text-xs font-semibold">{rightsLabels[p.rightsModel] ?? p.rightsModel}</p><p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{p.rightsTerms}</p></div><p className="mt-3 text-xs text-muted-foreground">ขณะนี้ระบบชำระเงินและส่งมอบไฟล์ยังไม่เปิดใช้งาน จึงยังไม่สามารถซื้อรายการนี้ผ่านเว็บไซต์ได้</p></article>)}</div>}
  </section>;
}

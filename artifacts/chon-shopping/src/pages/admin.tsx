import { useState, type FormEvent } from 'react';
import { ClipboardCheck, Database, FileLock2, LockKeyhole, Plus, RefreshCw } from 'lucide-react';
import { useDocMeta } from '@/lib/use-doc-meta';

type Product = {
  id: string; title: string; description: string; category: string; priceMinor: number;
  currency: string; rightsModel: 'file_sale' | 'usage_license' | 'copyright_transfer';
  rightsTerms: string; assetObjectKey: string | null; assetVerified: boolean; status: 'draft' | 'published' | 'paused';
};
const tasks = [
  'ตั้งค่าฐานข้อมูล PostgreSQL และใช้ migration ของ SHOPSHUD',
  'ตั้งค่า SHOPSHUD_ADMIN_TOKEN ที่ฝั่ง API เท่านั้น',
  'เพิ่มระบบ private object storage และตรวจยืนยันไฟล์จริง',
  'เพิ่มระบบชำระเงินจริงและส่งมอบไฟล์ที่ตรวจสอบสิทธิ์ผู้ซื้อแล้ว',
  'ตรวจเอกสารสิทธิ์และเอกสารโอนลิขสิทธิ์กับผู้เชี่ยวชาญ',
  'ทดสอบ build, typecheck, API และการตั้งค่าบนสภาพแวดล้อมจริง',
];

export default function Admin() {
  useDocMeta('การจัดการร้าน — SHOPSHUD', 'เครื่องมือจัดการแคตตาล็อกสำหรับเจ้าของร้าน');
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('เพลงและเสียง');
  const [price, setPrice] = useState('0');
  const [rightsModel, setRightsModel] = useState<Product['rightsModel']>('file_sale');
  const [rightsTerms, setRightsTerms] = useState('');

  async function loadCatalog(auth = savedToken) {
    if (!auth) { setMessage('ใส่ Owner token ที่ตั้งไว้บนเซิร์ฟเวอร์ก่อน'); return; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/owner/catalog', { headers: { Authorization: `Bearer ${auth}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'โหลดแคตตาล็อกไม่สำเร็จ');
      setProducts(data.products ?? []); setMessage('โหลดรายการจากฐานข้อมูลสำเร็จ');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'เชื่อมต่อ API ไม่สำเร็จ'); }
    finally { setBusy(false); }
  }

  async function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!savedToken) { setMessage('ยืนยัน Owner token ก่อน'); return; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/owner/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${savedToken}` },
        body: JSON.stringify({ title, description, category, priceMinor: Math.round(Number(price) * 100), rightsModel, rightsTerms, status: 'draft' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'บันทึกร่างไม่สำเร็จ');
      setProducts((current) => [data.product, ...current]);
      setTitle(''); setDescription(''); setPrice('0'); setRightsTerms('');
      setMessage('บันทึกร่างลงฐานข้อมูลแล้ว ยังไม่เปิดขายและยังไม่มีการอัปโหลดไฟล์');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ'); }
    finally { setBusy(false); }
  }

  async function pauseProduct(product: Product) {
    if (!savedToken) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/owner/catalog/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${savedToken}` },
        body: JSON.stringify({ status: product.status === 'paused' ? 'draft' : 'paused' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'เปลี่ยนสถานะไม่สำเร็จ');
      setProducts((current) => current.map((item) => item.id === product.id ? data.product : item));
      setMessage('อัปเดตสถานะแล้ว');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'อัปเดตไม่สำเร็จ'); }
    finally { setBusy(false); }
  }

  return <section className="mx-auto max-w-4xl space-y-7">
    <header><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><ClipboardCheck className="h-6 w-6" /></div><h1 className="font-display text-3xl font-bold">จัดการแคตตาล็อก SHOPSHUD</h1><p className="mt-2 text-muted-foreground">เครื่องมือเจ้าของร้านเชื่อม API และฐานข้อมูลจริงเมื่อกำหนดค่าระบบครบแล้ว ไม่มีบัญชีผู้ขายอื่น</p></header>
    <section className="space-y-3 rounded-2xl border border-card-border bg-card p-5">
      <h2 className="flex items-center gap-2 font-semibold"><LockKeyhole className="h-5 w-5 text-primary" /> ยืนยันตัวตนเจ้าของร้าน</h2>
      <p className="text-sm text-muted-foreground">ใส่ค่าที่ตั้งใน environment variable SHOPSHUD_ADMIN_TOKEN บน API server เท่านั้น อย่าใส่ token ลง source code หรือแชร์ให้ผู้อื่น</p>
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setSavedToken(token); void loadCatalog(token); }}>
        <input className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm" type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Owner token" aria-label="Owner token" />
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50" disabled={busy || !token} type="submit"><span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" /> เชื่อมต่อและโหลด</span></button>
      </form>
      {message && <p role="status" className="rounded-lg bg-secondary p-3 text-sm">{message}</p>}
    </section>

    <section className="space-y-4 rounded-2xl border border-card-border bg-card p-5">
      <h2 className="flex items-center gap-2 font-semibold"><Plus className="h-5 w-5 text-primary" /> เพิ่มร่างผลงาน</h2>
      <p className="text-sm text-muted-foreground">บันทึกข้อมูลร่างลงฐานข้อมูล ไม่เผยแพร่ต่อสาธารณะ และไม่ถือว่าเป็นการอัปโหลดไฟล์หรือเปิดขาย</p>
      <form onSubmit={createDraft} className="space-y-4">
        <label className="block space-y-1 text-sm"><span className="font-medium">ชื่อผลงาน</span><input required maxLength={180} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2" /></label>
        <label className="block space-y-1 text-sm"><span className="font-medium">รายละเอียด</span><textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-input bg-background px-3 py-2" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm"><span className="font-medium">หมวดหมู่</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2"><option>เพลงและเสียง</option><option>ความรู้และงานเขียน</option><option>งานออกแบบดิจิทัล</option><option>เครื่องมือดิจิทัล</option><option>อื่น ๆ</option></select></label>
          <label className="block space-y-1 text-sm"><span className="font-medium">ราคา (บาท)</span><input required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2" /></label>
        </div>
        <label className="block space-y-1 text-sm"><span className="font-medium">รูปแบบสิทธิ์</span><select value={rightsModel} onChange={(e) => setRightsModel(e.target.value as Product['rightsModel'])} className="w-full rounded-xl border border-input bg-background px-3 py-2"><option value="file_sale">ขายไฟล์</option><option value="usage_license">ให้สิทธิ์ใช้งาน</option><option value="copyright_transfer">โอนลิขสิทธิ์</option></select></label>
        <label className="block space-y-1 text-sm"><span className="font-medium">เงื่อนไขสิทธิ์</span><textarea required value={rightsTerms} onChange={(e) => setRightsTerms(e.target.value)} rows={4} placeholder="ระบุไฟล์ที่ได้รับ ขอบเขตการใช้ ข้อจำกัด การดัดแปลง และเงื่อนไขที่เกี่ยวข้อง" className="w-full rounded-xl border border-input bg-background px-3 py-2" /></label>
        <button type="submit" disabled={busy || !savedToken} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">บันทึกร่างลงฐานข้อมูล</button>
      </form>
    </section>

    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3"><h2 className="font-display text-xl font-bold">รายการในฐานข้อมูล</h2><button onClick={() => void loadCatalog()} disabled={busy || !savedToken} className="rounded-lg border border-input px-3 py-2 text-sm disabled:opacity-50">โหลดใหม่</button></div>
      {products.length === 0 ? <p className="rounded-2xl border border-dashed border-input p-5 text-sm text-muted-foreground">ยังไม่มีรายการ หรือยังไม่ได้เชื่อมต่อ API สำเร็จ</p> : <div className="space-y-3">{products.map((p) => <article key={p.id} className="rounded-2xl border border-card-border bg-card p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.category} · {(p.priceMinor / 100).toLocaleString('th-TH', { style: 'currency', currency: p.currency || 'THB' })} · {p.rightsModel}</p><p className="mt-1 text-xs text-muted-foreground">สถานะ: {p.status} · ไฟล์ยืนยันแล้ว: {p.assetVerified ? 'ใช่' : 'ยัง'}</p></div><button disabled={busy || p.status === 'published'} onClick={() => void pauseProduct(p)} className="rounded-lg border border-input px-3 py-2 text-sm disabled:opacity-50">{p.status === 'paused' ? 'กลับเป็นร่าง' : 'พักรายการ'}</button></div></article>)}</div>}
    </section>

    <section className="rounded-2xl border border-dashed border-input p-5"><h2 className="flex items-center gap-2 font-semibold"><Database className="h-5 w-5 text-primary" /> รายการก่อนเปิดขายจริง</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">{tasks.map((task) => <li key={task}>{task}</li>)}</ul><p className="mt-4 flex items-start gap-2 text-sm"><FileLock2 className="mt-0.5 h-4 w-4 shrink-0" /> ระบบนี้ยังไม่มีการอัปโหลดไฟล์จริง การชำระเงิน หรือส่งมอบไฟล์ จึงบล็อกการเผยแพร่สินค้าไว้จนกว่าจะเชื่อม storage และตรวจสอบไฟล์ได้</p></section>
  </section>;
}

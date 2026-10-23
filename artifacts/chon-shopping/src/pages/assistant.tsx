import { useState } from 'react';
import { Bot, Info, SearchX } from 'lucide-react';
import { ProductArt } from '@/components/product-art';
import { runAssistant, type AssistantResult } from '@/lib/assistant';
import { thb, toBudget } from '@/lib/search';
import { CATEGORIES, STORE_BY_ID } from '@/lib/seed';
import { useStore } from '@/lib/store';
import type { CategoryId } from '@/lib/types';
import { useDocMeta } from '@/lib/use-doc-meta';

const field = 'w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm';

export default function Assistant() {
  useDocMeta('ผู้ช่วยเลือกสินค้า — ช้อปชัด', 'ระบบค้นหาและแนะนำสินค้าที่ตรงกับงบประมาณ สเปก และความต้องการ พร้อมลิงก์ซื้อตรงและเปรียบเทียบราคา');
  const { openPurchase, recordClick, toggleCompare, state } = useStore();
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [req, setReq] = useState('');
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budget.trim() && toBudget(budget) === null) { setErr('กรุณากรอกงบเป็นตัวเลขที่ไม่ติดลบ'); return; }
    setErr(''); setBusy(true);
    setTimeout(() => {
      setResult(runAssistant({ budget: toBudget(budget), category, requirements: req }));
      setBusy(false);
    }, 350);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--marigold))] px-3 py-0.5 text-xs font-semibold text-[hsl(192_50%_10%)]" data-testid="badge-smart-recommender">
          <Bot className="h-3.5 w-3.5" aria-hidden="true" /> ระบบแนะนำสินค้าอัจฉริยะ (Smart Recommender)
        </p>
        <h1 className="font-display text-3xl font-bold">ผู้ช่วยเลือกสินค้าตามเงื่อนไข</h1>
        <p className="mt-1 text-muted-foreground">
          ระบุงบประมาณ หมวดหมู่ และคุณสมบัติที่ต้องการ ระบบจะช่วยคัดกรองสินค้าที่คุ้มค่าที่สุด พร้อมเปรียบเทียบข้อเสนอให้คุณทันที
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-card-border bg-card p-5" aria-label="แบบฟอร์มผู้ช่วย">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="a-budget" className="mb-1 block text-sm font-medium">งบสูงสุด (บาท)</label>
            <input id="a-budget" inputMode="numeric" className={field} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="เช่น 1500" data-testid="input-assistant-budget" aria-invalid={!!err} aria-describedby={err ? 'a-err' : undefined} />
            {err && <p id="a-err" role="alert" className="mt-1 text-sm text-destructive">{err}</p>}
          </div>
          <div>
            <label htmlFor="a-cat" className="mb-1 block text-sm font-medium">หมวดหมู่</label>
            <select id="a-cat" className={field} value={category} onChange={(e) => setCategory(e.target.value as CategoryId | 'all')} data-testid="select-assistant-category">
              <option value="all">ทุกหมวด</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="a-req" className="mb-1 block text-sm font-medium">ความต้องการ</label>
          <textarea id="a-req" rows={3} className={field} value={req} onChange={(e) => setReq(e.target.value)} placeholder="เช่น ไร้สาย น้ำหนักเบา กันน้ำ" data-testid="input-assistant-requirements" />
          <p className="mt-1 text-xs text-muted-foreground">รู้จักเงื่อนไข: ไร้สาย, ตัดเสียง, เบา, กันน้ำ, แบตนาน, เงียบ, กะทัดรัด, สรีรศาสตร์, ไม่แต่งกลิ่น, กันแดด, ประหยัดไฟ, พับได้, ระบายอากาศ, ปรับระดับ, ออร์แกนิก, ความปลอดภัย, ชาร์จเร็ว, ไร้สาร</p>
        </div>
        <button type="submit" disabled={busy} data-testid="button-assistant-submit" className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? 'กำลังคัดสินค้า...' : 'ขอคำแนะนำ'}
        </button>
      </form>

      <div aria-live="polite">
        {busy && <div className="space-y-3" aria-busy="true">{[0, 1].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>}
        {!busy && result && (
          <div className="space-y-4" data-testid="assistant-results">
            {result.notes.map((n) => (
              <p key={n} className="flex gap-2 rounded-xl bg-secondary p-3 text-sm"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{n}</p>
            ))}
            {result.noMatchReason ? (
              <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-input p-8 text-center" data-testid="assistant-no-match">
                <SearchX className="mb-2 h-9 w-9 text-muted-foreground" aria-hidden="true" />
                <p className="font-semibold">ไม่พบสินค้าที่เหมาะสม</p>
                <p className="text-sm text-muted-foreground">{result.noMatchReason}</p>
              </div>
            ) : (
              result.recommendations.map(({ product: p, explanation }) => (
                <article key={p.id} className="anim-rise flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-4 sm:flex-row" data-testid={`assistant-rec-${p.id}`}>
                  <ProductArt product={p} className="aspect-[4/3] w-full shrink-0 rounded-xl sm:w-40" />
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{p.name}</h2>
                      <span className="rounded-full bg-[hsl(var(--marigold))] px-2 py-0.5 text-xs font-semibold text-[hsl(192_50%_10%)]">{p.affiliatePlatform}</span>
                      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        ค่าคอม {p.commissionRate}% (~{thb(Math.round((p.price * p.commissionRate) / 100))})
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{thb(p.price)} · {(STORE_BY_ID[p.storeId]?.name ?? p.affiliatePlatform)}</p>
                    <p className="text-sm text-foreground/90">{explanation}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button type="button" onClick={() => toggleCompare(p.id)} aria-pressed={state.compare.includes(p.id)} className="rounded-xl border border-input px-3 py-2 text-sm hover:bg-secondary" data-testid={`button-assistant-compare-${p.id}`}>
                        {state.compare.includes(p.id) ? 'เอาออกจากการเทียบ' : 'เพิ่มในการเทียบ'}
                      </button>
                      <button type="button" onClick={() => { recordClick(p.id); openPurchase(p); }} className="rounded-xl bg-[hsl(var(--marigold))] px-3 py-2 text-sm font-semibold text-[hsl(192_50%_10%)] hover:brightness-95 transition-all" data-testid={`button-assistant-buy-${p.id}`}>
                        เช็คราคา & สั่งซื้อ
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

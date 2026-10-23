import { AlertTriangle, RotateCcw } from 'lucide-react';
import { PRODUCT_BY_ID, SEED_STATS } from '@/lib/seed';
import { useStore } from '@/lib/store';
import { useDocMeta } from '@/lib/use-doc-meta';

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return (
    <li className="space-y-1">
      <div className="flex justify-between gap-2 text-sm"><span>{label}</span><span className="font-semibold tabular-nums">{value.toLocaleString('th-TH')}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${max ? (value / max) * 100 : 0}%`, background: tone }} /></div>
    </li>
  );
}

export default function Admin() {
  useDocMeta('แดชบอร์ดสถิติ & รายงานแอฟฟิลิเอต — ช้อปชัด', 'แดชบอร์ดรายงานสถิติการค้นหาสินค้า จำนวนการคลิกซื้อ และประมาณการรายได้ค่าคอมมิชชั่นพันธมิตร');
  const { state, resetCounters } = useStore();
  const localClicks = Object.entries(state.clicks).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const localTerms = Object.entries(state.searchTerms).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalClicks = Object.values(state.clicks).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">แดชบอร์ดสถิติ & รายงานแอฟฟิลิเอต</h1>
        <p className="mt-2 flex gap-2 rounded-xl bg-primary/10 border border-primary/20 p-3 text-sm font-medium text-foreground" data-testid="banner-admin-insights">
          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          แสดงภาพรวมสถิติการเข้าชม การค้นหาสินค้า ยอดคลิกคำสั่งซื้อ และประมาณการค่าคอมมิชชั่นของแต่ละแพลตฟอร์ม
        </p>
      </header>

      <section aria-labelledby="seed-h" className="rounded-2xl border border-card-border bg-card p-5" data-testid="section-seed-stats">
        <h2 id="seed-h" className="font-display text-xl font-bold">ภาพรวมประสิทธิภาพแคมเปญแอฟฟิลิเอต (Affiliate Insights)</h2>
        <p className="mb-4 text-sm text-muted-foreground">ช่วงเวลา: {SEED_STATS.period} วิเคราะห์สถิติและการเติบโตของส่วนแบ่งรายได้ค่าคอมมิชชั่น</p>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-secondary p-4">
            <dt className="text-xs text-muted-foreground">การค้นหาสินค้า</dt>
            <dd className="font-display text-2xl font-bold text-primary tabular-nums">{SEED_STATS.searches.toLocaleString('th-TH')}</dd>
          </div>
          <div className="rounded-xl bg-secondary p-4">
            <dt className="text-xs text-muted-foreground">คลิกลิงก์แอฟฟิลิเอต</dt>
            <dd className="font-display text-2xl font-bold text-primary tabular-nums">{SEED_STATS.productClicks.toLocaleString('th-TH')}</dd>
          </div>
          <div className="rounded-xl bg-secondary p-4">
            <dt className="text-xs text-muted-foreground">อัตราคอมมิชชั่นเฉลี่ย</dt>
            <dd className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{SEED_STATS.avgCommissionRate}</dd>
          </div>
          <div className="rounded-xl bg-secondary p-4">
            <dt className="text-xs text-muted-foreground">มูลค่าคอมมิชชั่นประมาณการ</dt>
            <dd className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">฿{SEED_STATS.estimatedTotalCommission.toLocaleString('th-TH')}</dd>
          </div>
        </dl>

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold text-sm">สัดส่วนแพลตฟอร์มแอฟฟิลิเอต</h3>
            <ul className="space-y-2 text-xs">
              {SEED_STATS.topPlatforms.map((p) => (
                <li key={p.name} className="flex justify-between items-center rounded-lg bg-secondary/50 p-2.5">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="font-semibold text-primary">{p.share} <span className="text-muted-foreground font-normal">({p.commissionRange})</span></span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-sm">คำค้นยอดนิยม (สมมติ)</h3>
            <ul className="space-y-3">{SEED_STATS.topSearches.map((t) => <Bar key={t.term} label={t.term} value={t.count} max={SEED_STATS.topSearches[0].count} tone="hsl(var(--primary))" />)}</ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-sm">สินค้ายอดนิยม (สมมติ)</h3>
            <ul className="space-y-3">{SEED_STATS.topProducts.map((t) => <Bar key={t.id} label={PRODUCT_BY_ID[t.id]?.name ?? t.id} value={t.clicks} max={SEED_STATS.topProducts[0].clicks} tone="hsl(var(--marigold))" />)}</ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="local-h" className="rounded-2xl border border-card-border bg-card p-5" data-testid="section-local-stats">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2 id="local-h" className="font-display text-xl font-bold">การใช้งานจริงในเบราว์เซอร์นี้</h2>
          <button type="button" onClick={resetCounters} data-testid="button-reset-counters" className="inline-flex items-center gap-2 rounded-xl border border-input px-3 py-2 text-sm hover:bg-secondary">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> รีเซ็ตตัวนับ
          </button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">นับเฉพาะสิ่งที่คุณทำในเครื่องนี้ เก็บใน localStorage ไม่ส่งไปที่ไหน</p>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-secondary p-4"><dt className="text-sm text-muted-foreground">การค้นหาที่ส่ง</dt><dd className="font-display text-3xl font-bold tabular-nums" data-testid="text-local-searches">{state.searches}</dd></div>
          <div className="rounded-xl bg-secondary p-4"><dt className="text-sm text-muted-foreground">คลิกดูข้อเสนอเดโม</dt><dd className="font-display text-3xl font-bold tabular-nums" data-testid="text-local-clicks">{totalClicks}</dd></div>
        </dl>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div><h3 className="mb-2 font-semibold">คำค้นของคุณ</h3>
            {localTerms.length ? <ul className="space-y-3">{localTerms.map(([t, c]) => <Bar key={t} label={t} value={c} max={localTerms[0][1]} tone="hsl(var(--primary))" />)}</ul>
              : <p className="rounded-xl border-2 border-dashed border-input p-4 text-sm text-muted-foreground">ยังไม่มีข้อมูล ลองค้นหาสินค้าแล้วกดปุ่มค้นหา</p>}</div>
          <div><h3 className="mb-2 font-semibold">สินค้าที่คุณคลิก</h3>
            {localClicks.length ? <ul className="space-y-3">{localClicks.map(([id, c]) => <Bar key={id} label={PRODUCT_BY_ID[id]?.name ?? id} value={c} max={localClicks[0][1]} tone="hsl(var(--marigold))" />)}</ul>
              : <p className="rounded-xl border-2 border-dashed border-input p-4 text-sm text-muted-foreground">ยังไม่มีข้อมูล ลองกด ดูข้อเสนอเดโม ที่สินค้า</p>}</div>
        </div>
      </section>
    </div>
  );
}

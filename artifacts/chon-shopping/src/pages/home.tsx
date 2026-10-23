import { FileLock2, Music2, BookOpen, Palette, Wrench, ShieldCheck } from 'lucide-react';
import { useDocMeta } from '@/lib/use-doc-meta';

const categories = [
  { icon: Music2, title: 'เพลงและเสียง', detail: 'เพลงต้นฉบับ เนื้อเพลง บีต และ sound effects' },
  { icon: BookOpen, title: 'ความรู้และงานเขียน', detail: 'eBook คู่มือ บทเรียน และเนื้อหาที่สร้างสรรค์เอง' },
  { icon: Palette, title: 'งานออกแบบดิจิทัล', detail: 'กราฟิก เทมเพลต และสินทรัพย์ดิจิทัล' },
  { icon: Wrench, title: 'เครื่องมือดิจิทัล', detail: 'เครื่องมือและทรัพยากรที่มีไฟล์ใช้งานจริง' },
];

export default function Home() {
  useDocMeta('SHOPSHUD — ร้านผลงานดิจิทัลต้นฉบับ', 'ร้านค้าสำหรับผลงานและทรัพย์สินทางปัญญาที่ผู้สร้างเป็นเจ้าของ');
  return <div className="space-y-12">
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-slate-950 p-7 text-primary-foreground shadow-lg md:p-12">
      <div className="relative z-10 max-w-3xl space-y-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm"><ShieldCheck className="h-4 w-4" /> ร้านค้าของผู้สร้างโดยตรง</span>
        <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">เปลี่ยนความคิด<br />ให้กลายเป็นสินทรัพย์</h1>
        <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">SHOPSHUD คือร้านผลงานดิจิทัลของเรา ตั้งแต่เพลงและงานเขียน ไปจนถึงความรู้และเครื่องมือ ทุกชิ้นต้องมีผลงานจริง ราคา และเงื่อนไขสิทธิ์ที่ชัดเจน</p>
        <p className="text-sm text-primary-foreground/70">ดูผลงานที่เผยแพร่แล้วได้ในหน้า “ผลงาน” หากยังไม่มีรายการ ระบบจะแสดงสถานะว่างแทนสินค้าจำลอง</p>
      </div>
    </section>

    <section className="space-y-5" aria-labelledby="catalog-title">
      <div><p className="text-sm font-semibold uppercase tracking-widest text-primary">สิ่งที่ร้านจะนำเสนอ</p><h2 id="catalog-title" className="mt-1 font-display text-2xl font-bold md:text-3xl">ผลงานจากความคิด สู่สิ่งที่นำไปใช้ได้จริง</h2><p className="mt-2 max-w-2xl text-muted-foreground">หมวดหมู่ต่อไปนี้เป็นแนวทางของร้าน ไม่ใช่รายการสินค้าที่เปิดขายแล้ว</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map(({icon: Icon, title, detail}) => <article key={title} className="rounded-2xl border border-card-border bg-card p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
          <h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        </article>)}
      </div>
    </section>

    <section className="rounded-2xl border border-dashed border-input p-6 md:p-8">
      <div className="flex items-start gap-3"><FileLock2 className="mt-1 h-6 w-6 shrink-0 text-primary" /><div className="space-y-2"><h2 className="font-display text-xl font-bold">ซื้ออย่างเข้าใจสิทธิ์</h2><p className="text-sm leading-relaxed text-muted-foreground">การซื้อไฟล์ การให้สิทธิ์ใช้งาน และการโอนลิขสิทธิ์เป็นคนละเรื่องกัน สินค้าแต่ละชิ้นต้องระบุสิ่งที่ได้รับ ขอบเขตการใช้งาน และข้อจำกัดอย่างชัดเจน ส่วนการโอนลิขสิทธิ์ต้องมีเอกสารที่เหมาะสม</p></div></div>
    </section>
  </div>;
}

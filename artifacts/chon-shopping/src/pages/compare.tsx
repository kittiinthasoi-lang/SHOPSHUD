import { FileLock2, CheckCircle2 } from 'lucide-react';
import { useDocMeta } from '@/lib/use-doc-meta';

export default function Compare() {
  useDocMeta('สิทธิ์การใช้งาน — SHOPSHUD', 'ทำความเข้าใจความแตกต่างระหว่างการซื้อไฟล์ สิทธิ์ใช้งาน และการโอนลิขสิทธิ์');
  const items = [
    ['ซื้อไฟล์', 'ได้รับสำเนาไฟล์ตามที่ระบุ ไม่ได้โอนลิขสิทธิ์โดยอัตโนมัติ'],
    ['สิทธิ์ใช้งาน', 'ต้องระบุขอบเขตการใช้ เช่น ส่วนบุคคล เชิงพาณิชย์ การดัดแปลง และการเผยแพร่'],
    ['โอนลิขสิทธิ์', 'ต้องระบุสิทธิ์ที่โอน ขอบเขต เงื่อนไข และจัดทำเอกสารที่เหมาะสมตามกฎหมายที่เกี่ยวข้อง'],
  ];
  return <section className="mx-auto max-w-3xl space-y-6">
    <header><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileLock2 className="h-6 w-6" /></div><h1 className="font-display text-3xl font-bold">สิทธิ์การใช้งานและการซื้อผลงาน</h1><p className="mt-2 text-muted-foreground">การซื้อไฟล์ สิทธิ์ใช้งาน และการโอนลิขสิทธิ์เป็นคนละรูปแบบ เงื่อนไขจริงต้องแสดงบนหน้าสินค้าก่อนซื้อ</p></header>
    <div className="space-y-3">{items.map(([title,detail]) => <article key={title} className="flex gap-3 rounded-2xl border border-card-border bg-card p-5"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p></div></article>)}</div>
    <p className="text-xs text-muted-foreground">ข้อมูลนี้เป็นคำอธิบายทั่วไป ไม่ใช่คำปรึกษากฎหมาย เอกสารโอนสิทธิ์จริงควรตรวจให้เหมาะกับผลงานและกฎหมายที่ใช้บังคับ</p>
  </section>;
}

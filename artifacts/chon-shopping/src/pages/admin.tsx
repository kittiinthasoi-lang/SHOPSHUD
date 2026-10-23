import { ClipboardCheck, Database, FileLock2 } from 'lucide-react';
import { useDocMeta } from '@/lib/use-doc-meta';

const tasks = [
  'ระบบยืนยันตัวตนและสิทธิ์ผู้ดูแลร้าน',
  'แบบฟอร์มเพิ่มผลงานพร้อมไฟล์ ราคา และเงื่อนไข',
  'พื้นที่เก็บไฟล์ต้นฉบับแบบ private และระบบส่งมอบที่ปลอดภัย',
  'ฐานข้อมูลและ migration สำหรับสินค้า คำสั่งซื้อ และข้อตกลงสิทธิ์',
  'เชื่อมต่อชำระเงินจริงหลังทดสอบครบทุกขั้นตอน',
  'เอกสารโอนสิทธิ์และประวัติการยอมรับเงื่อนไข',
];
export default function Admin() {
  useDocMeta('การจัดการร้าน — SHOPSHUD', 'สถานะการเตรียมระบบจัดการแคตตาล็อกของเจ้าของร้าน');
  return <section className="mx-auto max-w-3xl space-y-6">
    <header><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><ClipboardCheck className="h-6 w-6" /></div><h1 className="font-display text-3xl font-bold">เตรียมระบบจัดการร้าน</h1><p className="mt-2 text-muted-foreground">หน้านี้เป็นรายการงานพัฒนาสำหรับเจ้าของร้าน ไม่ใช่แดชบอร์ดที่เชื่อมกับข้อมูลการขายจริง</p></header>
    <div className="rounded-2xl border border-card-border bg-card p-5"><h2 className="flex items-center gap-2 font-semibold"><Database className="h-5 w-5 text-primary" /> งานที่ต้องพัฒนาก่อนเปิดร้าน</h2><ul className="mt-4 space-y-3">{tasks.map(t => <li key={t} className="flex items-start gap-3 text-sm"><span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-input" /><span>{t}</span></li>)}</ul></div>
    <p className="flex items-start gap-2 rounded-xl bg-secondary p-4 text-sm text-muted-foreground"><FileLock2 className="mt-0.5 h-4 w-4 shrink-0" /> ยังไม่มีการสร้างหรือแก้ไขสินค้าได้จากหน้านี้ และยังไม่มีการรับชำระเงินหรือรายงานยอดขายจริง</p>
  </section>;
}

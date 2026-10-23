import { CircleHelp, ShieldCheck } from 'lucide-react';
import { useDocMeta } from '@/lib/use-doc-meta';

export default function Assistant() {
  useDocMeta('วิธีเลือกผลงาน — SHOPSHUD', 'แนวทางตรวจสอบไฟล์ ราคา และสิทธิ์ก่อนซื้อผลงานดิจิทัล');
  return <section className="mx-auto max-w-3xl space-y-6">
    <header><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><CircleHelp className="h-6 w-6" /></div><h1 className="font-display text-3xl font-bold">เลือกผลงานให้ตรงกับการใช้งาน</h1><p className="mt-2 text-muted-foreground">เมื่อมีสินค้าเปิดขายจริง หน้ารายละเอียดควรช่วยให้คุณตรวจสอบไฟล์ สิทธิ์ และเงื่อนไขได้ก่อนตัดสินใจ</p></header>
    <div className="rounded-2xl border border-card-border bg-card p-5"><h2 className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-5 w-5 text-primary" /> ตรวจสอบก่อนซื้อ</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground"><li>ตรวจชนิดไฟล์ รูปแบบ และสิ่งที่รวมอยู่ในชุดดาวน์โหลด</li><li>อ่านราคาและเงื่อนไขการส่งมอบให้ครบ</li><li>ดูว่าซื้อเพื่อใช้งานส่วนตัว เชิงพาณิชย์ หรือเพื่อรับโอนสิทธิ์</li><li>เก็บใบเสร็จและข้อตกลงสิทธิ์ไว้เป็นหลักฐาน</li></ol></div>
    <p className="rounded-xl bg-secondary p-4 text-sm">ขณะนี้ยังไม่มีแคตตาล็อกจริงให้ระบบแนะนำสินค้า และระบบนี้ยังไม่ได้เชื่อมต่อ AI หรือบริการซื้อขายจริง</p>
  </section>;
}

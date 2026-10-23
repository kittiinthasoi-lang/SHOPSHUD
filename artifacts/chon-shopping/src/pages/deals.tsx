import { BookOpen, FileSearch } from 'lucide-react';
import { useDocMeta } from '@/lib/use-doc-meta';

export default function DealsPage() {
  useDocMeta('ผลงาน — SHOPSHUD', 'รายการผลงานจริงจะปรากฏเมื่อเจ้าของร้านเพิ่มไฟล์ ราคา และเงื่อนไขครบถ้วน');
  return <section className="mx-auto max-w-3xl space-y-5 py-10 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpen className="h-7 w-7" /></div>
    <h1 className="font-display text-3xl font-bold">แคตตาล็อกผลงาน</h1>
    <p className="text-muted-foreground">ยังไม่มีผลงานที่เปิดขายจริงในขณะนี้ เราจะไม่แสดงสินค้า ราคา ส่วนลด หรือยอดขายจำลองแทนข้อมูลจริง</p>
    <div className="rounded-2xl border border-dashed border-input p-5 text-left"><h2 className="flex items-center gap-2 font-semibold"><FileSearch className="h-4 w-4" /> เงื่อนไขก่อนเผยแพร่สินค้า</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground"><li>มีไฟล์ต้นฉบับจริงและตรวจสอบสิทธิ์ได้</li><li>ระบุราคาและสิ่งที่ผู้ซื้อจะได้รับ</li><li>ระบุประเภทสิทธิ์และข้อจำกัดการใช้งาน</li><li>ระบบส่งมอบไฟล์ต้องผ่านการทดสอบก่อนรับชำระเงิน</li></ul></div>
  </section>;
}

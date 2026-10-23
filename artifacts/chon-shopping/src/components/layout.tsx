import type { ReactNode } from 'react';
import { BookOpen, FileLock2, House, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const NAV = [
  { href: '/', label: 'หน้าร้าน', icon: House },
  { href: '/deals', label: 'ผลงาน', icon: BookOpen },
  { href: '/compare', label: 'สิทธิ์การใช้งาน', icon: FileLock2 },
];

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  return <div className="flex min-h-[100dvh] flex-col">
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">ข้ามไปยังเนื้อหา</a>
    <div className="bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground">SHOPSHUD · ร้านผลงานดิจิทัลของผู้สร้าง</div>
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3" data-testid="link-home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></span>
          <span className="flex flex-col"><span className="font-display text-xl font-bold leading-none">SHOPSHUD</span><span className="mt-1 text-[10px] text-muted-foreground">ผลงานของเรา สิทธิ์ชัดเจน</span></span>
        </Link>
        <nav aria-label="เมนูหลัก" className="flex gap-1">
          {NAV.map(n => { const Icon = n.icon; return <Link key={n.href} href={n.href} aria-current={loc === n.href ? 'page' : undefined} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${loc === n.href ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}><Icon className="h-4 w-4" /><span className="hidden sm:inline">{n.label}</span></Link>; })}
        </nav>
      </div>
    </header>
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    <footer className="border-t bg-secondary/50"><div className="mx-auto grid max-w-6xl gap-4 px-4 py-7 text-sm text-muted-foreground md:grid-cols-3">
      <section><h2 className="mb-1 font-semibold text-foreground">เกี่ยวกับ SHOPSHUD</h2><p>ร้านค้าออนไลน์สำหรับผลงานและสินทรัพย์ดิจิทัลที่เราสร้างหรือมีสิทธิ์จำหน่ายอย่างถูกต้อง ไม่ใช่ตลาดกลางสำหรับผู้ขายทั่วไป</p></section>
      <section><h2 className="mb-1 font-semibold text-foreground">สิทธิ์และเงื่อนไข</h2><p>ไฟล์ ราคา และเงื่อนไขสิทธิ์ต้องระบุชัดเจนก่อนเปิดขาย การซื้อไฟล์ไม่ได้หมายถึงการได้รับลิขสิทธิ์โดยอัตโนมัติ</p></section>
      <section><h2 className="mb-1 font-semibold text-foreground">สถานะระบบ</h2><p>หน้าร้านกำลังพัฒนา ยังไม่มีรายการสินค้าหรือระบบชำระเงินที่เปิดใช้งานจริง</p></section>
    </div></footer>
  </div>;
}

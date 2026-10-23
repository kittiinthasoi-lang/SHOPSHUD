import type { ReactNode } from 'react';
import {
  House,
  Store as StoreIcon,
  UserRound,
  FilePlus2,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const { files, purchases, setActiveCategory } = useStore();

  const navItems = [
    { href: '/', label: 'หน้าแรก', icon: House },
    { href: '/deals', label: 'ร้านค้า', icon: StoreIcon },
    { href: '/store', label: 'ลงขายไฟล์', icon: FilePlus2 },
    { href: '/profile', label: 'โปรไฟล์', icon: UserRound },
  ];

  const isNavActive = (href: string) => {
    if (href === '/') return loc === '/';
    if (href === '/deals') return loc === '/deals';
    if (href === '/store') return loc === '/store' || loc === '/admin';
    return loc === href;
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <div className="bg-primary/95 px-4 py-1.5 text-center text-xs font-medium tracking-wide text-primary-foreground">
        SHOPSHUD · พื้นที่สำหรับผลงานดิจิทัลของคุณ
      </div>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Layers className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-lg font-bold leading-none tracking-tight text-foreground">
                SHOPSHUD
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground">
                ศูนย์รวมไฟล์ดิจิทัล
              </span>
            </span>
          </Link>

          <span className="hidden text-sm text-muted-foreground sm:block">
            สร้างสรรค์ · แบ่งปัน · เติบโต
          </span>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        {children}
      </main>

      <footer className="mt-12 border-t border-border/80 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="grid gap-8 text-sm sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="font-display font-bold text-foreground">SHOPSHUD DIGITAL</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                พื้นที่จำหน่ายผลงานดิจิทัล พร้อมข้อมูลสินค้าและเงื่อนไขสิทธิ์ที่ชัดเจน
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                หมวดหมู่ไฟล์ดิจิทัล
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href="/"
                      onClick={() => setActiveCategory(cat.id)}
                      className="transition-colors hover:text-primary"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                บัญชีของฉัน
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/profile" className="transition-colors hover:text-primary">
                    ไฟล์ที่ซื้อและข้อมูลโปรไฟล์
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="transition-colors hover:text-primary">
                    จัดการผลงานของฉัน
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                สิทธิ์และการคุ้มครอง
              </h3>
              <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                การซื้อไฟล์ไม่ได้หมายถึงการโอนลิขสิทธิ์โดยอัตโนมัติ โปรดตรวจสอบเงื่อนไขการใช้งานก่อนซื้อ
              </p>
              <span className="text-[11px] text-muted-foreground/75">
                เคารพสิทธิ์ของผู้สร้างผลงานทุกคน
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} SHOPSHUD · พื้นที่สำหรับผู้สร้างสรรค์</p>
            <p className="text-[11px]">พัฒนาต่อเนื่องเพื่อประสบการณ์ที่ดีขึ้น</p>
          </div>
        </div>
      </footer>

      <nav
        aria-label="เมนูหลักด้านล่าง"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 shadow-[0_-8px_24px_rgba(20,40,40,0.08)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:bottom-4 md:left-1/2 md:right-auto md:w-[min(620px,calc(100%-2rem))] md:-translate-x-1/2 md:rounded-2xl md:border md:shadow-xl"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1 px-2 py-2 md:px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.href);
            const badgeCount = item.href === '/store'
              ? files.length
              : item.href === '/profile'
                ? purchases.length
                : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-semibold transition-all sm:text-xs ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span className="relative">
                  <Icon className={`h-5 w-5 ${active ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  {badgeCount > 0 && (item.href === '/store' || item.href === '/profile') && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-accent-foreground">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

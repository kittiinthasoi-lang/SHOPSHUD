import type { ReactNode } from 'react';
import { House, PlusCircle, Store as StoreIcon, User, Layers, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const { files, purchases, setActiveCategory } = useStore();

  const navItems = [
    { href: '/', label: 'หน้าแรก', icon: House },
    { href: '/store', label: 'หน้าร้านค้า', icon: StoreIcon, badge: files.length > 0 ? files.length : undefined },
    { href: '/profile', label: 'โปรไฟล์', icon: User, badge: purchases.length > 0 ? purchases.length : undefined },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>

      {/* Top Notice Bar */}
      <div className="bg-primary/95 text-primary-foreground px-4 py-1.5 text-center text-xs font-medium tracking-wide">
        SHOPSHUD · ตลาดไฟล์ดิจิทัล สิทธิ์ชัดเจน ส่งมอบไฟล์ทันที
      </div>

      {/* Top Bar - 3-Zone Contract */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <Link href="/" className="group flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-foreground leading-none">
                SHOPSHUD
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                ศูนย์รวมไฟล์ดิจิทัล
              </span>
            </div>
          </Link>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav aria-label="การนำทางหลัก" className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = loc === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-0.5 text-xs font-semibold tabular-nums ${
                        isActive ? 'text-primary-foreground/90' : 'text-primary'
                      }`}
                    >
                      ({item.badge})
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>ลงไฟล์ขาย</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-secondary/30 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="font-display font-bold text-foreground">SHOPSHUD DIGITAL</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                แพลตฟอร์มตลาดไฟล์ดิจิทัลสำหรับนักสร้างสรรค์ชาวไทย ซื้อขายไฟล์ต้นฉบับอย่างมั่นใจ พร้อมเงื่อนไขสิทธิ์ชัดเจน
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                หมวดหมู่ไฟล์ดิจิทัล
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href="/"
                      onClick={() => setActiveCategory(cat.id)}
                      className="hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                การใช้งานและระบบ
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    หน้าแรก (เลือกหมวดหมู่)
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="hover:text-primary transition-colors">
                    หน้าร้านค้า (ลงไฟล์ขาย)
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-primary transition-colors">
                    หน้าโปรไฟล์ (ไฟล์ที่ซื้อและรายได้)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                สิทธิ์และการคุ้มครอง
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                การซื้อขายไฟล์ดิจิทัลเป็นการมอบสิทธิ์ตามสัญญาที่ผู้ขายระบุ (ส่วนบุคคล / เชิงพาณิชย์ / สิทธิ์ขาด)
              </p>
              <span className="text-[11px] text-muted-foreground/75">
                ลิขสิทธิ์เป็นของผู้สร้างผลงานตาม พ.ร.บ. ลิขสิทธิ์
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} SHOPSHUD · แพลตฟอร์มไฟล์ดิจิทัลเพื่อผู้สร้างสรรค์</p>
            <p className="text-[11px]">โครงสร้างระบบพร้อมเปิดใช้งาน รองรับไฟล์งานทุกหมวดหมู่</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

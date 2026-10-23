import type { ReactNode } from 'react';
import { BarChart3, Bot, Flame, GitCompareArrows, Search, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { PurchaseDialog } from '@/components/purchase-dialog';
import { useStore } from '@/lib/store';

const NAV = [
  { href: '/', label: 'ค้นหา', icon: Search },
  { href: '/deals', label: '🔥 ดีลลดราคา', icon: Flame },
  { href: '/compare', label: 'เทียบสินค้า', icon: GitCompareArrows },
  { href: '/assistant', label: 'ผู้ช่วยเลือก', icon: Bot },
  { href: '/admin', label: 'แดชบอร์ดสถิติ', icon: BarChart3 },
];

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const { state, storageOk } = useStore();
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        ข้ามไปยังเนื้อหา
      </a>
      <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground font-medium" data-testid="banner-demo">
        <strong className="text-[hsl(var(--marigold))]">✨ เปรียบเทียบราคา & รวมดีลลดราคาสินค้าทุกหมวดหมู่</strong> เช็คราคาถูกที่สุดจาก Shopee, Lazada, TikTok Shop พร้อมรีวิว ค่าจัดส่ง และส่วนลดสูงสุดถึง 65%
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold leading-none">ช้อปชัด</span>
              <span className="text-[10px] text-muted-foreground font-medium leading-tight">เปรียบเทียบราคา & ดีลออนไลน์</span>
            </div>
          </Link>
          <nav aria-label="เมนูหลัก" className="hidden gap-1 md:flex">
            {NAV.map((n) => (
              <NavLink key={n.href} {...n} active={loc === n.href} badge={n.href === '/compare' ? state.compare.length : 0} />
            ))}
          </nav>
        </div>
        <nav aria-label="เมนูมือถือ" className="flex justify-around border-t px-2 md:hidden">
          {NAV.map((n) => (
            <NavLink key={n.href} {...n} active={loc === n.href} badge={n.href === '/compare' ? state.compare.length : 0} compact />
          ))}
        </nav>
      </header>
      {!storageOk && (
        <div role="status" className="bg-destructive/10 px-4 py-2 text-center text-sm text-destructive" data-testid="banner-storage">
          เบราว์เซอร์นี้เก็บข้อมูลในเครื่องไม่ได้ รายการเทียบและตัวนับจะหายเมื่อปิดหน้า
        </div>
      )}
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t bg-secondary/60">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm text-muted-foreground md:grid-cols-3">
          <section>
            <h2 className="mb-1 font-semibold text-foreground">เกี่ยวกับช้อปชัด</h2>
            <p>แพลตฟอร์มค้นหาและเปรียบเทียบราคาสินค้าออนไลน์ทุกหมวดหมู่ ช่วยให้คุณเช็คราคาที่ถูกที่สุด รีวิวจากผู้ใช้จริง ค่าจัดส่ง และส่วนลดโปรโมชั่นก่อนตัดสินใจซื้อ</p>
          </section>
          <section data-testid="text-affiliate-disclosure">
            <h2 className="mb-1 font-semibold text-foreground">การเปิดเผยค่าคอมมิชชั่นพันธมิตร</h2>
            <p>ช้อปชัดเป็นผู้ให้บริการเปรียบเทียบราคา โดยอาจได้รับค่าตอบแทน (Affiliate Commission) เมื่อคลิกซื้อผ่านลิงก์ของ Shopee, Lazada, TikTok Shop หรือร้านค้าพาร์ทเนอร์ โดยไม่มีค่าใช้จ่ายเพิ่มเติมแก่ผู้ซื้อ</p>
          </section>
          <section data-testid="text-privacy">
            <h2 className="mb-1 font-semibold text-foreground">ความเป็นส่วนตัว & ข้อมูล</h2>
            <p>ข้อมูลสินค้า ราคา และคะแนนรีวิวรวบรวมจากร้านค้าออนไลน์ชั้นนำ บันทึกรายการเปรียบเทียบของคุณในเครื่องเพื่อความสะดวกรวดเร็วในการเลือกซื้อ</p>
          </section>
        </div>
      </footer>
      <PurchaseDialog />
    </div>
  );
}

function NavLink({ href, label, icon: Icon, active, badge, compact }: { href: string; label: string; icon: typeof Search; active: boolean; badge: number; compact?: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      data-testid={`link-nav-${href === '/' ? 'search' : href.slice(1)}${compact ? '-m' : ''}`}
      className={`relative flex items-center gap-1.5 rounded-xl text-sm font-medium transition-colors ${
        compact ? 'flex-col px-2 py-2 text-xs' : 'px-3 py-2'
      } ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
      {badge > 0 && (
        <span key={badge} className="anim-pop ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--marigold))] px-1 text-xs font-bold text-[hsl(192_50%_10%)]" aria-label={`เลือกไว้ ${badge} ชิ้น`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

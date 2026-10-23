import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP } from '@/lib/types';

import appLogo from '@/assets/images/app_logo_shopshud_1792739922486.jpg';
import navHome from '@/assets/images/nav_home_thumb_1792739942258.jpg';
import navStore from '@/assets/images/nav_store_thumb_1792739942730.jpg';
import navUpload from '@/assets/images/nav_upload_thumb_1792739942794.jpg';
import navProfile from '@/assets/images/nav_profile_thumb_1792739943845.jpg';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'หน้าแรก',
    image: navHome,
  },
  {
    href: '/deals',
    label: 'ร้านค้าไอเดีย',
    image: navStore,
  },
  {
    href: '/store',
    label: 'ลงขายไอเดีย',
    image: navUpload,
  },
  {
    href: '/profile',
    label: 'โปรไฟล์',
    image: navProfile,
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const { files, purchases, activeCategory, setActiveCategory } = useStore();

  const isNavActive = (href: string) => {
    if (href === '/') return loc === '/';
    if (href === '/deals') return loc === '/deals';
    if (href === '/store') return loc === '/store' || loc === '/admin';
    return loc === href;
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-24">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>

      {/* Top Header with App Logo & Active Theme Glow */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        {/* Ambient Top Glow Line */}
        <div
          className="h-[2px] w-full transition-all duration-500"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--app-theme-color, #00F0FF), transparent)',
          }}
        />

        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
          <Link href="/" className="group flex shrink-0 items-center gap-3 whitespace-nowrap">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-primary/50 shadow-md transition-transform group-hover:scale-105">
              <img
                src={appLogo}
                alt="SHOPSHUD Logo"
                onError={(e) => {
                  e.currentTarget.src = '/images/app_logo_shopshud_1792739922486.jpg';
                }}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="flex flex-col">
              <span className="font-display text-lg font-bold leading-none tracking-tight text-foreground">
                SHOPSHUD
              </span>
              <span className="mt-1 text-[10px] text-primary font-semibold transition-colors">
                ศูนย์รวมไฟล์ดิจิทัล
              </span>
            </span>
          </Link>

          {/* Active Theme Color Pill */}
          <div className="flex items-center gap-2">
            {activeCategory !== 'all' ? (
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-foreground hover:bg-secondary border border-border/70 transition-all shadow-xs"
                title="คลิกเพื่อรีเซ็ตกลับเป็นสีเริ่มต้น"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: 'var(--app-theme-color, #00F0FF)',
                    boxShadow: '0 0 8px var(--app-theme-color, #00F0FF)',
                  }}
                />
                <span className="hidden sm:inline text-muted-foreground font-normal">ธีมสี:</span>
                <span className="text-primary font-bold">
                  {CATEGORY_MAP[activeCategory]?.name}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1">✕ รีเซ็ต</span>
              </button>
            ) : (
              <span className="hidden text-xs text-muted-foreground sm:block font-medium">
                สร้างสรรค์ · แบ่งปัน · เติบโต
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        {children}
      </main>

      {/* Bottom Floating Navigation (with real thumbnail images, no icons) */}
      <nav
        aria-label="เมนูหลักด้านล่าง"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 shadow-[0_-8px_24px_rgba(20,40,40,0.2)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:bottom-4 md:left-1/2 md:right-auto md:w-[min(620px,calc(100%-2rem))] md:-translate-x-1/2 md:rounded-2xl md:border md:shadow-2xl"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1 px-2 py-2 md:px-3">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item.href);
            const badgeCount =
              item.href === '/store'
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
                    ? 'bg-primary text-primary-foreground shadow-md ring-1 ring-primary/40'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <div
                    className={`h-6 w-6 overflow-hidden rounded-md border transition-transform ${
                      active
                        ? 'border-primary-foreground/80 scale-105 shadow-xs'
                        : 'border-border/60 opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      onError={(e) => {
                        const navFallback: Record<string, string> = {
                          'หน้าแรก': '/images/nav_home_thumb_1792739942258.jpg',
                          'ร้านค้า': '/images/nav_store_thumb_1792739942730.jpg',
                          'ลงขายไฟล์': '/images/nav_upload_thumb_1792739942794.jpg',
                          'โปรไฟล์': '/images/nav_profile_thumb_1792739943845.jpg',
                        };
                        if (navFallback[item.label]) {
                          e.currentTarget.src = navFallback[item.label];
                        }
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {badgeCount > 0 && (item.href === '/store' || item.href === '/profile') && (
                    <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-accent-foreground shadow-xs">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </div>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

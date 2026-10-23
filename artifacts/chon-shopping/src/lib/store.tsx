import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loadAppState, saveAppState, type AppState } from './storage';
import type { CategoryId, DigitalFile, PurchaseRecord, UserProfile } from './types';

interface StoreContextValue {
  files: DigitalFile[];
  activeCategory: CategoryId | 'all';
  setActiveCategory: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addFile: (data: Omit<DigitalFile, 'id' | 'createdAt' | 'downloadCount' | 'rating'>) => DigitalFile;
  deleteFile: (id: string) => void;
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  purchases: PurchaseRecord[];
  buyFile: (file: DigitalFile) => PurchaseRecord;
  hasPurchased: (fileId: string) => boolean;
  totalEarnings: number;
  totalSalesCount: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function hexToHsl(hex: string): { hslStr: string; isLight: boolean } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);
  const hslStr = `${h} ${sPct}% ${lPct}%`;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  const isLight = luminance > 0.55;

  return { hslStr, isLight };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Dynamic Theme Switching: When activeCategory changes, switch whole app's theme colors
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    if (activeCategory === 'all') {
      // Default SHOPSHUD neon theme
      root.style.setProperty('--primary', '213 100% 58%');
      root.style.setProperty('--primary-foreground', '225 68% 7%');
      root.style.setProperty('--ring', '213 100% 62%');
      root.style.setProperty('--sidebar-primary', '213 100% 58%');
      root.style.setProperty('--app-theme-color', '#00F0FF');
      root.style.setProperty('--app-theme-glow', 'rgba(0, 240, 255, 0.45)');
    } else {
      const categoryColors: Record<CategoryId, string> = {
        music: '#00F0FF',
        photo: '#3B82F6',
        drawing: '#A855F7',
        exam: '#06B6D4',
        ebook: '#F59E0B',
        home: '#EAB308',
        electronics: '#3B82F6',
        beauty: '#EC4899',
        sport: '#10B981',
        fashion: '#F43F5E',
        desk: '#6366F1',
        food: '#F97316',
        baby: '#FB7185',
        travel: '#14B8A6',
        auto: '#EF4444',
        pets: '#84CC16',
        books: '#D97706',
      };

      const targetHex = categoryColors[activeCategory] || '#00F0FF';
      const { hslStr, isLight } = hexToHsl(targetHex);

      root.style.setProperty('--primary', hslStr);
      root.style.setProperty('--primary-foreground', isLight ? '225 68% 7%' : '0 0% 100%');
      root.style.setProperty('--ring', hslStr);
      root.style.setProperty('--sidebar-primary', hslStr);
      root.style.setProperty('--app-theme-color', targetHex);
      root.style.setProperty('--app-theme-glow', `${targetHex}55`);
    }
  }, [activeCategory]);

  const addFile = useCallback(
    (data: Omit<DigitalFile, 'id' | 'createdAt' | 'downloadCount' | 'rating'>): DigitalFile => {
      const newFile: DigitalFile = {
        ...data,
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        downloadCount: 0,
        rating: 5.0,
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        files: [newFile, ...prev.files],
      }));

      toast({
        title: 'ลงขายไฟล์สำเร็จ!',
        description: `ไฟล์ "${newFile.title}" ถูกจัดเข้าหมวดหมู่ในหน้าแรกเรียบร้อยแล้ว`,
      });

      return newFile;
    },
    [toast]
  );

  const deleteFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const target = prev.files.find((f) => f.id === id);
        return {
          ...prev,
          files: prev.files.filter((f) => f.id !== id),
        };
      });

      toast({
        title: 'ลบไฟล์เรียบร้อย',
        description: 'นำไฟล์ออกจากหน้าร้านและหน้าแรกแล้ว',
      });
    },
    [toast]
  );

  const updateProfile = useCallback(
    (data: Partial<UserProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...data },
      }));

      toast({
        title: 'บันทึกโปรไฟล์เรียบร้อย',
      });
    },
    [toast]
  );

  const buyFile = useCallback(
    (file: DigitalFile): PurchaseRecord => {
      const record: PurchaseRecord = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fileId: file.id,
        title: file.title,
        category: file.category,
        price: file.price,
        fileFormat: file.fileFormat,
        fileSize: file.fileSize,
        licenseType: file.licenseType,
        sellerName: file.sellerName,
        sellerLineId: file.sellerLineId || '@shopshud_seller',
        purchasedAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        purchases: [record, ...prev.purchases],
        files: prev.files.map((f) =>
          f.id === file.id ? { ...f, downloadCount: (f.downloadCount || 0) + 1 } : f
        ),
      }));

      toast({
        title: 'บันทึกรายการสั่งซื้อเรียบร้อย!',
        description: `เปิดแชท LINE กับ ${file.sellerName} (${file.sellerLineId || '@shopshud_seller'}) เพื่อชำระเงินและรับไฟล์ได้ทันที`,
      });

      return record;
    },
    [toast]
  );

  const hasPurchased = useCallback(
    (fileId: string) => {
      return state.purchases.some((p) => p.fileId === fileId);
    },
    [state.purchases]
  );

  const totalEarnings = useMemo(() => {
    return state.purchases.reduce((sum, item) => sum + item.price, 0);
  }, [state.purchases]);

  const totalSalesCount = useMemo(() => {
    return state.files.reduce((sum, file) => sum + (file.downloadCount || 0), 0);
  }, [state.files]);

  const contextValue = useMemo<StoreContextValue>(
    () => ({
      files: state.files,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      addFile,
      deleteFile,
      profile: state.profile,
      updateProfile,
      purchases: state.purchases,
      buyFile,
      hasPurchased,
      totalEarnings,
      totalSalesCount,
    }),
    [
      state.files,
      activeCategory,
      searchQuery,
      addFile,
      deleteFile,
      state.profile,
      updateProfile,
      state.purchases,
      buyFile,
      hasPurchased,
      totalEarnings,
      totalSalesCount,
    ]
  );

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

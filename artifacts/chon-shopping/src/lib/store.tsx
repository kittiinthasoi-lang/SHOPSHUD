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

export function StoreProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

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
        purchasedAt: new Date().toISOString(),
        downloadToken: `dl_${Math.random().toString(36).substring(2, 12)}`,
      };

      setState((prev) => ({
        ...prev,
        purchases: [record, ...prev.purchases],
        files: prev.files.map((f) =>
          f.id === file.id ? { ...f, downloadCount: (f.downloadCount || 0) + 1 } : f
        ),
      }));

      toast({
        title: file.price === 0 ? 'รับไฟล์ฟรีสำเร็จ!' : 'ชำระเงินและรับไฟล์สำเร็จ!',
        description: `สามารถดาวน์โหลดไฟล์ "${file.title}" ได้ทันทีจากหน้าโปรไฟล์ของคุณ`,
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

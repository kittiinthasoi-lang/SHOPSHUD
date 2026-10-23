import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PRODUCTS } from './seed';
import { emptyState, loadState, saveState, type LocalState } from './storage';
import type { Product } from './types';

interface Ctx {
  state: LocalState;
  storageOk: boolean;
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  recordSearch: (term: string) => void;
  recordClick: (id: string) => void;
  resetCounters: () => void;
  purchase: Product | null;
  openPurchase: (p: Product) => void;
  closePurchase: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);
const ids = PRODUCTS.map((p) => p.id);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [init] = useState(() => loadState(ids));
  const [state, setState] = useState<LocalState>(init.state);
  const [storageOk, setStorageOk] = useState(init.healthy);
  const [purchase, setPurchase] = useState<Product | null>(null);

  useEffect(() => {
    setStorageOk(saveState(state));
  }, [state]);

  const toggleCompare = useCallback(
    (id: string) => {
      if (state.compare.includes(id)) {
        setState((s) => ({ ...s, compare: s.compare.filter((x) => x !== id) }));
        return;
      }
      if (state.compare.length >= 3) {
        toast({
          title: 'เทียบได้สูงสุด 3 ชิ้น',
          description: 'เอาสินค้าออกอย่างน้อย 1 ชิ้นก่อนเพิ่มชิ้นใหม่',
          variant: 'destructive',
        });
        return;
      }
      setState((s) => ({ ...s, compare: [...s.compare, id] }));
    },
    [state.compare, toast],
  );

  const value = useMemo<Ctx>(
    () => ({
      state,
      storageOk,
      toggleCompare,
      removeCompare: (id) => setState((s) => ({ ...s, compare: s.compare.filter((x) => x !== id) })),
      clearCompare: () => setState((s) => ({ ...s, compare: [] })),
      recordSearch: (term) =>
        setState((s) => {
          const t = term.trim().toLowerCase().slice(0, 40);
          return {
            ...s,
            searches: s.searches + 1,
            searchTerms: t ? { ...s.searchTerms, [t]: (s.searchTerms[t] ?? 0) + 1 } : s.searchTerms,
          };
        }),
      recordClick: (id) => setState((s) => ({ ...s, clicks: { ...s.clicks, [id]: (s.clicks[id] ?? 0) + 1 } })),
      resetCounters: () => setState((s) => ({ ...emptyState(), compare: s.compare })),
      purchase,
      openPurchase: setPurchase,
      closePurchase: () => setPurchase(null),
    }),
    [state, storageOk, toggleCompare, purchase],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): Ctx {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}

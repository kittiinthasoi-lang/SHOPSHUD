const KEY = 'chonchad:v1';

export interface LocalState {
  v: 1;
  compare: string[];
  searches: number;
  clicks: Record<string, number>;
  searchTerms: Record<string, number>;
}

export const emptyState = (): LocalState => ({ v: 1, compare: [], searches: 0, clicks: {}, searchTerms: {} });

const isCount = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n >= 0;

export function loadState(validIds: string[]): { state: LocalState; healthy: boolean } {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { state: emptyState(), healthy: true };
    const d = JSON.parse(raw);
    if (!d || d.v !== 1) return { state: emptyState(), healthy: true };
    const s = emptyState();
    if (Array.isArray(d.compare))
      s.compare = d.compare.filter((x: unknown): x is string => typeof x === 'string' && validIds.includes(x)).slice(0, 3);
    if (isCount(d.searches)) s.searches = Math.floor(d.searches);
    for (const field of ['clicks', 'searchTerms'] as const) {
      if (d[field] && typeof d[field] === 'object') {
        for (const [k, v] of Object.entries(d[field])) if (isCount(v)) s[field][k] = Math.floor(v);
      }
    }
    return { state: s, healthy: true };
  } catch {
    return { state: emptyState(), healthy: false };
  }
}

export function saveState(s: LocalState): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

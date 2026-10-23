import type { DigitalFile, PurchaseRecord, UserProfile } from './types';

const STORAGE_KEY = 'shopshud_digital_store_v1';

export interface AppState {
  version: 1;
  files: DigitalFile[];
  profile: UserProfile;
  purchases: PurchaseRecord[];
}

export const initialProfile: UserProfile = {
  displayName: 'ผู้สร้างดิจิทัล',
  handle: '@creator_digital',
  bio: 'สร้างสรรค์และแบ่งปันไฟล์ดิจิทัลคุณภาพ มีลิขสิทธิ์ถูกต้อง พร้อมส่งมอบงานรวดเร็ว',
  email: 'creator@shopshud.local',
  promptPay: '081-999-8888',
  avatarUrl: '',
  joinedDate: 'ตุลาคม 2026',
};

export const defaultState = (): AppState => ({
  version: 1,
  files: [], // Empty as explicitly requested: "ไม่ต้องใส่ข้อมูลจำลองเอาแค่โครงสร้างตามนี้"
  profile: initialProfile,
  purchases: [],
});

export function loadAppState(): AppState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return defaultState();

    return {
      version: 1,
      files: Array.isArray(data.files) ? data.files : [],
      profile: data.profile ? { ...initialProfile, ...data.profile } : initialProfile,
      purchases: Array.isArray(data.purchases) ? data.purchases : [],
    };
  } catch (error) {
    console.error('Failed to load local app state:', error);
    return defaultState();
  }
}

export function saveAppState(state: AppState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Failed to save local app state:', error);
    return false;
  }
}

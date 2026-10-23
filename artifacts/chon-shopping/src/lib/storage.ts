import type { DigitalFile, PurchaseRecord, UserProfile } from './types';

const STORAGE_KEY = 'shopshud_digital_store_v1';

export interface AppState {
  version: 1;
  files: DigitalFile[];
  profile: UserProfile;
  purchases: PurchaseRecord[];
}

export const initialProfile: UserProfile = {
  displayName: 'ร้านความคิดสร้างสรรค์ (My Idea Store)',
  handle: '@my_ideastore',
  bio: 'พื้นที่จำหน่ายความคิด ลิขสิทธิ์ทางปัญญา แผนงาน และผลงานสร้างสรรค์ต้นฉบับ ติดต่อสอบถาม ซื้อขาย และส่งมอบไฟล์ทางเบอร์โทรและ LINE โดยตรง',
  email: 'ideastore@shopshud.local',
  phoneNumber: '081-999-8888',
  lineId: '@shopshud_seller',
  avatarUrl: '',
  bannerUrl: '',
  bannerTheme: 'aurora',
  avatarBorderColor: '#00F0FF',
  storeTagline: 'คลังความคิดและลิขสิทธิ์ไอเดียต้นฉบับ จากสมองสู่ชิ้นงานจริง',
  ideaManifesto: 'เราเชื่อว่าทุกความคิดที่ผ่านการตกผลึกมีคุณค่ามหาศาล ที่นี่คือร้านค้าส่วนตัวที่นำเสนอแนวคิด โครงสร้างระบบ แผนธุรกิจ โน้ตเพลง และผลงานลิขสิทธิ์ที่คุณสามารถนำไปต่อยอดได้จริง ติดต่อเราได้ทันทีทางโทรศัพท์และ LINE',
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

    const loadedProfile = data.profile ? { ...initialProfile, ...data.profile } : initialProfile;
    // Migrate promptPay to phoneNumber if present in old saved state
    if (!loadedProfile.phoneNumber && (data.profile as any)?.promptPay) {
      loadedProfile.phoneNumber = (data.profile as any).promptPay;
    }

    return {
      version: 1,
      files: Array.isArray(data.files) ? data.files : [],
      profile: loadedProfile,
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

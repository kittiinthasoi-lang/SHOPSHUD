import catMusic from '@/assets/images/cat_music_sheet_1792737285960.jpg';
import catPhoto from '@/assets/images/cat_photo_lens_1792737286086.jpg';
import catDrawing from '@/assets/images/cat_drawing_art_1792737286254.jpg';
import catExam from '@/assets/images/cat_exam_learning_1792737288280.jpg';
import catEbook from '@/assets/images/cat_ebook_novel_1792737287503.jpg';
import catHouse from '@/assets/images/cat_house_plan_1792739923632.jpg';

export type CategoryId =
  | 'music'
  | 'photo'
  | 'drawing'
  | 'exam'
  | 'ebook'
  | 'home'
  | 'electronics'
  | 'beauty'
  | 'sport'
  | 'fashion'
  | 'desk'
  | 'food'
  | 'baby'
  | 'travel'
  | 'auto'
  | 'pets'
  | 'books';

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  image: string;
  fileExtensions: string[];
  accentColor: string;
  colorId: string;
  colorLabel: string;
}

export type LicenseType = 'personal' | 'commercial' | 'exclusive';

export interface DigitalFile {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  price: number; // in THB, 0 = Free
  fileFormat: string; // e.g. "MP3", "PDF", "PNG", "PSD", "EPUB", "DWG"
  fileSize: string; // e.g. "18.5 MB"
  licenseType: LicenseType;
  previewUrl?: string; // ภาพตัวอย่างสินค้า
  sampleSnippet?: string; // เนื้อหาตัวอย่าง/แนวคิดตัวอย่างที่มีลายน้ำปิดทับ
  fileName?: string;
  sellerName: string;
  sellerContact?: string;
  sellerLineId: string; // LINE ID สำหรับติดต่อซื้อขายและส่งไฟล์
  sellerPhone?: string; // เบอร์โทรศัพท์ผู้ขาย
  downloadCount: number;
  rating: number;
  createdAt: string;
}

export interface UserProfile {
  displayName: string;
  handle: string;
  bio: string;
  email: string;
  phoneNumber: string; // เบอร์โทรศัพท์สำหรับติดต่อสอบถาม (แทนพร้อมเพย์)
  lineId: string; // LINE ID ผู้ขาย สำหรับซื้อขายและส่งไฟล์
  avatarUrl?: string;
  bannerUrl?: string;
  bannerTheme?: string; // 'aurora' | 'cyber' | 'studio' | 'deep' | 'zen'
  avatarBorderColor?: string; // e.g. '#00F0FF', '#06C755', '#A855F7', '#EAB308'
  storeTagline?: string; // สโลแกนร้านขายความคิด
  ideaManifesto?: string; // ปรัชญาความคิด / Idea Manifesto
  joinedDate: string;
}

export interface PurchaseRecord {
  id: string;
  fileId: string;
  title: string;
  category: CategoryId;
  price: number;
  fileFormat: string;
  fileSize: string;
  licenseType: LicenseType;
  sellerName: string;
  sellerLineId: string;
  purchasedAt: string;
  downloadToken?: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'music',
    name: 'เนื้อเพลง/ดนตรี',
    nameEn: 'Music & Lyrics',
    tagline: 'แทร็กดนตรี ซาวด์เอฟเฟกต์ และเนื้อเพลงพร้อมคอร์ด',
    description: 'ไฟล์เสียงดนตรี แบคกิ้งแทร็ก บีทเพลง จิงเกิ้ลโฆษณา และเนื้อเพลงลิขสิทธิ์แท้',
    image: catMusic,
    fileExtensions: ['.mp3', '.wav', '.midi', '.flac', '.pdf'],
    accentColor: 'from-cyan-500/35 via-blue-500/15',
    colorId: '#00F0FF',
    colorLabel: 'CYAN-01',
  },
  {
    id: 'photo',
    name: 'รูปถ่าย/รูปภาพ',
    nameEn: 'Photos & Images',
    tagline: 'ภาพถ่ายความละเอียดสูงและสต็อกภาพพร้อมใช้งาน',
    description: 'ภาพถ่ายบุคคล ทิวทัศน์ อาหาร สถาปัตยกรรม และสต็อกโฟโต้สำหรับงานพิมพ์และเว็บ',
    image: catPhoto,
    fileExtensions: ['.jpg', '.jpeg', '.raw', '.png', '.tiff'],
    accentColor: 'from-blue-500/35 via-indigo-500/15',
    colorId: '#3B82F6',
    colorLabel: 'AZURE-02',
  },
  {
    id: 'drawing',
    name: 'รูปวาด',
    nameEn: 'Drawings & Digital Art',
    tagline: 'ภาพวาดดิจิทัล ลายเส้น เวกเตอร์ และไอคอน',
    description: 'ภาพประกอบดิจิทัล คาแรคเตอร์ดีไซน์ ลายเส้นเวกเตอร์ แปรง Procreate และกราฟิก',
    image: catDrawing,
    fileExtensions: ['.png', '.psd', '.procreate', '.ai', '.svg'],
    accentColor: 'from-violet-500/35 via-fuchsia-500/10',
    colorId: '#A855F7',
    colorLabel: 'VIOLET-03',
  },
  {
    id: 'exam',
    name: 'ข้อสอบ/แบบเรียน',
    nameEn: 'Exams & Learning',
    tagline: 'คลังข้อสอบ สรุปเนื้อหา และใบงานการศึกษา',
    description: 'แบบฝึกหัด สรุปสอบเตรียมตัวเข้ามหาวิทยาลัย เอกสารประกอบการสอน และข้อสอบพร้อมเฉลย',
    image: catExam,
    fileExtensions: ['.pdf', '.docx', '.pptx', '.zip'],
    accentColor: 'from-sky-400/35 via-blue-500/10',
    colorId: '#06B6D4',
    colorLabel: 'TEAL-04',
  },
  {
    id: 'ebook',
    name: 'E-Book นิยาย',
    nameEn: 'E-Books & Novels',
    tagline: 'นิยายดิจิทัล วรรณกรรม และหนังสืออิเล็กทรอนิกส์',
    description: 'หนังสือนิยาย เรื่องสั้น สารคดี คู่มือพัฒนาตนเอง ในรูปแบบพร้อมเปิดอ่านได้ทุกอุปกรณ์',
    image: catEbook,
    fileExtensions: ['.pdf', '.epub', '.mobi'],
    accentColor: 'from-amber-400/25 via-yellow-500/10',
    colorId: '#F59E0B',
    colorLabel: 'AMBER-05',
  },
  {
    id: 'home',
    name: 'แบบบ้าน',
    nameEn: 'House Plans & Architecture',
    tagline: 'แบบแปลนบ้าน ภาพเรนเดอร์ และโมเดลสถาปัตยกรรม',
    description: 'รวมแบบบ้าน แบบแปลน และไฟล์โมเดลสำหรับงานออกแบบสถาปัตยกรรม',
    image: catHouse,
    fileExtensions: ['.pdf', '.dwg', '.skp', '.fbx', '.obj'],
    accentColor: 'from-yellow-400/35 via-amber-500/20',
    colorId: '#EAB308',
    colorLabel: 'GOLD-06',
  },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryDefinition> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, CategoryDefinition>;

export const LICENSE_LABELS: Record<LicenseType, { title: string; desc: string }> = {
  personal: {
    title: 'สิทธิ์ใช้งานส่วนบุคคล (Personal Use)',
    desc: 'ใช้เพื่อการศึกษา ชื่นชม หรือผลงานส่วนตัว ห้ามนำไปสร้างรายได้เชิงพาณิชย์',
  },
  commercial: {
    title: 'สิทธิ์เชิงพาณิชย์ (Commercial Use)',
    desc: 'อนุญาตให้นำไปใช้ประกอบการค้า โฆษณา หรือผลงานที่มีรายได้ตามเงื่อนไขที่กำหนด',
  },
  exclusive: {
    title: 'ซื้อสิทธิ์ขาด (Exclusive License)',
    desc: 'โอนหรือให้สิทธิ์แต่เพียงผู้เดียว ผู้ขายจะไม่นำไฟล์เดิมไปเปิดขายซ้ำแก่ผู้อื่น',
  },
};

// Legacy compatibility types
export type FeatureKey = string;

export interface StoreOffer {
  id: string;
  storeId?: string;
  storeName: string;
  platform: string;
  price: number;
  originalPrice?: number;
  shippingFee: number;
  shippingText: string;
  url: string;
  affiliateUrl?: string;
  inStock: boolean;
  rating: number;
  badge?: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  platform: string;
  platformColor?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  category: CategoryId;
  price: number;
  originalPrice: number;
  discountPercent: number;
  isDeal: boolean;
  dealBadge?: string;
  image?: string;
  storeId: string;
  rating: number;
  reviewCount: number;
  shippingFee: number;
  shippingText: string;
  shippingEstimate: string;
  features: FeatureKey[];
  specs: { label: string; value: string }[];
  keywords: string[];
  hue: number;
  affiliatePlatform: string;
  commissionRate: number;
  commissionType?: string;
  affiliateUrl: string;
  storeOffers: StoreOffer[];
  reviews: ReviewItem[];
}

import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  FileCheck2,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Mail,
  Music,
  Paintbrush,
  PlusCircle,
  QrCode,
  Save,
  ShieldCheck,
  ShoppingBag,
  Store,
  User,
  Wallet,
} from 'lucide-react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP, LICENSE_LABELS, type CategoryId } from '@/lib/types';

export default function ProfilePage() {
  const { profile, updateProfile, purchases, files, totalEarnings } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  // Profile Form State
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);
  const [email, setEmail] = useState(profile.email);
  const [promptPay, setPromptPay] = useState(profile.promptPay);

  // Active Tab: 'purchases' | 'store-items' | 'finance'
  const [activeTab, setActiveTab] = useState<'purchases' | 'store-items' | 'finance'>('purchases');

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      handle,
      bio,
      email,
      promptPay,
    });
    setIsEditing(false);
  };

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'music':
        return <Music className="h-4 w-4" />;
      case 'photo':
        return <ImageIcon className="h-4 w-4" />;
      case 'drawing':
        return <Paintbrush className="h-4 w-4" />;
      case 'exam':
        return <GraduationCap className="h-4 w-4" />;
      case 'ebook':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Profile Header Card */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-2xl font-bold shadow-md">
              {profile.displayName.slice(0, 1)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {profile.displayName}
                </h1>
                <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                  {profile.handle}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="h-3.5 w-3.5" /> บัญชีผู้ใช้ที่ยืนยันแล้ว
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                {profile.bio || 'ยังไม่มีคำอธิบายโปรไฟล์'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{profile.email}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <QrCode className="h-3.5 w-3.5" />
                  <span>พร้อมเพย์: {profile.promptPay || 'ยังไม่ระบุ'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>เป็นสมาชิกตั้งแต่ {profile.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditing ? 'ยกเลิกแก้ไข' : 'แก้ไขข้อมูล'}</span>
            </button>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:opacity-95 active:scale-95 transition-all"
            >
              <Store className="h-4 w-4" />
              <span>จัดการร้านค้า</span>
            </Link>
          </div>
        </div>

        {/* Edit Profile Accordion Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 border-t border-border/80 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground">แก้ไขข้อมูลโปรไฟล์</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">ชื่อที่แสดง</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">ชื่อผู้ใช้ (@handle)</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">อีเมลติดต่อ</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">เบอร์พร้อมเพย์รับเงิน</label>
                <input
                  type="text"
                  value={promptPay}
                  onChange={(e) => setPromptPay(e.target.value)}
                  placeholder="เช่น 081-xxx-xxxx หรือเลขบัตรประชาชน"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-foreground mb-1">คำแนะนำตัว (Bio)</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95"
              >
                <Save className="h-3.5 w-3.5" />
                <span>บันทึกข้อมูล</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Tabs Navigation */}
      <section className="space-y-6">
        <div className="flex border-b border-border/80 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('purchases')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'purchases'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Download className="h-4 w-4" />
            <span>ไฟล์ที่ฉันซื้อ / ดาวน์โหลดแล้ว ({purchases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('store-items')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'store-items'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>ผลงานที่ฉันลงขาย ({files.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'finance'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span>รายได้และยอดขาย</span>
          </button>
        </div>

        {/* Tab 1: Purchased Downloads */}
        {activeTab === 'purchases' && (
          <div>
            {purchases.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card/50">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-display text-base font-bold text-foreground">
                  ยังไม่มีประวัติการซื้อไฟล์ดิจิทัล
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  เมื่อคุณสั่งซื้อหรือดาวน์โหลดไฟล์จากหน้าแรก รายการไฟล์พร้อมลิงก์ดาวน์โหลดจะมาเก็บไว้ที่นี่ตลอดชีพ
                </p>
                <div className="mt-5">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95"
                  >
                    <span>ค้นหาและเลือกชมไฟล์ในหน้าแรก</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {purchases.map((item) => {
                    const cat = CATEGORY_MAP[item.category];
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between gap-3 hover:border-primary/50 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              {getCategoryIcon(item.category)}
                              <span>{cat?.name}</span>
                            </span>
                            <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded">
                              .{item.fileFormat.toUpperCase()}
                            </span>
                          </div>

                          <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                            {item.title}
                          </h4>

                          <div className="text-[11px] text-muted-foreground space-y-0.5">
                            <div>ขนาดไฟล์: {item.fileSize}</div>
                            <div>สั่งซื้อเมื่อ: {new Date(item.purchasedAt).toLocaleDateString('th-TH')}</div>
                            <div className="text-emerald-600 font-medium">
                              {LICENSE_LABELS[item.licenseType]?.title.split(' ')[0]}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border flex items-center justify-between">
                          <span className="font-semibold text-xs text-primary">
                            {item.price === 0 ? 'ฟรี' : `฿${item.price.toLocaleString('th-TH')}`}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              alert(`เริ่มการดาวน์โหลดไฟล์: ${item.title}.${item.fileFormat.toLowerCase()}`);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            <span>ดาวน์โหลดซ้ำ</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Store Items */}
        {activeTab === 'store-items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                รายการไฟล์ที่คุณได้ลงขายผ่านหน้าร้านค้า
              </p>
              <Link
                href="/store"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>ลงไฟล์ขายเพิ่ม</span>
              </Link>
            </div>

            {files.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card/50">
                <Store className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-display text-base font-bold text-foreground">
                  ยังไม่ได้ลงขายไฟล์ใดๆ ในหน้าร้านค้า
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  คุณสามารถเปิดร้านขายไฟล์ดิจิทัลได้ทันที กำหนดราคาและเลือกหมวดหมู่ได้เอง
                </p>
                <div className="mt-5">
                  <Link
                    href="/store"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95"
                  >
                    <span>ไปที่หน้าร้านค้าเพื่อลงขาย</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => {
                  const cat = CATEGORY_MAP[file.category];
                  return (
                    <div
                      key={file.id}
                      className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            {getCategoryIcon(file.category)}
                            <span>{cat?.name}</span>
                          </span>
                          <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded">
                            .{file.fileFormat}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                          {file.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {file.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                        <span className="font-bold text-primary">
                          {file.price === 0 ? 'ฟรี' : `฿${file.price.toLocaleString('th-TH')}`}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          ดาวน์โหลด {file.downloadCount} ครั้ง
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Finance & Earnings */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs text-muted-foreground">รายรับรวมโดยประมาณ</span>
                <div className="font-display text-2xl font-bold text-primary mt-1">
                  ฿{totalEarnings.toLocaleString('th-TH')}
                </div>
                <span className="text-[10px] text-muted-foreground">จากการสั่งซื้อในระบบ</span>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs text-muted-foreground">บัญชีรับเงินอัตโนมัติ</span>
                <div className="font-mono text-lg font-bold text-foreground mt-1">
                  {profile.promptPay || 'ยังไม่ได้ระบุ'}
                </div>
                <span className="text-[10px] text-muted-foreground">พร้อมเพย์มาตรฐาน</span>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs text-muted-foreground">สถานะรอบชำระเงิน</span>
                <div className="text-lg font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>พร้อมโอนรายได้</span>
                </div>
                <span className="text-[10px] text-muted-foreground">ไม่มีค่าธรรมเนียมแอบแฝง</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 text-xs text-muted-foreground space-y-2">
              <h4 className="font-semibold text-foreground text-sm">ข้อตกลงการรับเงินและส่วนแบ่ง</h4>
              <p>
                ผู้สร้างผลงานได้รับส่วนแบ่งรายได้ตามที่กำหนด ระบบไม่มีการหักค่าบริการรายเดือน ผู้ซื้อสามารถชำระเงินตรงและดาวน์โหลดไฟล์ต้นฉบับได้ทันที
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP } from '@/lib/types';

// Preset banner backgrounds
const BANNER_THEMES = [
  {
    id: 'aurora',
    name: 'Aurora Mind (แสงเหนือจินตนาการ)',
    bgClass: 'bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950',
    accentColor: '#10B981',
    dotColor: '#34D399',
  },
  {
    id: 'cyber',
    name: 'Cyber Thought (ไซเบอร์สมองกล)',
    bgClass: 'bg-gradient-to-r from-cyan-950 via-blue-950 to-purple-950',
    accentColor: '#00F0FF',
    dotColor: '#38BDF8',
  },
  {
    id: 'studio',
    name: 'Creative Studio (สตูดิโอศิลป์)',
    bgClass: 'bg-gradient-to-r from-amber-950 via-stone-900 to-rose-950',
    accentColor: '#F59E0B',
    dotColor: '#FBBF24',
  },
  {
    id: 'deep',
    name: 'Deep Cosmos (ห้วงอวกาศความคิด)',
    bgClass: 'bg-gradient-to-r from-purple-950 via-black to-indigo-950',
    accentColor: '#A855F7',
    dotColor: '#C084FC',
  },
  {
    id: 'zen',
    name: 'Minimalist Zen (มินิมอลโมเดิร์น)',
    bgClass: 'bg-gradient-to-r from-zinc-900 via-neutral-900 to-stone-900',
    accentColor: '#E2E8F0',
    dotColor: '#94A3B8',
  },
];

// Preset avatar styles
const AVATAR_GLOW_COLORS = [
  { name: 'นีออนไซอัน', value: '#00F0FF' },
  { name: 'เขียว LINE', value: '#06C755' },
  { name: 'ทองประกาย', value: '#EAB308' },
  { name: 'ม่วงวิชั่น', value: '#A855F7' },
  { name: 'ชมพูไฟเออร์', value: '#EC4899' },
  { name: 'ขาวมินิมอล', value: '#FFFFFF' },
];

export default function ProfilePage() {
  const { profile, updateProfile, purchases, files, totalEarnings } = useStore();
  
  // Single edit mode controlling the unified edit flow
  const [isEditing, setIsEditing] = useState(false);
  // Default to 'decoration' so when the user clicks "แก้ไขโปรไฟล์", they immediately see "ตกแต่งโปรไฟล์"
  const [editTab, setEditTab] = useState<'decoration' | 'info'>('decoration');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Profile Form State
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);
  const [email, setEmail] = useState(profile.email);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '081-999-8888');
  const [lineId, setLineId] = useState(profile.lineId || '@shopshud_seller');

  // Decoration State
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl || '');
  const [bannerTheme, setBannerTheme] = useState(profile.bannerTheme || 'aurora');
  const [avatarBorderColor, setAvatarBorderColor] = useState(profile.avatarBorderColor || '#00F0FF');
  const [storeTagline, setStoreTagline] = useState(
    profile.storeTagline || 'คลังความคิดและลิขสิทธิ์ไอเดียต้นฉบับ จากสมองสู่ชิ้นงานจริง'
  );
  const [ideaManifesto, setIdeaManifesto] = useState(
    profile.ideaManifesto ||
      'เราเชื่อว่าทุกความคิดที่ผ่านการตกผลึกมีคุณค่ามหาศาล ที่นี่คือร้านค้าส่วนตัวที่นำเสนอแนวคิด โครงสร้างระบบ แผนธุรกิจ โน้ตเพลง และผลงานลิขสิทธิ์ที่คุณสามารถนำไปต่อยอดได้จริง ติดต่อเราได้ทันทีทางโทรศัพท์และ LINE'
  );

  // Active Tab: 'store-items' | 'purchases' | 'manifesto' | 'finance'
  const [activeTab, setActiveTab] = useState<'store-items' | 'purchases' | 'manifesto' | 'finance'>('store-items');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleOpenEdit = () => {
    // Sync local form state with profile store
    setDisplayName(profile.displayName);
    setHandle(profile.handle);
    setBio(profile.bio);
    setEmail(profile.email);
    setPhoneNumber(profile.phoneNumber || '081-999-8888');
    setLineId(profile.lineId || '@shopshud_seller');
    setAvatarUrl(profile.avatarUrl || '');
    setBannerUrl(profile.bannerUrl || '');
    setBannerTheme(profile.bannerTheme || 'aurora');
    setAvatarBorderColor(profile.avatarBorderColor || '#00F0FF');
    setStoreTagline(profile.storeTagline || 'คลังความคิดและลิขสิทธิ์ไอเดียต้นฉบับ จากสมองสู่ชิ้นงานจริง');
    setIdeaManifesto(profile.ideaManifesto || 'เราเชื่อว่าทุกความคิดที่ผ่านการตกผลึกมีคุณค่ามหาศาล ที่นี่คือร้านค้าส่วนตัวที่นำเสนอแนวคิด โครงสร้างระบบ แผนธุรกิจ โน้ตเพลง และผลงานลิขสิทธิ์ที่คุณสามารถนำไปต่อยอดได้จริง ติดต่อเราได้ทันทีทางโทรศัพท์และ LINE');
    
    // When clicking "แก้ไขโปรไฟล์", the user immediately meets "ตกแต่งโปรไฟล์"
    setEditTab('decoration');
    setIsEditing(true);
  };

  const handleSaveAll = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      handle,
      bio,
      email,
      phoneNumber,
      lineId,
      avatarUrl,
      bannerUrl,
      bannerTheme,
      avatarBorderColor,
      storeTagline,
      ideaManifesto,
    });
    setIsEditing(false);
  };

  // Resolve current banner styling
  const currentBannerTheme = BANNER_THEMES.find((t) => t.id === profile.bannerTheme) || BANNER_THEMES[0];
  const activeBannerBg = profile.bannerUrl
    ? { backgroundImage: `url(${profile.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  const cleanPhone = (profile.phoneNumber || '0819998888').replace(/[^0-9]/g, '');
  const cleanLine = (profile.lineId || '@shopshud_seller').replace('@', '');

  return (
    <div className="space-y-8">
      {/* Toast alert on copy */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-foreground text-background px-4 py-2.5 shadow-2xl text-xs font-semibold flex items-center gap-2 border border-border animate-in fade-in slide-in-from-bottom-2">
          <span>✓</span>
          <span>คัดลอก {copiedText} เรียบร้อยแล้ว!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HERO SECTION: แบนเนอร์อัตลักษณ์ร้านค้าความคิด                             */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all">
        {/* Banner Area */}
        <div
          className={`h-40 sm:h-52 w-full relative transition-all duration-300 ${
            !profile.bannerUrl ? currentBannerTheme.bgClass : ''
          }`}
          style={activeBannerBg}
        >
          {/* Subtle Ambient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />

          {/* Banner Tag / Mode Badge */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/15 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              ร้านค้าขายความคิดของฉัน (Personal Idea Store)
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              ● ลิขสิทธิ์แท้ 100%
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN PROFILE CARD: เรียงตามลำดับที่กำหนดอย่างเคร่งครัด                   */}
        {/* 1. รูป                                                                  */}
        {/* 2. ชื่อ                                                                 */}
        {/* 3. ไลน์                                                                 */}
        {/* 4. อีเมล                                                                */}
        {/* 5. เบอร์โทร                                                              */}
        {/* --------------------------------                                        */}
        {/* แก้ไขโปรไฟล์ (กดเข้ามาจะเจอ ตกแต่งโปรไฟล์)                                */}
        {/* ========================================================================= */}
        <div className="relative px-6 sm:px-10 pb-8 pt-0 -mt-16 sm:-mt-20 space-y-6">
          
          {/* 1. รูป (Profile Avatar) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="relative">
              <div
                className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-105 bg-card"
                style={{
                  boxShadow: `0 0 28px -2px ${profile.avatarBorderColor || '#00F0FF'}77`,
                  border: `3.5px solid ${profile.avatarBorderColor || '#00F0FF'}`,
                }}
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-card via-secondary to-primary/30 flex flex-col items-center justify-center text-foreground font-display">
                    <span className="text-4xl">💡</span>
                    <span className="text-[11px] font-mono font-bold tracking-wider opacity-90 mt-1">
                      IDEA STORE
                    </span>
                  </div>
                )}
                <div
                  className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border-2 border-background shadow-sm"
                  style={{ backgroundColor: profile.avatarBorderColor || '#00F0FF' }}
                  title="สถานะเปิดรับออเดอร์ไอเดีย"
                />
              </div>
            </div>

            {/* Quick Status / Identity Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-secondary/80 border border-border px-3 py-1.5 text-xs font-semibold text-foreground">
                <span>🧠</span>
                <span>ผู้สร้างสรรค์ & เจ้าของลิขสิทธิ์</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                <span>✓</span>
                <span>พร้อมส่งมอบไฟล์</span>
              </span>
            </div>
          </div>

          {/* 2. ชื่อ (Name & Identity) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {profile.displayName}
              </h1>
              <span className="text-sm font-mono text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                {profile.handle}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                ✓ เจ้าของความคิดต้นฉบับ
              </span>
            </div>

            {/* Slogan / Store Tagline */}
            <p className="text-sm font-semibold text-primary">
              {profile.storeTagline || 'คลังความคิดและลิขสิทธิ์ไอเดียต้นฉบับ จากสมองสู่ชิ้นงานจริง'}
            </p>

            {/* Bio description */}
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {profile.bio || 'ยังไม่มีคำอธิบายร้านค้าความคิด สามารถกดปุ่มแก้ไขโปรไฟล์ด้านล่างเพื่อเพิ่มคำอธิบาย'}
            </p>
          </div>

          {/* Contact Details Stack: ไลน์ -> อีเมล -> เบอร์โทร */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            
            {/* 3. ไลน์ (LINE ID) */}
            <div className="rounded-2xl border border-[#06C755]/30 bg-[#06C755]/10 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#06C755] text-white font-bold text-xl shadow-sm">
                  💬
                </div>
                <div className="text-left min-w-0">
                  <span className="block text-[10px] text-[#06C755] font-bold uppercase tracking-wider">
                    ไลน์ (LINE ID สำหรับสั่งซื้อและรับไฟล์)
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground truncate block">
                    {profile.lineId || '@shopshud_seller'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`https://line.me/R/ti/p/~${cleanLine}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-[#06C755] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#05b34c] shadow-xs transition-colors"
                  title="เปิดคุยทาง LINE"
                >
                  แชท
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(cleanLine, 'LINE ID')}
                  className="inline-flex items-center rounded-xl border border-[#06C755]/40 bg-background text-[#06C755] hover:text-[#06C755] px-2.5 py-1.5 text-xs font-semibold hover:bg-[#06C755]/15 transition-colors"
                  title="คัดลอก LINE ID"
                >
                  คัดลอก
                </button>
              </div>
            </div>

            {/* 4. อีเมล (Email) */}
            <div className="rounded-2xl border border-border bg-secondary/40 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 font-bold text-xl border border-purple-500/30">
                  ✉️
                </div>
                <div className="text-left min-w-0">
                  <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    อีเมล (Email)
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground truncate block">
                    {profile.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 border border-input px-3 py-1.5 text-xs font-semibold transition-colors"
                  title="ส่งอีเมล"
                >
                  ส่งเมล
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(profile.email, 'อีเมล')}
                  className="inline-flex items-center rounded-xl border border-input bg-background text-muted-foreground hover:text-foreground px-2.5 py-1.5 text-xs font-semibold hover:bg-secondary transition-colors"
                  title="คัดลอกอีเมล"
                >
                  คัดลอก
                </button>
              </div>
            </div>

            {/* 5. เบอร์โทร (Phone Number) */}
            <div className="rounded-2xl border border-border bg-secondary/40 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 font-bold text-xl border border-blue-500/30">
                  📞
                </div>
                <div className="text-left min-w-0">
                  <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    เบอร์โทร (Phone Number สำหรับโทรสอบถาม)
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground truncate block">
                    {profile.phoneNumber || '081-999-8888'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center rounded-xl bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold hover:opacity-95 shadow-xs transition-opacity"
                  title="โทรออกทันที"
                >
                  โทร
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(profile.phoneNumber || '081-999-8888', 'เบอร์โทรศัพท์')}
                  className="inline-flex items-center rounded-xl border border-input bg-background text-muted-foreground hover:text-foreground px-2.5 py-1.5 text-xs font-semibold hover:bg-secondary transition-colors"
                  title="คัดลอกเบอร์โทร"
                >
                  คัดลอก
                </button>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------- */}
          {/* เส้นคั่น (DIVIDER) --------------------------------            */}
          {/* ------------------------------------------------------------- */}
          <div className="relative py-2">
            <div className="border-t-2 border-border/70 border-dashed" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-card px-4 text-[11px] font-mono text-muted-foreground tracking-widest uppercase">
                ⚙️ การจัดการร้านค้าความคิด
              </span>
            </div>
          </div>

          {/* แก้ไขโปรไฟล์ (ACTION BUTTON) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              ต้องการปรับแต่งธีมแบนเนอร์ สีอวาตาร์ สโลแกน หรืออัปเดตข้อมูลการติดต่อร้านค้า?
            </p>

            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground px-6 py-3 text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-95 active:scale-98 transition-all"
            >
              <span>✏️</span>
              <span>แก้ไขโปรไฟล์</span>
              <span className="text-[11px] font-normal opacity-90">(คลิกเพื่อเปิดตกแต่งโปรไฟล์)</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* เมื่อกดเข้ามาจะเจอ "ตกแต่งโปรไฟล์" (EDIT PROFILE MODAL / EXPANDED PANEL)   */}
          {/* ========================================================================= */}
          {isEditing && (
            <div className="rounded-3xl border-2 border-primary/40 bg-card/95 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mt-6">
              
              {/* Header inside Edit View */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                      แก้ไขโปรไฟล์ร้านค้าความคิด
                    </h2>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    กดเข้ามาจะเจอฟังก์ชัน <strong>"ตกแต่งโปรไฟล์"</strong> สำหรับปรับลุคแบนเนอร์ สีแสงสะท้อน และคำสัญญาไอเดีย
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl border border-input text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    ✕ ปิดหน้าต่าง
                  </button>
                </div>
              </div>

              {/* Sub-tabs inside Edit: Defaulted directly to "ตกแต่งโปรไฟล์" */}
              <div className="flex gap-2 p-1.5 rounded-2xl bg-secondary/60 border border-border max-w-md">
                <button
                  type="button"
                  onClick={() => setEditTab('decoration')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    editTab === 'decoration'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>🎨</span>
                  <span>ตกแต่งโปรไฟล์ (ค่าเริ่มต้น)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditTab('info')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    editTab === 'info'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>📝</span>
                  <span>ข้อมูลติดต่อ & ตัวตน</span>
                </button>
              </div>

              {/* Main Edit Form */}
              <form onSubmit={handleSaveAll} className="space-y-6">
                
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: ตกแต่งโปรไฟล์ (PROMINENT / DEFAULT SECTION)             */}
                {/* ------------------------------------------------------------- */}
                {editTab === 'decoration' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    
                    {/* 1. Theme Presets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                          1. เลือกสไตล์แบนเนอร์ร้านค้าความคิด (Banner Theme Presets)
                        </label>
                        <span className="text-[11px] text-primary font-medium">
                          ธีมปัจจุบัน: {currentBannerTheme.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {BANNER_THEMES.map((theme) => {
                          const isSelected = bannerTheme === theme.id && !bannerUrl;
                          return (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => {
                                setBannerTheme(theme.id);
                                setBannerUrl('');
                              }}
                              className={`rounded-2xl p-3 text-left transition-all border ${
                                isSelected
                                  ? 'border-primary ring-2 ring-primary/40 bg-secondary/80 shadow-md scale-102'
                                  : 'border-border bg-card hover:border-border/80 opacity-80 hover:opacity-100'
                              }`}
                            >
                              <div className={`h-12 w-full rounded-xl mb-2.5 ${theme.bgClass} flex items-center justify-center`}>
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                              </div>
                              <div className="font-semibold text-xs text-foreground line-clamp-1">{theme.name}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {isSelected ? '✓ ใช้งานอยู่' : 'คลิกเพื่อเลือก'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">
                          หรือระบุ URL รูปแบนเนอร์ของคุณเอง (Custom Banner URL)
                        </label>
                        <input
                          type="url"
                          value={bannerUrl}
                          onChange={(e) => setBannerUrl(e.target.value)}
                          placeholder="https://... (ปล่อยว่างเพื่อใช้ธีมด้านบน)"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">
                          URL รูปโปรไฟล์ / อวาตาร์ (Avatar URL)
                        </label>
                        <input
                          type="url"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="https://... (ปล่อยว่างเพื่อใช้ไอคอนความคิด 💡)"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* 2. Avatar Glow Ring / Border Color */}
                    <div className="space-y-2.5 pt-1">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                        2. สีขอบแสงสะท้อนของโปรไฟล์ (Avatar Glow Ring)
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        {AVATAR_GLOW_COLORS.map((item) => {
                          const isSelected = avatarBorderColor.toLowerCase() === item.value.toLowerCase();
                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => setAvatarBorderColor(item.value)}
                              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all border ${
                                isSelected
                                  ? 'border-foreground bg-secondary ring-2 ring-primary/50 text-foreground'
                                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-black/30 shrink-0"
                                style={{ backgroundColor: item.value }}
                              />
                              <span>{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Slogan & Idea Manifesto */}
                    <div className="space-y-4 text-xs pt-1">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">
                          3. สโลแกนร้านค้าขายความคิด (Store Tagline)
                        </label>
                        <input
                          type="text"
                          value={storeTagline}
                          onChange={(e) => setStoreTagline(e.target.value)}
                          placeholder="เช่น คลังความคิดและลิขสิทธิ์ไอเดียต้นฉบับ จากสมองสู่ชิ้นงานจริง"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">
                          4. ปรัชญาความคิด & พันธกิจไอเดีย (Idea Manifesto)
                        </label>
                        <textarea
                          rows={3}
                          value={ideaManifesto}
                          onChange={(e) => setIdeaManifesto(e.target.value)}
                          placeholder="เขียนอธิบายความตั้งใจ วิสัยทัศน์ และหลักการขายความคิดของคุณ..."
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden leading-relaxed"
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: ข้อมูลติดต่อ & ตัวตน (ชื่อ, ไลน์, อีเมล, เบอร์โทร)       */}
                {/* ------------------------------------------------------------- */}
                {editTab === 'info' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-150">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        ชื่อร้านค้าความคิด / ผู้สร้าง (ชื่อที่แสดง)
                      </label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        ชื่อผู้ใช้ (@handle)
                      </label>
                      <input
                        type="text"
                        required
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#06C755] mb-1">
                        💬 LINE ID (สำหรับซื้อขายและส่งมอบไฟล์)
                      </label>
                      <input
                        type="text"
                        required
                        value={lineId}
                        onChange={(e) => setLineId(e.target.value)}
                        placeholder="เช่น @shopshud_seller"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-[#06C755] focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        ✉️ อีเมลติดต่อ (Email)
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-blue-400 mb-1">
                        📞 เบอร์โทรศัพท์ (สำหรับโทรสอบถามข้อสงสัย)
                      </label>
                      <input
                        type="text"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="เช่น 081-999-8888"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-foreground mb-1">
                        คำแนะนำตัวร้านค้า (Bio)
                      </label>
                      <textarea
                        rows={2}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Form Footer Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                  <div className="text-[11px] text-muted-foreground hidden sm:block">
                    {editTab === 'decoration' ? '🎨 อยู่ในหน้าตกแต่งโปรไฟล์' : '📝 อยู่ในหน้าข้อมูลติดต่อ'}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-95 active:scale-98 transition-all"
                    >
                      <span>✓</span>
                      <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
                    </button>
                  </div>
                </div>

              </form>

            </div>
          )}

          {/* Quick Metrics Strip */}
          <div className="pt-2 border-t border-border/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl bg-secondary/30 p-3 border border-border/50">
              <span className="text-[11px] text-muted-foreground block">ไอเดียที่เปิดจำหน่าย</span>
              <span className="font-display text-lg font-bold text-foreground tabular-nums">
                {files.length} รายการ
              </span>
            </div>
            <div className="rounded-xl bg-secondary/30 p-3 border border-border/50">
              <span className="text-[11px] text-muted-foreground block">ประวัติการติดต่อซื้อ</span>
              <span className="font-display text-lg font-bold text-primary tabular-nums">
                {purchases.length} ดีล
              </span>
            </div>
            <div className="rounded-xl bg-secondary/30 p-3 border border-border/50">
              <span className="text-[11px] text-muted-foreground block">ติดต่อส่งมอบไฟล์</span>
              <span className="font-semibold text-emerald-400 block truncate">
                LINE & โทรศัพท์โดยตรง
              </span>
            </div>
            <div className="rounded-xl bg-secondary/30 p-3 border border-border/50">
              <span className="text-[11px] text-muted-foreground block">เข้าร่วมร้านค้าตั้งแต่</span>
              <span className="font-medium text-foreground block truncate">
                {profile.joinedDate}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* TABS NAVIGATION: รายการสินค้า, การติดต่อ, ปรัชญาความคิด, สถิติ            */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex border-b border-border/80 gap-6 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('store-items')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'store-items'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>💡 ไอเดียที่ฉันเปิดจำหน่าย ({files.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('purchases')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'purchases'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>💬 ประวัติการติดต่อซื้อทาง LINE ({purchases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manifesto')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'manifesto'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>📜 ปรัชญาความคิด (Idea Manifesto)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'finance'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>📊 มูลค่าไอเดียและสถิติ</span>
          </button>
        </div>

        {/* Tab 1: Store Items / Ideas for Sale */}
        {activeTab === 'store-items' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  คลังความคิดและผลงานที่เปิดให้บูชา/ซื้อสิทธิ์
                </h3>
                <p className="text-xs text-muted-foreground">
                  ผู้ซื้อจะติดต่อสอบถามผ่านเบอร์โทรศัพท์และชำระเงินพร้อมรับไฟล์ทาง LINE โดยตรง
                </p>
              </div>
              <Link
                href="/store"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95 self-start sm:self-auto"
              >
                <span>+ ลงขายความคิดใหม่</span>
              </Link>
            </div>

            {files.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card/50">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl border border-primary/20 mb-4">
                  💡
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  ยังไม่ได้ลงขายความคิดหรือผลงานในร้าน
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                  เริ่มต้นเปลี่ยนไอเดีย โครงการ โน้ตเพลง หรือพิมพ์เขียวของคุณให้เป็นผลงานดิจิทัลที่มีมูลค่าได้ทันที
                </p>
                <div className="mt-5">
                  <Link
                    href="/store"
                    className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95"
                  >
                    <span>ไปที่หน้าลงขายไอเดีย →</span>
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
                      className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between gap-3 hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                          <div className="flex items-center gap-2">
                            {cat && (
                              <div className="h-6 w-6 overflow-hidden rounded-md border border-white/10 shrink-0">
                                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                              </div>
                            )}
                            <span className="text-foreground font-medium">{cat?.name}</span>
                          </div>
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
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">
                            ผู้สนใจ {file.downloadCount} ครั้ง
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Purchased / LINE Contacts */}
        {activeTab === 'purchases' && (
          <div>
            {purchases.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card/50">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#06C755]/15 text-[#06C755] font-bold text-2xl border border-[#06C755]/30 mb-4">
                  💬
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  ยังไม่มีประวัติการติดต่อซื้อความคิดทาง LINE
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                  เมื่อมีคนกดสั่งซื้อไอเดีย ข้อมูลการติดต่อและ LINE ID สำหรับรับไฟล์ต้นฉบับจะถูกบันทึกไว้ที่นี่
                </p>
                <div className="mt-5">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95"
                  >
                    <span>เลือกชมไอเดียในหน้าแรก →</span>
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
                            <div className="flex items-center gap-2">
                              {cat && (
                                <div className="h-6 w-6 overflow-hidden rounded-md border border-white/10 shrink-0">
                                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                                </div>
                              )}
                              <span className="font-medium text-foreground">{cat?.name}</span>
                            </div>
                            <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded">
                              .{item.fileFormat.toUpperCase()}
                            </span>
                          </div>

                          <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                            {item.title}
                          </h4>

                          <div className="text-[11px] text-muted-foreground space-y-1">
                            <div className="flex items-center justify-between">
                              <span>ผู้ขาย: <strong className="text-foreground">{item.sellerName}</strong></span>
                              <span className="font-mono text-[#06C755] font-bold">LINE: {item.sellerLineId || '@shopshud_seller'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>ขนาด: {item.fileSize}</span>
                              <span>{new Date(item.purchasedAt).toLocaleDateString('th-TH')}</span>
                            </div>
                            <div className="text-[10px] text-[#06C755] font-medium bg-[#06C755]/10 px-2 py-0.5 rounded">
                              ● ชำระเงินและรับไฟล์ทาง LINE
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-primary">
                            {item.price === 0 ? 'ฟรี' : `฿${item.price.toLocaleString('th-TH')}`}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const targetLine = (item.sellerLineId || '@shopshud_seller').replace('@', '');
                                handleCopy(targetLine, 'LINE ID');
                              }}
                              className="px-2.5 py-1.5 text-[11px] rounded-lg border border-input text-muted-foreground hover:text-foreground hover:bg-secondary"
                            >
                              คัดลอก ID
                            </button>

                            <a
                              href={`https://line.me/R/ti/p/~${(item.sellerLineId || '@shopshud_seller').replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-xl bg-[#06C755] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#05b34c] transition-colors"
                            >
                              <span>แชท LINE</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Idea Manifesto (ปรัชญาความคิด) */}
        {activeTab === 'manifesto' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl border border-primary/20">
                  🧠
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    ปรัชญาความคิดและพันธกิจของฉัน (Idea Manifesto)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    หลักคิดในการสร้างสรรค์และเหตุผลว่าทำไมเราจึงเปิดร้านค้าขายความคิดแห่งนี้
                  </p>
                </div>
              </div>

              <blockquote className="rounded-2xl border-l-4 border-primary bg-secondary/30 p-5 text-sm sm:text-base text-foreground/90 italic leading-relaxed">
                "{profile.ideaManifesto || 'เราเชื่อว่าทุกความคิดที่ผ่านการตกผลึกมีคุณค่ามหาศาล ที่นี่คือร้านค้าส่วนตัวที่นำเสนอแนวคิด โครงสร้างระบบ แผนธุรกิจ โน้ตเพลง และผลงานลิขสิทธิ์ที่คุณสามารถนำไปต่อยอดได้จริง ติดต่อเราได้ทันทีทางโทรศัพท์และ LINE'}"
              </blockquote>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-2">
                  <div className="text-base font-bold text-foreground flex items-center gap-2">
                    <span>💡</span>
                    <span>ความคิดต้นฉบับ 100%</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ทุกงานสร้างขึ้นจากประสบการณ์จริง มีกระบวนการคิดและพิมพ์เขียวที่จับต้องได้
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-2">
                  <div className="text-base font-bold text-foreground flex items-center gap-2">
                    <span>📞</span>
                    <span>คุยตรงกับเจ้าของไอเดีย</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    โทรปรึกษาหรือส่งข้อความคุยแนวคิดได้ที่เบอร์ {profile.phoneNumber || '081-999-8888'}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-2">
                  <div className="text-base font-bold text-foreground flex items-center gap-2">
                    <span>💬</span>
                    <span>ส่งมอบไฟล์ไวทาง LINE</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    หลังตกลงซื้อขาย ชำระเงินและรับลิงก์ดาวน์โหลดไฟล์คุณภาพสูงผ่าน LINE ทันที
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Finance & Statistics */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs text-muted-foreground">มูลค่าความคิดที่ลงขายรวม</span>
                <div className="font-display text-2xl font-bold text-primary mt-1">
                  ฿{files.reduce((sum, f) => sum + (f.price || 0), 0).toLocaleString('th-TH')}
                </div>
                <span className="text-[10px] text-muted-foreground">จากผลงานทั้งหมด {files.length} รายการ</span>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs text-muted-foreground">ช่องทางโทรติดต่อด่วน</span>
                <div className="font-mono text-lg font-bold text-foreground mt-1">
                  {profile.phoneNumber || '081-999-8888'}
                </div>
                <span className="text-[10px] text-muted-foreground">สายตรงเจ้าของร้านค้าความคิด</span>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs text-muted-foreground">ช่องทางชำระเงินและรับไฟล์</span>
                <div className="font-mono text-lg font-bold text-[#06C755] mt-1">
                  {profile.lineId || '@shopshud_seller'}
                </div>
                <span className="text-[10px] text-muted-foreground">LINE Official ประจำร้าน</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 text-xs text-muted-foreground space-y-2">
              <h4 className="font-semibold text-foreground text-sm">การติดต่อซื้อขายและส่งมอบลิขสิทธิ์</h4>
              <p className="leading-relaxed">
                ร้านค้าความคิดนี้ทำงานในรูปแบบ Creator Direct: ผู้ซื้อโทรศัพท์หรือแชท LINE เพื่อพูดคุยสอบถามรายละเอียด ตกลงการชำระเงิน และผู้ขายจะส่งมอบไฟล์งานต้นฉบับทางห้องแชท LINE โดยตรง ไม่มีค่าธรรมเนียมคนกลาง ได้รับไฟล์แท้ 100%
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

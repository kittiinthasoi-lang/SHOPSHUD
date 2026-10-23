# SHOPSHUD — ร้านค้าผลงานดิจิทัลของเรา

SHOPSHUD เป็นหน้าร้านของเจ้าของผลงานรายเดียว ไม่ใช่ตลาดกลาง ลูกค้าไม่มีสิทธิ์สร้างร้านหรือลงขายผลงาน สินค้าทุกชิ้นต้องเป็นผลงานที่เราสร้างหรือมีสิทธิ์จำหน่ายอย่างถูกต้อง

## สิ่งที่มีใน branch นี้

- หน้าร้านและหน้ารายการผลงานที่อ่านเฉพาะรายการสถานะ `published` จาก API จริง ไม่แสดงสินค้า seed/demo
- หน้าจัดการเจ้าของร้านสำหรับโหลดแคตตาล็อกและบันทึกร่างสินค้าใน PostgreSQL
- API สำหรับอ่านรายการที่เผยแพร่และ CRUD พื้นฐานของเจ้าของร้าน โดยป้องกันด้วย `SHOPSHUD_ADMIN_TOKEN`
- ตรวจเงื่อนไขก่อนเผยแพร่: ต้องมี asset key และสถานะยืนยันไฟล์จริง
- Migration สำหรับตาราง `shopshud_products`
- ไม่มีปุ่มชำระเงินปลอมหรือการอ้างว่าส่งมอบไฟล์สำเร็จ

## ข้อจำกัดสำคัญ — ยังไม่พร้อมรับเงินจริง

การจัดการร่างและ API แคตตาล็อกเป็นส่วนที่พัฒนาไว้ แต่ **ยังไม่มีระบบอัปโหลด/จัดเก็บไฟล์ private ที่เชื่อมต่อจริง, ระบบยืนยัน asset อัตโนมัติ, การเข้าสู่ระบบลูกค้า, การชำระเงินจริง, การส่งมอบไฟล์ให้ผู้ซื้อ หรือการสร้างเอกสารโอนลิขสิทธิ์ที่มีผลทางกฎหมาย** ดังนั้นห้ามตั้ง `assetVerified=true` เองเพื่อหลีกเลี่ยงการตรวจสอบ และอย่าเปิดขายจริงจนกว่าส่วนเหล่านี้จะพัฒนาและทดสอบแล้ว

## ตั้งค่าสภาพแวดล้อมสำหรับพัฒนา

ต้องมี Node.js/NPM ตาม workspace, PostgreSQL และติดตั้ง dependencies ที่ root:

```bash
npm install
```

ตั้งค่า environment ของ API server:

- `DATABASE_URL` — PostgreSQL connection string
- `PORT=3001`
- `SHOPSHUD_ADMIN_TOKEN` — secret แบบสุ่มยาวสำหรับเจ้าของร้าน ตั้งใน secret manager/environment ของ server เท่านั้น ห้าม commit ลง Git
- `SHOPSHUD_ALLOWED_ORIGINS` — production ควรกำหนด origin ของเว็บที่อนุญาต คั่นหลายค่าโดยใช้ comma

ใช้ migration นี้กับฐานข้อมูลก่อนเริ่ม API:

`lib/db/migrations/0001_shopshud_products.sql`

จากนั้นรัน API server ด้วย environment ที่ตั้งค่าแล้ว:

```bash
npm run dev --workspace=@workspace/api-server
```

ใน terminal อีกหน้าต่าง ตั้ง `API_PROXY_TARGET=http://localhost:3001` แล้วรันเว็บ:

```bash
API_PROXY_TARGET=http://localhost:3001 npm run dev --workspace=@workspace/chon-shopping
```

เปิดเว็บตาม URL ที่ Vite แสดง (ค่าเริ่มต้นพอร์ต 3000) ไปที่ `/admin` แล้วกรอก owner token เพื่อโหลดแคตตาล็อกและบันทึกร่างสินค้า หน้าสาธารณะ `/deals` จะแสดงเฉพาะรายการที่เผยแพร่แล้ว

## API ที่มีในขณะนี้

- `GET /api/healthz` — health check
- `GET /api/catalog` — รายการที่เผยแพร่
- `GET /api/owner/catalog` — รายการทั้งหมด (ต้องมี `Authorization: Bearer <SHOPSHUD_ADMIN_TOKEN>`)
- `POST /api/owner/catalog` — สร้างร่างสินค้า
- `PATCH /api/owner/catalog/:id` — แก้ไขข้อมูลหรือพักรายการ
- `DELETE /api/owner/catalog/:id` — ลบร่าง/รายการที่ไม่ได้เผยแพร่

## หลักการด้านสินค้าและสิทธิ์

- ทุกสินค้าต้องมีไฟล์จริง ราคา และเงื่อนไขชัดเจน
- การซื้อไฟล์ไม่เท่ากับการได้รับลิขสิทธิ์โดยอัตโนมัติ
- แยก `file_sale`, `usage_license`, และ `copyright_transfer`
- การโอนลิขสิทธิ์ต้องมีเอกสารเป็นลายลักษณ์อักษรที่เหมาะกับผลงาน คู่สัญญา ขอบเขตสิทธิ์ และกฎหมายที่ใช้บังคับ
- ไฟล์ต้นฉบับต้องอยู่ใน private object storage และส่งให้ผู้ซื้อที่ผ่านการตรวจสอบคำสั่งซื้อเท่านั้น
- ไม่แสดงสินค้าจำลอง รีวิว ยอดขาย หรือสถิติปลอม

## ก่อนใช้งานจริง

ต้องเชื่อม storage และ file verification, auth ลูกค้าและเจ้าของร้านที่เหมาะกับ production, payment provider และ webhook verification, ระบบคำสั่งซื้อ/คืนเงิน, protected download, audit log, backup, rate limits, HTTPS, migrations และ tests พร้อมตรวจด้านกฎหมาย/ภาษี/ความเป็นส่วนตัวในเขตที่ดำเนินธุรกิจ

Repository นี้ยังอยู่ใน branch พัฒนา และยังไม่ได้รับการยืนยัน build/typecheck/integration test บนสภาพแวดล้อมจริง จึงไม่ถือว่า production-ready

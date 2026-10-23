import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, Coins, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { calcCommission, thb } from '@/lib/search';
import { STORE_BY_ID } from '@/lib/seed';
import { useStore } from '@/lib/store';

export function PurchaseDialog() {
  const { purchase, closePurchase } = useStore();
  const store = purchase ? STORE_BY_ID[purchase.storeId] ?? { name: 'ร้านค้าเดโม', city: 'กรุงเทพฯ', platform: purchase.affiliatePlatform } : null;
  const commAmount = purchase ? calcCommission(purchase) : 0;
  const url = purchase?.affiliateUrl || (purchase ? `https://example.com/?demo=1&affiliate=${purchase.affiliatePlatform}&product=${purchase.id}` : '');

  return (
    <Dialog.Root open={!!purchase} onOpenChange={(o) => !o && closePurchase()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[hsl(192_50%_8%/0.6)] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          data-testid="dialog-purchase"
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-card-border bg-card p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0"
        >
          <Dialog.Close aria-label="ปิด" className="absolute right-3 top-3 rounded-lg p-2 hover:bg-secondary" data-testid="button-close-purchase">
            <X className="h-4 w-4" aria-hidden="true" />
          </Dialog.Close>

          <div className="mb-3 flex items-center gap-2 rounded-xl bg-amber-500/15 p-3 text-sm font-semibold text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            เดโมจำลองโปรแกรมแอฟฟิลิเอต (Affiliate Demo)
          </div>

          <Dialog.Title className="font-display text-xl font-bold">{purchase?.name}</Dialog.Title>

          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-secondary/70 p-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">ราคาจำหน่าย</span>
              <p className="font-display text-lg font-bold text-primary">{purchase && thb(purchase.price)}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">ร้านค้าและแหล่งที่มา</span>
              <p className="font-medium text-foreground">{store?.name}</p>
            </div>
            <div className="col-span-2 mt-1 border-t border-border/50 pt-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-medium text-xs">
                <Coins className="h-4 w-4 text-amber-500" />
                โปรแกรม {purchase?.affiliatePlatform}
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                ค่าคอมมิชชั่น {purchase?.commissionRate}% (~{thb(commAmount)})
              </span>
            </div>
          </div>

          <Dialog.Description className="mt-3 text-xs text-muted-foreground leading-relaxed">
            ในระบบจริง ลิงก์นี้จะส่งต่อไปยังหน้าสินค้าบน {purchase?.affiliatePlatform} พร้อมรหัส Affiliate Tag สำหรับบันทึกยอดขายและคำนวณค่าคอมมิชชั่น
            ในโหมดเดโมปัจจุบัน ลิงก์ด้านล่างจะเปิดเป็นตัวอย่างจำลอง
          </Dialog.Description>

          <div className="mt-3">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">ลิงก์ Affiliate Demo:</span>
            <p className="break-all rounded-lg bg-muted p-2.5 font-mono text-xs text-foreground/90 select-all" data-testid="text-demo-url">
              {url}
            </p>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close className="rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-secondary" data-testid="button-cancel-purchase">
              ปิดหน้าต่าง
            </Dialog.Close>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={closePurchase}
              data-testid="link-demo-url"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              เปิดลิงก์แอฟฟิลิเอตตัวอย่าง <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

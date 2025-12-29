import { inject, Injectable, signal } from "@angular/core"
import { IPurchase } from "../../../core/models/purchase.interface"
import { PurchasesApiService } from "../../../core/api/purchases/purchases-api.service"
@Injectable({
    providedIn: 'root'
})
export class PaymentStatusService {
    private purchaseCheckInterval = 2500
    private purchaseCheckTimer: ReturnType<typeof setInterval> | null = null
    public purchase = signal<IPurchase | null>(null)
    private purchasesApiService = inject(PurchasesApiService)
    public startPaymentStatusCheck(purchaseUuid: string): void {
        this.purchaseCheckTimer = setInterval(() => {
            if (this.purchase()?.paymentStatus != 'pending') {
                this.stopPaymentStatusCheck()
            }
            this.purchasesApiService.getPurchaseByUuidNoLoader(purchaseUuid).subscribe((purchase) => {
                this.purchase.set(purchase)
            })
        }, this.purchaseCheckInterval)
    }
    public stopPaymentStatusCheck(): void {
        if (this.purchaseCheckTimer) {
            clearInterval(this.purchaseCheckTimer)
            this.purchaseCheckTimer = null
        }
    }
}
import { Routes } from "@angular/router";
import { PurchasePageComponent } from "../pages/purchase-page/purchase-page.component";
import { PaymentStatusPageComponent } from "../pages/payment-status-page/payment-status-page.component";

export const purchaseRoutes: Routes = [
    {
        path: 'payment-status',
        component: PaymentStatusPageComponent,
    },
    {
        path: ':productId',
        component: PurchasePageComponent,
    },
 
]
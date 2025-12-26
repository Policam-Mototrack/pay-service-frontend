import { Routes } from "@angular/router";
import { PurchasePageComponent } from "../pages/purchase-page/purchase-page.component";

export const purchaseRoutes: Routes = [
    {
        path: ':productId',
        component: PurchasePageComponent,
    }
]
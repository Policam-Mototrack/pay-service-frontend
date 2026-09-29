import { Routes } from '@angular/router'
import { sellerAuthGuard, sellerGuestGuard } from '../guards/seller-auth.guard'
import { SellerLoginPageComponent } from '../pages/login-page/seller-login-page.component'
import { SellerProductsPageComponent } from '../pages/products-page/seller-products-page.component'
import { SellerProductSalesPageComponent } from '../pages/product-sales-page/seller-product-sales-page.component'
import { SellerPurchasesPageComponent } from '../pages/purchases-page/seller-purchases-page.component'
import { SellerPurchaseDetailPageComponent } from '../pages/purchase-detail-page/seller-purchase-detail-page.component'

export const sellerCabinetRoutes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [sellerGuestGuard],
    component: SellerLoginPageComponent,
  },
  {
    path: 'products',
    canActivate: [sellerAuthGuard],
    component: SellerProductsPageComponent,
  },
  {
    path: 'products/:id',
    canActivate: [sellerAuthGuard],
    component: SellerProductSalesPageComponent,
  },
  {
    path: 'purchases',
    canActivate: [sellerAuthGuard],
    component: SellerPurchasesPageComponent,
  },
  {
    path: 'purchases/:uuid',
    canActivate: [sellerAuthGuard],
    component: SellerPurchaseDetailPageComponent,
  },
]

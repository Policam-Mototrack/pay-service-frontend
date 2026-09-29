import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { SellerAuthService } from '../services/seller-auth.service'

export const sellerAuthGuard: CanActivateFn = () => {
  const sellerAuthService = inject(SellerAuthService)
  const router = inject(Router)

  if (sellerAuthService.isAuthenticated()) {
    return true
  }

  return router.createUrlTree(['/seller/login'])
}

export const sellerGuestGuard: CanActivateFn = () => {
  const sellerAuthService = inject(SellerAuthService)
  const router = inject(Router)

  if (!sellerAuthService.isAuthenticated()) {
    return true
  }

  return router.createUrlTree(['/seller/products'])
}

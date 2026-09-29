import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { SellerAuthService } from '../../features/seller-cabinet/services/seller-auth.service'

export const SellerAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const isSellerRequest = req.url.includes('/seller/')
  if (!isSellerRequest || req.url.includes('/seller/auth/login')) {
    return next(req)
  }

  const sellerAuthService = inject(SellerAuthService)
  const token = sellerAuthService.getAccessToken()
  if (!token) {
    return next(req)
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  )
}

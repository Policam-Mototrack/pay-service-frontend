import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import {
  DTOSellerAccount,
  DTOSellerDocument,
  DTOSellerProduct,
  DTOSellerProductSale,
  DTOSellerPurchase,
  DTOSellerStore,
  ISellerAccount,
  ISellerAccountResponse,
  ISellerAuthResponse,
  ISellerDocument,
  ISellerDocumentsPage,
  ISellerDocumentsResponse,
  ISellerLoginRequest,
  ISellerProduct,
  ISellerProductResponse,
  ISellerProductSale,
  ISellerProductSalesFilters,
  ISellerProductSalesPage,
  ISellerProductSalesResponse,
  ISellerProductsResponse,
  ISellerPurchase,
  ISellerPurchaseResponse,
  ISellerPurchasesResponse,
  ISellerStore,
  ISellerStoresResponse,
} from './models/seller-cabinet.api.interface'

@Injectable({
  providedIn: 'root',
})
export class SellerCabinetApiService {
  private http = inject(HttpClient)
  private baseUrl = `${environment.apiUrl}/seller`

  public login(payload: ISellerLoginRequest): Observable<{
    accessToken: string
    expiresAt: string | null
    account: ISellerAccount
  }> {
    return this.http.post<ISellerAuthResponse>(`${this.baseUrl}/auth/login`, payload).pipe(
      map((response) => ({
        accessToken: response.data.access_token,
        expiresAt: response.data.expires_at,
        account: DTOSellerAccount(response.data.account),
      })),
    )
  }

  public me(): Observable<ISellerAccount> {
    return this.http
      .get<ISellerAccountResponse>(`${this.baseUrl}/auth/me`)
      .pipe(map((response) => DTOSellerAccount(response.data)))
  }

  public logout(): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {})
  }

  public getStores(): Observable<ISellerStore[]> {
    return this.http
      .get<ISellerStoresResponse>(`${this.baseUrl}/stores`)
      .pipe(map((response) => (response.data ?? []).map(DTOSellerStore)))
  }

  public exportStoreSalesRegistry(
    storeId: number,
    filters: { dateFrom?: string | null; dateTo?: string | null } = {},
  ): Observable<Blob> {
    let params = new HttpParams()
    if (filters.dateFrom) {
      params = params.set('filter[date_from]', filters.dateFrom)
    }
    if (filters.dateTo) {
      params = params.set('filter[date_to]', filters.dateTo)
    }

    return this.http.get(`${this.baseUrl}/stores/${storeId}/sales/export`, {
      params,
      responseType: 'blob',
    })
  }

  public getProducts(storeId?: number | null): Observable<ISellerProduct[]> {
    let params = new HttpParams().set('pagination[limit]', '1000')
    if (storeId) {
      params = params.set('filter[store_id]', String(storeId))
    }

    return this.http
      .get<ISellerProductsResponse>(`${this.baseUrl}/products`, { params })
      .pipe(map((response) => (response.data ?? []).map(DTOSellerProduct)))
  }

  public getProduct(id: number): Observable<ISellerProduct> {
    return this.http
      .get<ISellerProductResponse>(`${this.baseUrl}/products/${id}`)
      .pipe(map((response) => DTOSellerProduct(response.data)))
  }

  public getProductSales(
    productId: number,
    filters: ISellerProductSalesFilters = {},
  ): Observable<ISellerProductSalesPage> {
    let params = this.buildSalesParams(filters)

    return this.http
      .get<ISellerProductSalesResponse>(`${this.baseUrl}/products/${productId}/sales`, { params })
      .pipe(
        map((response) => ({
          items: (response.data ?? []).map(DTOSellerProductSale),
          total: response.meta?.pagination?.total ?? (response.data ?? []).length,
          offset: response.meta?.pagination?.offset ?? filters.offset ?? 0,
          limit: response.meta?.pagination?.limit ?? filters.limit ?? 50,
        })),
      )
  }

  public exportProductSales(productId: number, filters: ISellerProductSalesFilters = {}): Observable<Blob> {
    const params = this.buildSalesParams({ ...filters, offset: undefined, limit: undefined })

    return this.http.get(`${this.baseUrl}/products/${productId}/sales/export`, {
      params,
      responseType: 'blob',
    })
  }

  public searchDocuments(filters: {
    q?: string | null
    licenseNumber?: string | null
    storeId?: number | null
    paymentStatus?: string | null
    offset?: number
    limit?: number
  } = {}): Observable<ISellerDocumentsPage> {
    let params = new HttpParams()
      .set('pagination[limit]', String(filters.limit ?? 50))
      .set('pagination[offset]', String(filters.offset ?? 0))

    if (filters.q) {
      params = params.set('filter[q]', filters.q)
    }
    if (filters.licenseNumber) {
      params = params.set('filter[license_number]', filters.licenseNumber)
    }
    if (filters.storeId) {
      params = params.set('filter[store_id]', String(filters.storeId))
    }
    if (filters.paymentStatus) {
      params = params.set('filter[payment_status]', filters.paymentStatus)
    }

    return this.http.get<ISellerDocumentsResponse>(`${this.baseUrl}/documents`, { params }).pipe(
      map((response) => ({
        items: (response.data ?? []).map(DTOSellerDocument),
        total: response.meta?.pagination?.total ?? (response.data ?? []).length,
        offset: response.meta?.pagination?.offset ?? filters.offset ?? 0,
        limit: response.meta?.pagination?.limit ?? filters.limit ?? 50,
      })),
    )
  }

  public getPurchases(storeId?: number | null): Observable<ISellerPurchase[]> {
    let params = new HttpParams()
    if (storeId) {
      params = params.set('filter[store_id]', String(storeId))
    }

    return this.http
      .get<ISellerPurchasesResponse>(`${this.baseUrl}/purchases`, { params })
      .pipe(map((response) => (response.data ?? []).map(DTOSellerPurchase)))
  }

  public getPurchase(uuid: string, storeId?: number | null): Observable<ISellerPurchase> {
    let params = new HttpParams()
    if (storeId) {
      params = params.set('store_id', String(storeId))
    }

    return this.http
      .get<ISellerPurchaseResponse>(`${this.baseUrl}/purchases/${uuid}`, { params })
      .pipe(map((response) => DTOSellerPurchase(response.data)))
  }

  public downloadProductLicense(uuid: string, productId: number): Observable<Blob> {
    return this.http.post(
      `${this.baseUrl}/purchases/${uuid}/products/${productId}/license/download`,
      {},
      { responseType: 'blob' },
    )
  }

  private buildSalesParams(filters: ISellerProductSalesFilters): HttpParams {
    let params = new HttpParams()
      .set('pagination[limit]', String(filters.limit ?? 50))
      .set('pagination[offset]', String(filters.offset ?? 0))

    if (filters.dateFrom) {
      params = params.set('filter[date_from]', filters.dateFrom)
    }
    if (filters.dateTo) {
      params = params.set('filter[date_to]', filters.dateTo)
    }
    if (filters.q) {
      params = params.set('filter[q]', filters.q)
    }
    if (filters.licenseNumber) {
      params = params.set('filter[license_number]', filters.licenseNumber)
    }
    if (filters.paymentStatus) {
      params = params.set('filter[payment_status]', filters.paymentStatus)
    }
    if (filters.sort) {
      params = params.set('sort', filters.sort)
    }

    return params
  }
}

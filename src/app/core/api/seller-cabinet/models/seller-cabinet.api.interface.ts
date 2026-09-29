export type SellerStoreRole = 'owner' | 'manager' | 'service' | 'viewer'

export interface ISellerStoreApi {
  id: number
  name: string | null
  full_name?: string | null
  inn?: string | null
  role: SellerStoreRole
  created_at?: string | null
  updated_at?: string | null
}

export interface ISellerAccountApi {
  id: number
  login: string
  name: string
  is_active: boolean
  stores: Array<{
    id: number
    name: string | null
    inn: string | null
    role: SellerStoreRole
  }>
  created_at?: string | null
  updated_at?: string | null
}

export interface ISellerAuthApi {
  access_token: string
  token_type: string
  expires_at: string | null
  account: ISellerAccountApi
}

export interface ISellerPurchaseProductApi {
  id: number
  name_at_purchase: string
  price_at_purchase: number
  tax_at_purchase: string | null
  store_id_at_purchase: number | null
  quantity: number
  product_fields: Record<string, unknown> | null
  license_number: string | null
  has_license_pdf: boolean
  product_type_id: number | null
  product_type?: {
    id: number
    name: string
    template_path?: string | null
  } | null
}

export interface ISellerPurchaseApi {
  uuid: string
  visitor_uuid: string
  final_price: number
  service_fee: number
  payer_email: string | null
  payer_phone: string | null
  payment_id: string | null
  payment_status: string | null
  fiscal_receipt_url: string | null
  products: ISellerPurchaseProductApi[]
  created_at: string | null
  updated_at: string | null
}

export interface ISellerLoginRequest {
  login: string
  password: string
}

export interface ISellerAuthResponse {
  data: ISellerAuthApi
}

export interface ISellerAccountResponse {
  data: ISellerAccountApi
}

export interface ISellerStoresResponse {
  data: ISellerStoreApi[]
}

export interface ISellerPurchasesResponse {
  data: ISellerPurchaseApi[]
  meta?: {
    pagination?: {
      offset?: number
      limit?: number
      total?: number
      type?: string
    }
  }
}

export interface ISellerPurchaseResponse {
  data: ISellerPurchaseApi
}

export interface ISellerStore {
  id: number
  name: string
  inn: string | null
  role: SellerStoreRole
}

export interface ISellerAccount {
  id: number
  login: string
  name: string
  isActive: boolean
  stores: ISellerStore[]
}

export interface ISellerPurchaseProduct {
  id: number
  nameAtPurchase: string
  priceAtPurchase: number
  taxAtPurchase: string | null
  storeIdAtPurchase: number | null
  quantity: number
  productFields: Record<string, unknown> | null
  licenseNumber: string | null
  hasLicensePdf: boolean
  productTypeId: number | null
  productTypeName: string | null
}

export interface ISellerPurchase {
  uuid: string
  visitorUuid: string
  finalPrice: number
  serviceFee: number
  payerEmail: string | null
  payerPhone: string | null
  paymentId: string | null
  paymentStatus: string | null
  fiscalReceiptUrl: string | null
  products: ISellerPurchaseProduct[]
  createdAt: string | null
  updatedAt: string | null
}

export const DTOSellerStore = (store: ISellerStoreApi | ISellerAccountApi['stores'][number]): ISellerStore => ({
  id: store.id,
  name: store.name || `Магазин #${store.id}`,
  inn: store.inn ?? null,
  role: store.role,
})

export const DTOSellerAccount = (account: ISellerAccountApi): ISellerAccount => ({
  id: account.id,
  login: account.login,
  name: account.name,
  isActive: account.is_active,
  stores: (account.stores ?? []).map(DTOSellerStore),
})

export const DTOSellerPurchaseProduct = (product: ISellerPurchaseProductApi): ISellerPurchaseProduct => ({
  id: product.id,
  nameAtPurchase: product.name_at_purchase,
  priceAtPurchase: product.price_at_purchase / 100,
  taxAtPurchase: product.tax_at_purchase,
  storeIdAtPurchase: product.store_id_at_purchase,
  quantity: product.quantity,
  productFields: product.product_fields,
  licenseNumber: product.license_number,
  hasLicensePdf: product.has_license_pdf,
  productTypeId: product.product_type_id,
  productTypeName: product.product_type?.name ?? null,
})

export const DTOSellerPurchase = (purchase: ISellerPurchaseApi): ISellerPurchase => ({
  uuid: purchase.uuid,
  visitorUuid: purchase.visitor_uuid,
  finalPrice: purchase.final_price / 100,
  serviceFee: purchase.service_fee / 100,
  payerEmail: purchase.payer_email,
  payerPhone: purchase.payer_phone,
  paymentId: purchase.payment_id,
  paymentStatus: purchase.payment_status,
  fiscalReceiptUrl: purchase.fiscal_receipt_url,
  products: (purchase.products ?? []).map(DTOSellerPurchaseProduct),
  createdAt: purchase.created_at,
  updatedAt: purchase.updated_at,
})

export interface ISellerProductApi {
  id: number
  name: string
  price: number
  store_id: number | null
  store?: { id: number; name: string | null } | null
  product_type_id: number | null
  product_type?: {
    id: number
    name: string
    fields?: Array<{ title: string; type?: string; data?: unknown }> | Record<string, unknown> | null
    template_path?: string | null
  } | null
  has_license_pdf: boolean
  is_visible?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ISellerProductSaleApi {
  id: number
  product_id: number
  purchase_uuid: string
  name_at_purchase: string
  price_at_purchase: number
  quantity: number
  store_id_at_purchase: number | null
  license_number: string | null
  product_fields: Record<string, unknown> | null
  has_license_pdf: boolean
  payment_status: string | null
  payer_email: string | null
  payer_phone: string | null
  purchased_at: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ISellerDocumentApi {
  id: number
  product_id: number
  product_name?: string | null
  store_id?: number | null
  store_name?: string | null
  purchase_uuid: string
  name_at_purchase?: string | null
  price_at_purchase?: number
  quantity?: number
  store_id_at_purchase?: number | null
  license_number: string | null
  product_fields: Record<string, unknown> | null
  has_license_pdf: boolean
  payment_status: string | null
  payer_email: string | null
  payer_phone: string | null
  purchased_at: string | null
}

export interface ISellerPaginationMeta {
  offset?: number
  limit?: number
  total?: number
  type?: string
}

export interface ISellerProductsResponse {
  data: ISellerProductApi[]
  meta?: { pagination?: ISellerPaginationMeta }
}

export interface ISellerProductResponse {
  data: ISellerProductApi
}

export interface ISellerProductSalesResponse {
  data: ISellerProductSaleApi[]
  meta?: { pagination?: ISellerPaginationMeta }
}

export interface ISellerDocumentsResponse {
  data: ISellerDocumentApi[]
  meta?: { pagination?: ISellerPaginationMeta }
}

export interface ISellerProduct {
  id: number
  name: string
  price: number
  storeId: number | null
  storeName: string | null
  productTypeId: number | null
  productTypeName: string | null
  fieldKeys: string[]
  hasLicensePdf: boolean
  isVisible: boolean | null
}

export interface ISellerProductSale {
  id: number
  productId: number
  purchaseUuid: string
  nameAtPurchase: string
  priceAtPurchase: number
  quantity: number
  storeIdAtPurchase: number | null
  licenseNumber: string | null
  productFields: Record<string, unknown> | null
  hasLicensePdf: boolean
  paymentStatus: string | null
  payerEmail: string | null
  payerPhone: string | null
  purchasedAt: string | null
}

export interface ISellerDocument {
  id: number
  productId: number
  productName: string | null
  storeId: number | null
  storeName: string | null
  purchaseUuid: string
  licenseNumber: string | null
  productFields: Record<string, unknown> | null
  hasLicensePdf: boolean
  paymentStatus: string | null
  payerEmail: string | null
  payerPhone: string | null
  purchasedAt: string | null
  priceAtPurchase: number
  storeIdAtPurchase: number | null
}

export interface ISellerProductSalesFilters {
  storeId?: number | null
  dateFrom?: string | null
  dateTo?: string | null
  q?: string | null
  licenseNumber?: string | null
  paymentStatus?: string | null
  sort?: string | null
  offset?: number
  limit?: number
}

export interface ISellerProductSalesPage {
  items: ISellerProductSale[]
  total: number
  offset: number
  limit: number
}

export interface ISellerDocumentsPage {
  items: ISellerDocument[]
  total: number
  offset: number
  limit: number
}

const extractFieldKeys = (
  fields?: Array<{ title: string }> | Record<string, unknown> | null,
): string[] => {
  if (!fields) {
    return []
  }

  if (Array.isArray(fields)) {
    return fields.map((field) => field?.title).filter((title): title is string => !!title)
  }

  return Object.values(fields)
    .map((field) => (field && typeof field === 'object' && 'title' in field ? String((field as { title: unknown }).title) : null))
    .filter((title): title is string => !!title)
}

export const DTOSellerProduct = (product: ISellerProductApi): ISellerProduct => ({
  id: product.id,
  name: product.name,
  price: product.price / 100,
  storeId: product.store_id,
  storeName: product.store?.name ?? null,
  productTypeId: product.product_type_id,
  productTypeName: product.product_type?.name ?? null,
  fieldKeys: extractFieldKeys(product.product_type?.fields as Array<{ title: string }> | Record<string, unknown> | null),
  hasLicensePdf: product.has_license_pdf,
  isVisible: product.is_visible ?? null,
})

export const DTOSellerProductSale = (sale: ISellerProductSaleApi): ISellerProductSale => ({
  id: sale.id,
  productId: sale.product_id,
  purchaseUuid: sale.purchase_uuid,
  nameAtPurchase: sale.name_at_purchase,
  priceAtPurchase: sale.price_at_purchase / 100,
  quantity: sale.quantity,
  storeIdAtPurchase: sale.store_id_at_purchase,
  licenseNumber: sale.license_number,
  productFields: sale.product_fields,
  hasLicensePdf: sale.has_license_pdf,
  paymentStatus: sale.payment_status,
  payerEmail: sale.payer_email,
  payerPhone: sale.payer_phone,
  purchasedAt: sale.purchased_at,
})

export const DTOSellerDocument = (doc: ISellerDocumentApi): ISellerDocument => ({
  id: doc.id,
  productId: doc.product_id,
  productName: doc.product_name ?? null,
  storeId: doc.store_id ?? doc.store_id_at_purchase ?? null,
  storeName: doc.store_name ?? null,
  purchaseUuid: doc.purchase_uuid,
  licenseNumber: doc.license_number,
  productFields: doc.product_fields,
  hasLicensePdf: doc.has_license_pdf,
  paymentStatus: doc.payment_status,
  payerEmail: doc.payer_email,
  payerPhone: doc.payer_phone,
  purchasedAt: doc.purchased_at,
  priceAtPurchase: (doc.price_at_purchase ?? 0) / 100,
  storeIdAtPurchase: doc.store_id_at_purchase ?? null,
})

export interface IInitializePurchase {
    purchase_uuid: string,
    email: string,
    phone: string,
    success_url: string,
    fail_url: string,
}

export interface IPaymentLink {
    payment_url: string,
}

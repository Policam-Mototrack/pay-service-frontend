export interface IInitializePurchase {
    purchase_uuid: string,
    email: string,
    phone: string,
}

export interface IPaymentLink {
    payment_url: string,
}
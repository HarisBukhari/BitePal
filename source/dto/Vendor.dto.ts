export interface CreateVendorInput {
    name: string
    ownerName: string
    foodType: [string]
    pincode: string
    address: string
    phone: string
    email: string
    password: string
}

export interface UpdateVendor {
    name: string
    address: string
    phone: string
    foodType: [string]
}

export interface VendorLogin {
    email: string
    password: string
}

export interface VendorPayload {
    _id: string
    name: string
    email: string
    foodType: [string]
}

export interface CreateOfferInputs {
    offerType: string
    vendors: [any]
    title: string
    description: string
    minValue: number
    offerAmount: number
    startValidity: Date
    endValidity: Date
    promocode: string
    promoType: string
    bank: [any]
    bins: [any]
    pincode: string
    isActive: boolean
}
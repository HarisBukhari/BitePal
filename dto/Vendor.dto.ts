export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface UpdateVendor {
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}

export interface VendorLogin {
    email: string;
    password: string;
}

export interface VendorPayload {
    _id: string;
    name: string;
    email: string;
    foodType: [string];
}
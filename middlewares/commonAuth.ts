import { VendorPayload } from "../dto";

declare global {
    namespace Express {
        interface Request {
            user?: VendorPayload
        }
    }
}
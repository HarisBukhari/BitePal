import { AuthPayload } from "../../dto";


declare global {
    namespace Express {
        interface Request {
            User?: AuthPayload
        }
    }
}
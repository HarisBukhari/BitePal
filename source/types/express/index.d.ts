import { AuthPayload, CAuthPayload } from "../../dto";


declare global {
    namespace Express {
        interface Request {
            User?: AuthPayload
        }
    }
}
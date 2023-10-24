import { Request, Response, NextFunction } from "express"
import { AuthPayload } from "../dto"
import { validateSign } from "../utilities"

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const isValid = await validateSign(req)
    if (isValid) {
        return next()
    } else {
        return res.status(403).send({ message: "Authentication Failed"})
    }
}
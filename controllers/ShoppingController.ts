import { Request, Response, NextFunction } from 'express'


export const hello = async (req: Request, res: Response, next: NextFunction) =>{
    res.status(200).send('Hello From Shopping Controller')
}
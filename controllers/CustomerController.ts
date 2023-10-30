import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { CreateVendorInput } from "../dto"
import { Vendor } from "../models"
import { generateSalt, hashPassword } from "../utilities"


export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const OTP = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const UpdateCutomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    
}




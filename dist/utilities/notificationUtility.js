"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOtp = exports.generateOtop = void 0;
require('dotenv').config();
const T_ID = process.env.Twilio_ID;
const T_Token = process.env.Twilio_Token;
//OTP and OTP_Expiry
const generateOtop = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, otp_expiry };
};
exports.generateOtop = generateOtop;
const requestOtp = (otp, to) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = require('twilio')(T_ID, T_Token);
        const response = yield client.messages.create({
            body: `Farig Yeah Lai Apni OTP ${otp}`,
            from: '+12394490950',
            to: `+92${to}`
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
});
exports.requestOtp = requestOtp;
//# sourceMappingURL=NotificationUtility.js.map
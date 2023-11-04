import { IsEmail, Length } from "class-validator";

export class CreateCustomerInputs {

    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(7, 12)
    password: string;

}

export interface CustomerPayload {
    _id: string;
    email: string;
    phone: string;
}

export interface CustomersLogin {
    email: string;
    password: string;
}
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ActivateAccountRequestDTO {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'Kode aktivasi terdiri dari 6 karakter' })
    activationCode: number;
}
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { IsUnique } from "src/utils/validation/is-unique";

export class RegisterRequestDTO {
    @IsString()
    @IsNotEmpty({ message: "username tidak boleh kosong" })
    @MinLength(2, { message: 'Password minimal terdiri dari 2 karakter' })
    username: string;

    @IsUnique({ tableName: 'users', column: 'email' })
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: 'Password minimal terdiri dari 4 karakter' })
    password: string;
}
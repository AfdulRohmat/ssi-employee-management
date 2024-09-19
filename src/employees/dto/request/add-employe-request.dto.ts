import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { StatusEnum } from "src/employees/entities/status.enum";

export class AddEmployeeRequestDTO {
    @IsString()
    @IsNotEmpty()
    nama: string;

    @IsString()
    @IsNotEmpty()
    nomor: string;

    @IsString()
    @IsNotEmpty()
    jabatan: string;

    @IsString()
    @IsNotEmpty()
    departemen: string;

    @Type(() => Date) // Transform the incoming string into a Date object
    @IsDate()
    @IsNotEmpty()
    tanggalMasuk: Date;

    @IsEnum(StatusEnum)
    @IsNotEmpty()
    status: StatusEnum;
}
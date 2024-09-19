import { Type } from "class-transformer";
import { IsDate, IsEnum, IsString } from "class-validator";
import { StatusEnum } from "src/employees/entities/status.enum";

export class UpdateEmployeeRequestDTO {
    nama: string;
    nomor: string;
    jabatan: string;
    departemen: string;

    @Type(() => Date) // Transform the incoming string into a Date object
    tanggalMasuk: Date;

    status: StatusEnum;
}
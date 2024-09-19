import { Employee } from "src/employees/entities/employee.entity";

export class EmployeeResponseDto {
    no: number;
    id: number
    nama: string;
    nomor: string;
    jabatan: string;
    departemen: string;
    tanggalMasuk: Date;
    foto: string;
    status: string;
    deleted_at: Date | null;

    constructor(employee: Employee, no: number) {
        this.no = no;
        this.id = employee.id
        this.nama = employee.nama;
        this.nomor = employee.nomor;
        this.jabatan = employee.jabatan;
        this.departemen = employee.departemen;
        this.tanggalMasuk = employee.tanggalMasuk;
        this.foto = employee.foto;
        this.status = employee.status;
        this.deleted_at = employee.deleted_at;
    }
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StatusEnum } from "./status.enum";

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nama: string; // Name

    @Column({ unique: true })
    nomor: string; // Employee number

    @Column()
    jabatan: string; // Position

    @Column()
    departemen: string; // Department

    @Column()
    tanggalMasuk: Date; // Date of joining

    @Column({ nullable: true })
    foto: string;

    @Column({
        type: 'enum',
        enum: StatusEnum,
        default: StatusEnum.PROBATION,
    })
    status: StatusEnum;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date | null;
}

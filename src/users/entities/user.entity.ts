import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column({ unique: true })
    @IsEmail({}, { message: "Invalid Email" })
    email: string

    @Column()
    password: string

    @Column({ name: "is_verified", default: false })
    isVerified: boolean

    @Column({
        name: "activation_code",
        default: null
    })
    activationCode: number

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
    roles: Role[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}

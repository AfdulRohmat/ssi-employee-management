import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum UserRole {
    USER = 'ROLE_USER',
    ADMIN = 'ROLE_ADMIN',
    DRIVER = 'ROLE_DRIVER',
    COMPANY = 'ROLE_COMPANY',
    FAMILY = 'ROLE_FAMILY',
    MEDIC = 'ROLE_MEDIC',
}

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    name: UserRole;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
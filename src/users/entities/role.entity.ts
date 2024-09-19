import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum UserRole {
    USER = 'ROLE_USER',
    ADMIN = 'ROLE_ADMIN',
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
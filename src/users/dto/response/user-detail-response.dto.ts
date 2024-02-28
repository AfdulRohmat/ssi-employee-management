import { Role } from "src/users/entities/role.entity";

export class UserDetailResponseDTO {
    username: string
    email: string
    isVerified: boolean
    roles: Role[];

    constructor(username: string,
        email: string,
        isVerified: boolean,
        roles: Role[]) {
        this.username = username,
            this.email = email,
            this.isVerified = isVerified,
            this.roles = roles
    }
}
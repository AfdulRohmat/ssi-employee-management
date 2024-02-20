// register-response.dto.ts
export class RegisterResponseDTO {
    email: string;
    password: string;
    message: string | null

    constructor(email: string, password: string, message: string | null) {
        this.email = email;
        this.password = password;
        this.message = message
    }
}

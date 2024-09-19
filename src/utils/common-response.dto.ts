// common-response.dto.ts
export class CommonResponseDTO {
    statusCode: number;
    message: string;
    data: any;
    error: string[] | null;

    constructor(statusCode: number, message: string, data: any, error: string[] | null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}

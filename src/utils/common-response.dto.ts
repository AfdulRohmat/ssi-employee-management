// common-response.dto.ts
export class CommonResponseDto {
    status: number;
    message: string;
    data: any;
    error: string[] | null;

    constructor(status: number, message: string, data: any, error: string[] | null) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}

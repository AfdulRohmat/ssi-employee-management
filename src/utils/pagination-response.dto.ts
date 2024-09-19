export class PaginationResponseDto<T> {
    pageNumber: number;
    pageSize: number;
    totalPage: number;
    totalData: number;
    data: T[];

    constructor(
        pageNumber: number,
        pageSize: number,
        totalPage: number,
        totalData: number,
        data: T[],
    ) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalPage = totalPage;
        this.totalData = totalData;
        this.data = data;
    }
}

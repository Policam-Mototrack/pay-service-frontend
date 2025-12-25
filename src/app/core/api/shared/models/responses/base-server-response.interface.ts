export interface BaseServerResponse<T> {
    data: T;
    message: string;
    status: number;
    success: boolean;
}
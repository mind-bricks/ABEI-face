export interface IPaginatedList<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<T>;
}

export interface IPaginatingParams {
    limit?: number;
    offset?: number;
}

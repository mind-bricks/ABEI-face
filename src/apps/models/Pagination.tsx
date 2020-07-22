export class PaginatedList<T> {
    count: number;
    next: string;
    previous: string;
    results: Array<T>;
}
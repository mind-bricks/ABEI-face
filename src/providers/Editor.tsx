import {
    IProcedure,
    IProcedureSite,
    IProcedureEditor,
    PaginatedList,
} from '../models';

export class EditorProvider implements IProcedureEditor {

    constructor(protected urlEntry: string) { }

    async getSite(
        site: string,
    ): Promise<IProcedureSite | undefined> {
        return;
    }

    async getSiteList(
        limit: number,
        offset: number,
    ): Promise<PaginatedList<IProcedureSite>> {
        return {
            count: 1,
            next: null,
            previous: null,
            results: [],
        };
    }

    async getProcedure(
        signature: string,
        site?: string,
    ): Promise<IProcedure | undefined> {
        return;
    }

    async getProcedureList(
        limit: number,
        offset: number,
        site?: string,
    ): Promise<PaginatedList<IProcedure>> {
        return {
            count: 1,
            next: null,
            previous: null,
            results: [],
        };
    }
}

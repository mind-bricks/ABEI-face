import {
    IPaginatedList,
    IPaginatingParams,
    IProcedure,
    IProcedureService,
    IProcedureSite,
    IProcedureSiteService,
} from '../interfaces';


export class ProcedureService implements IProcedureService {
    async getProcedure(
        signature: string,
    ): Promise<IProcedure | undefined> {
        return
    }

    async getProcedureList(
        page?: IPaginatingParams
    ): Promise<IPaginatedList<IProcedure>> {
        return {
            count: 0,
            next: null,
            previous: null,
            results: [],
        }
    }
}

export class ProcedureSiteService implements IProcedureSiteService {

    constructor(protected urlEntry: string) { }

    async getSite(
        site: string,
    ): Promise<IProcedureSite | undefined> {
        return;
    }

    async getSiteList(
        page: IPaginatingParams
    ): Promise<IPaginatedList<IProcedureSite>> {
        return {
            count: 0,
            next: null,
            previous: null,
            results: [],
        };
    }

    async createSite(
        signature: string,
        dependencies?: Array<IProcedureSite>,
    ): Promise<IProcedureSite> {
        // TODO: ...
        throw Error('not implemented yet');
    }
}

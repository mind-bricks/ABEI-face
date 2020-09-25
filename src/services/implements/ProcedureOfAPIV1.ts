import {
    IPaginatedList,
    IPaginatingParams,
    // IProcedure,
    IProcedureSite,
    IProcedureSiteService,
} from '..';

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

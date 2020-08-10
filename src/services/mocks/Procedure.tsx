import {
    IProcedureJoint,
    IProcedure,
    IProcedureService,
    IProcedureSite,
    IProcedureSiteService,
    IPaginatedList,
    IPaginatingParams,
} from '../../interfaces';


class Procedure implements IProcedure {
    constructor(
        readonly signature: string,
        protected site: IProcedureSite,
    ) {

    }

    async getDocument(): Promise<string> {
        return 'mock doc';
    }

    async getInputSignatureList(): Promise<Array<string>> {
        return ['float@py', 'float@py'];
    }

    async getOutputSignatureList(): Promise<Array<string>> {
        return ['float@py'];
    }

    async getJoints(): Promise<Array<IProcedureJoint>> {
        return [];
    }

    async getSite(): Promise<IProcedureSite> {
        return this.site;
    }

    async destroy(): Promise<boolean> {
        return true;
    }
}


class ProcedureSite implements IProcedureSite {

    constructor(
        readonly signature: string,
        protected dependencies?: Array<IProcedureSite>) {

    }

    async getProcedure(
        signature: string,
    ): Promise<IProcedure | undefined> {
        return new Procedure(signature, this);
    }

    async getProcedureList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedure>> {
        return {
            count: 3,
            next: null,
            previous: null,
            results: [
                new Procedure('mock 1', this),
                new Procedure('mock 2', this),
                new Procedure('mock 3', this),
            ]
        }
    }

    async createProcedure(
        signature: string,
    ): Promise<IProcedure | undefined> {
        return new Procedure(signature, this);
    }

    async getDependencyList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedureSite>> {
        return {
            count: 0,
            next: null,
            previous: null,
            results: this.dependencies || [],
        }
    }

    async destroy(): Promise<boolean> {
        return true;
    }
}

export class ProcedureService implements IProcedureService {
    async getProcedure(
        signature: string,
    ): Promise<IProcedure | undefined> {
        return new Procedure(signature, new ProcedureSite('mock site'));
    }

    async getProcedureList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedure>> {
        const site = new ProcedureSite('mock site');
        return {
            count: 3,
            next: null,
            previous: null,
            results: [
                new Procedure('mock 1', site),
                new Procedure('mock 2', site),
                new Procedure('mock 3', site),
            ]
        }
    }
}


export class ProcedureSiteService implements IProcedureSiteService {

    async getSite(
        signature: string,
    ): Promise<IProcedureSite | undefined> {
        return new ProcedureSite(signature);
    }

    async getSiteList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedureSite>> {
        return {
            count: 2,
            next: null,
            previous: null,
            results: [
                new ProcedureSite('mock site 1'),
                new ProcedureSite('mock site 2'),
            ]
        }
    }

    async createSite(
        signature: string,
        dependencies?: Array<IProcedureSite>,
    ): Promise<IProcedureSite | undefined> {
        return new ProcedureSite(signature, dependencies);
    }
}

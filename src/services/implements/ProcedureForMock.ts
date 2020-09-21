import {
    IProcedureJoint,
    IProcedure,
    IProcedureService,
    IProcedureSite,
    IProcedureSiteService,
    IPaginatedList,
    IPaginatingParams,
} from '..';


class Procedure implements IProcedure {
    isEditable: boolean;
    document: string;
    joints: IProcedureJoint[];

    constructor(
        readonly signature: string,
        protected site: IProcedureSite,
    ) {
        this.document = Math.random().toString(36).substring(7);
        this.isEditable = Boolean(Math.random() >= 0.5);
        this.joints = [];

        if (this.isEditable) {
            const count = Math.floor(Math.random() * 4);
            for (let i = 0; i < count; ++i) {
                this.joints.push({
                    signature: i.toString(),
                    procedure: new Procedure(signature + ' sub', site),
                    getInputs: async function () { return []; },
                })
            }
        }
    }

    async getDocument(): Promise<string> {
        return this.document;
    }

    async getInputSignatureList(): Promise<Array<string>> {
        return ['float@py', 'float@py'];
    }

    async getOutputSignatureList(): Promise<Array<string>> {
        return ['float@py'];
    }

    async getJoints(): Promise<Array<IProcedureJoint>> {
        return this.joints;
    }

    async getSite(): Promise<IProcedureSite> {
        return this.site;
    }

    async destroy(): Promise<boolean> {
        if (this.site instanceof ProcedureSite) {
            this.site.entries.delete(this.signature);
        }
        return true;
    }
}


class ProcedureSite implements IProcedureSite {

    entries = new Map<string, IProcedure>();

    constructor(
        readonly signature: string,
        protected dependencies?: Array<IProcedureSite>
    ) {
        const count = Math.floor(Math.random() * Math.floor(3)) + 1;
        for (let i = 0; i < count; ++i) {
            const signature = `${this.signature} mock ${i.toString()}`;
            this.entries.set(signature, new Procedure(signature, this));
        }
    }

    async getProcedure(
        signature: string,
    ): Promise<IProcedure | undefined> {
        return this.entries.get(signature);
    }

    async getProcedureList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedure>> {
        return {
            count: this.entries.size,
            next: null,
            previous: null,
            results: [...this.entries.values()],
        }
    }

    async createProcedure(
        signature: string,
    ): Promise<IProcedure | undefined> {
        if (this.entries.has(signature))
            return undefined;

        const p = new Procedure(signature, this);
        this.entries.set(signature, p);
        return p;
    }

    async getDependencyList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedureSite>> {
        return {
            count: this.dependencies ? this.dependencies.length : 0,
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

    entriesOfSites = new Map<string, IProcedureSite>();

    constructor() {
        const numberOfSites = Math.floor(Math.random() * Math.floor(3)) + 3;
        for (let i = 0; i < numberOfSites; ++i) {
            const signature = `mock site ${i.toString()}`;
            this.entriesOfSites.set(
                signature,
                new ProcedureSite(signature),
            );
        }
    }

    async getSite(
        signature: string,
    ): Promise<IProcedureSite | undefined> {
        return this.entriesOfSites.get(signature);
    }

    async getSiteList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedureSite>> {
        return {
            count: this.entriesOfSites.size,
            next: null,
            previous: null,
            results: [...this.entriesOfSites.values()],
        }
    }

    async createSite(
        signature: string,
        dependencies?: Array<IProcedureSite>,
    ): Promise<IProcedureSite | undefined> {
        if (this.entriesOfSites.has(signature))
            return undefined;

        const site = new ProcedureSite(signature, dependencies);
        this.entriesOfSites.set(signature, site);
        return site;
    }
}

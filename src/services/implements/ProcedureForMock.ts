import {
    IProcedureJoint,
    IProcedureJointLink,
    IProcedure,
    IProcedureSite,
    IProcedureSiteService,
    IPaginatedList,
    IPaginatingParams,
} from '..';


class ProcedureJoint implements IProcedureJoint {

    constructor(
        readonly signature: string,
        protected readonly caller: IProcedure,
        protected readonly callee: IProcedure,
    ) {

    }

    getCaller(): IProcedure {
        return this.caller;
    }

    getCallee(): IProcedure {
        return this.callee;
    }

    async setLink(
        index: number,
        link: IProcedureJointLink | undefined,
    ): Promise<boolean> {
        return false;
    }

    async getLink(
        index: number,
    ): Promise<IProcedureJointLink | undefined> {
        return undefined;
    }

    async getLinkList(): Promise<Map<number, IProcedureJointLink>> {
        return new Map(); // return empty map
    }

    async destroy(): Promise<boolean> {
        return false;
    }

}


class Procedure implements IProcedure {
    editable: boolean;
    document: string;
    joints: IProcedureJoint[];

    constructor(
        readonly signature: string,
        protected site: IProcedureSite,
    ) {
        this.document = Math.random().toString(36).substring(7);
        this.editable = Boolean(Math.random() >= 0.5);
        this.joints = [];

        if (this.editable) {
            const count = Math.floor(Math.random() * 4);
            for (let i = 0; i < count; ++i) {
                this.joints.push(new ProcedureJoint(
                    i.toString(),
                    this,
                    new Procedure(signature + ' sub', site),
                ))
            }
        }
    }

    async getEditable(): Promise<boolean> {
        return this.editable;
    }

    async getSite(): Promise<IProcedureSite> {
        return this.site;
    }

    async setDocument(document: string): Promise<boolean> {
        this.document = document;
        return true;
    }

    async getDocument(): Promise<string> {
        return this.document;
    }

    async getInputSignatureList(): Promise<Map<number, string>> {
        return new Map([[0, 'float'], [1, 'float']]);
    }

    async setInputSignature(
        index: number,
        signature: string,
    ): Promise<boolean> {
        return false;
    }

    async getOutputSignatureList(): Promise<Map<number, string>> {
        return new Map([[0, 'float']]);
    }

    async setOutputSignature(
        index: number,
        signature: string,
    ): Promise<boolean> {
        return false;
    }

    async createJoint(
        signature: string,
        procedure: IProcedure,
    ): Promise<IProcedureJoint | undefined> {
        return undefined;
    }

    async getJointList(): Promise<Array<IProcedureJoint>> {
        return this.joints;
    }

    async getJoint(
        signature: string,
    ): Promise<IProcedureJoint | undefined> {
        for (const joint of this.joints) {
            if (joint.signature === signature) {
                return joint;
            }
        }
        return undefined;
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

    async isDependingOn(site: IProcedureSite) {
        return !!(
            this.dependencies &&
            this.dependencies.findIndex((value) => (
                value.signature === site.signature
            )) !== -1
        ) || site.signature === this.signature;
    }

    async destroy(): Promise<boolean> {
        return true;
    }
}


export class ProcedureSiteService implements IProcedureSiteService {

    entriesOfSites = new Map<string, IProcedureSite>();

    constructor() {
        const numberOfSites = Math.floor(Math.random() * Math.floor(3)) + 3;
        let previousSite: ProcedureSite | undefined = undefined;
        for (let i = 0; i < numberOfSites; ++i) {
            const signature = `mock site ${i.toString()}`;
            const site: ProcedureSite = new ProcedureSite(
                signature,
                previousSite ? [previousSite] : [],
            );
            this.entriesOfSites.set(signature, site);
            previousSite = site;
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

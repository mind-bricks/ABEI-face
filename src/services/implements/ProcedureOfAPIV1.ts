import {
    IPaginatedList,
    IPaginatingParams,
    IProcedure,
    IProcedureJoint,
    IProcedureJointLink,
    IProcedureSite,
    IProcedureSiteService,
} from '..';


class ProcedureJoint implements IProcedureJoint {
    constructor(
        readonly entryURL: string,
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
        const site = await this.caller.getSite();
        const reqPath =
            `sites/${site.signature}/procedures/${this.caller.signature}/joints/${this.signature}/links/`;

        if (link) {
            const reqURL = new URL(reqPath, this.entryURL);
            const resp = await fetch(reqURL.toString(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    index,
                    input_joint: link.joint ? link.joint.signature : null,
                    input_index: link.index,
                }),
            });
            return resp.ok;
        } else {
            const reqURL = new URL(`${reqPath}${index}/`, this.entryURL);
            return (await fetch(reqURL.toString(), { method: 'DELETE' })).ok;
        }
    }

    async getLink(
        index: number,
    ): Promise<IProcedureJointLink | undefined> {
        const site = await this.caller.getSite();
        const reqPath =
            `sites/${site.signature}/procedures/${this.caller.signature}/joints/${this.signature}/links/${index}/`;
        const reqURL = new URL(reqPath, this.entryURL);
        const resp = await fetch(reqURL.toString());
        if (!resp.ok) {
            return undefined;
        }
        const respContent = await resp.json();
        const joint = respContent.input_joint
            ? await this.caller.getJoint(respContent.input_joint)
            : undefined;

        return {
            joint: joint,
            index: respContent.input_index,
        }
    }

    async getLinkList(): Promise<Map<number, IProcedureJointLink>> {
        const site = await this.caller.getSite();
        const reqPath =
            `sites/${site.signature}/procedures/${this.caller.signature}/joints/${this.signature}/links/`;
        const reqURL = new URL(reqPath, this.entryURL);
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        const respResults =
            Array.isArray(respContent.results) ? respContent.results : [];
        // FIXME: traverse all pages to ensure that all links have been fetched

        const links = new Map<number, IProcedureJointLink>();
        for (const i of respResults) {
            const joint = i.input_joint
                ? await this.caller.getJoint(i.input_joint)
                : undefined;

            links.set(i.index, { joint, index: i.input_index });
        }
        return links;
    }

    async destroy(): Promise<boolean> {
        const site = await this.caller.getSite();
        const reqURL = new URL(
            `sites/${site.signature}/procedures/${this.caller.signature}/joints/${this.signature}/`,
            this.entryURL,
        );
        return (await fetch(reqURL.toString(), { method: 'DELETE' })).ok;
    }
}

class Procedure implements IProcedure {

    constructor(
        readonly entryURL: string,
        readonly site: string,
        readonly signature: string,
        protected editable?: boolean,
        protected docstring?: string,
    ) {
    }

    protected async load(): Promise<boolean> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        // const respInputs =
        //     Array.isArray(respContent.inputs) ? respContent.inputs : [];
        // const respOutputs =
        //     Array.isArray(respContent.outputs) ? respContent.outputs : [];

        this.editable = respContent.editable;
        this.docstring = respContent.docstring;
        return true;
    }

    protected async save(data: object): Promise<boolean> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString(), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!resp.ok) {
            return false;
        }

        const respContent = await resp.json();
        this.editable = respContent.editable;
        this.docstring = respContent.docstring;
        return true;
    }

    async getEditable(): Promise<boolean> {
        if (this.editable === undefined) {
            await this.load();
        }
        return !!this.editable;
    }

    async getSite(): Promise<IProcedureSite> {
        return new ProcedureSite(this.entryURL, this.site);
    }

    async getDocument(): Promise<string> {
        if (this.docstring === undefined) {
            await this.load();
        }
        return this.docstring !== undefined
            ? this.docstring : 'ERROR DOCUMENT';
    }

    async setDocument(docstring: string): Promise<boolean> {
        return await this.save({ docstring });
    }

    async getInputSignatureList(): Promise<Map<number, string>> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/inputs/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        // FIXME: traverse all pages to ensure that all inputs have been fetched
        const respResults =
            Array.isArray(respContent.results) ? respContent.results : [];
        return new Map(respResults.map((value: any) => [value.index, value.signature]));
    }

    async setInputSignature(
        index: number,
        signature: string,
    ): Promise<boolean> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/inputs/${index}/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, signature }),
        });
        return resp.ok;
    }

    async getOutputSignatureList(): Promise<Map<number, string>> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/outputs/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        // FIXME: traverse all pages to ensure that all outputs have been fetched
        const respResults =
            Array.isArray(respContent.results) ? respContent.results : [];
        return new Map(respResults.map((value: any) => [value.index, value.signature]));
    }

    async setOutputSignature(
        index: number,
        signature: string,
    ): Promise<boolean> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/outputs/${index}/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, signature }),
        });
        return resp.ok;
    }

    async createJoint(
        signature: string,
        procedure: IProcedure,
    ): Promise<IProcedureJoint | undefined> {
        const site = await procedure.getSite();
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/joints/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                signature,
                site: site.signature,
                procedure: procedure.signature,
            }),
        });
        return resp.ok
            ? new ProcedureJoint(
                this.entryURL,
                signature,
                this,
                procedure,
            ) : undefined;
    }

    async getJointList(): Promise<Array<IProcedureJoint>> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/joints/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        // FIXME: traverse all pages to ensure that all outputs have been fetched
        const respResults =
            Array.isArray(respContent.results) ? respContent.results : [];
        return respResults.map((value: any) => new ProcedureJoint(
            this.entryURL,
            value.signature,
            this,
            new Procedure(
                this.entryURL,
                value.site,
                value.procedure,
            )
        ));
    }

    async getJoint(
        signature: string,
    ): Promise<IProcedureJoint | undefined> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/joints/${signature}/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        return resp.ok ? new ProcedureJoint(
            this.entryURL,
            respContent.signature,
            this,
            new Procedure(
                this.entryURL,
                respContent.site,
                respContent.procedure,
            )
        ) : undefined;
    }

    async destroy(): Promise<boolean> {
        const reqURL = new URL(
            `sites/${this.site}/procedures/${this.signature}/`, this.entryURL);
        return (await fetch(reqURL.toString(), { method: 'DELETE' })).ok;
    }
}

class ProcedureSite implements IProcedureSite {
    constructor(
        protected readonly entryURL: string,
        readonly signature: string,
    ) {

    }

    async isDependingOn(site: IProcedureSite): Promise<boolean> {
        const reqURL = new URL(
            `sites/${this.signature}/base-sites/${site.signature}/`,
            this.entryURL,
        );
        return (await fetch(reqURL.toString())).ok;
    }

    async getDependencyList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedureSite>> {
        const reqURL = new URL(`sites/${this.signature}/base-sites/`, this.entryURL);
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        const respResults =
            Array.isArray(respContent.results) ? respContent.results : [];

        return {
            count: respContent.count,
            next: respContent.next,
            previous: respContent.previous,
            results: respResults.map((value: any) => {
                return new ProcedureSite(this.entryURL, value.signature);
            }),
        }
    }

    async createProcedure(
        signature: string,
    ): Promise<IProcedure | undefined> {
        const reqURL = new URL(
            `sites/${this.signature}/procedures/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ signature }),
        });
        if (!resp.ok) {
            return undefined;
        }

        const respContent = await resp.json();
        return new Procedure(
            this.entryURL,
            this.signature,
            respContent.signature,
            respContent.editable,
            respContent.docstring,
        );
    }

    async getProcedure(
        signature: string,
    ): Promise<IProcedure | undefined> {
        const reqURL = new URL(
            `sites/${this.signature}/procedures/${signature}/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString());
        if (!resp.ok) {
            return undefined;
        }

        const respContent = await resp.json();
        return new Procedure(
            this.entryURL,
            this.signature,
            respContent.signature,
            respContent.editable,
            respContent.docstring,
        );
    }

    async getProcedureList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedure>> {
        const reqURL = new URL(
            `sites/${this.signature}/procedures/`,
            this.entryURL,
        );
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        const respResults =
            Array.isArray(respContent.results) ? respContent.results : [];

        return {
            count: respContent.count,
            next: respContent.next,
            previous: respContent.previous,
            results: respResults.map((value: any) => {
                return new Procedure(
                    this.entryURL,
                    this.signature,
                    value.signature,
                    value.editable,
                    value.docstring,
                );
            }),
        }
    }

    async destroy(): Promise<boolean> {
        const reqURL = new URL(`sites/${this.signature}`, this.entryURL);
        return (await fetch(reqURL.toString(), { method: 'DELETE' })).ok;
    }
}

export class ProcedureSiteService implements IProcedureSiteService {

    constructor(protected readonly entryURL: string) {
    }

    async getSite(
        site: string,
    ): Promise<IProcedureSite | undefined> {
        const reqURL = new URL(`sites/${site}/`, this.entryURL);
        const resp = await fetch(reqURL.toString());
        return resp.ok ? new ProcedureSite(this.entryURL, site) : undefined;
    }

    async getSiteList(
        page: IPaginatingParams
    ): Promise<IPaginatedList<IProcedureSite>> {
        const reqURL = new URL(`sites/`, this.entryURL);
        const resp = await fetch(reqURL.toString());
        const respContent = await resp.json();
        const respResults =
            Array.isArray(respContent.results) ? respContent.results : [];
        return {
            count: respContent.count,
            next: respContent.next,
            previous: respContent.previous,
            results: respResults.map((value: any) => {
                return new ProcedureSite(this.entryURL, value.signature);
            }),
        }
    }

    async createSite(
        signature: string,
        dependencies?: Array<IProcedureSite>,
    ): Promise<IProcedureSite | undefined> {
        const reqURL = new URL(`sites/`, this.entryURL);
        // create site
        const resp = await fetch(reqURL.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                signature,
                base_sites:
                    dependencies ? dependencies.map(value => {
                        return { signature: value.signature };
                    }) : [],
            }),
        });

        return resp.ok
            ? new ProcedureSite(this.entryURL, signature)
            : undefined;
    }
}


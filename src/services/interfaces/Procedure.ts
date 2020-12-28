import {
    IPaginatedList,
    IPaginatingParams,
} from "./Pagination";


export interface IProcedureID {
    readonly signature: string;
    readonly site: string;
}

export interface IProcedureJointLink {
    readonly joint: IProcedureJoint | undefined;
    readonly index: number;
}

export interface IProcedureJoint {
    readonly signature: string;

    getCaller(): IProcedure;
    getCallee(): IProcedure;

    setLink(
        index: number,
        link: IProcedureJointLink | undefined,
    ): Promise<boolean>;
    getLink(
        index: number,
    ): Promise<IProcedureJointLink | undefined>;

    getLinkList(): Promise<Map<number, IProcedureJointLink>>;

    destroy(): Promise<boolean>;
}

export interface IProcedure {
    readonly signature: string;

    getEditable(): Promise<boolean>;
    getSite(): Promise<IProcedureSite>;

    getDocument(): Promise<string>;
    setDocument(document: string): Promise<boolean>;

    getInputSignatureList(): Promise<Map<number, string>>;
    setInputSignature(
        index: number,
        signature: string,
    ): Promise<boolean>;
    getOutputSignatureList(): Promise<Map<number, string>>;
    setOutputSignature(
        index: number,
        signature: string,
    ): Promise<boolean>;

    createJoint(
        signature: string,
        procedure: IProcedure,
    ): Promise<IProcedureJoint | undefined>;
    getJointList(): Promise<Array<IProcedureJoint>>;
    getJoint(
        signature: string,
    ): Promise<IProcedureJoint | undefined>;

    destroy(): Promise<boolean>;
}

export interface IProcedureSite {
    readonly signature: string;
    isDependingOn(
        site: IProcedureSite): Promise<boolean>;
    getDependencyList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedureSite>>;
    createProcedure(
        signature: string,
    ): Promise<IProcedure | undefined>;
    getProcedure(
        signature: string,
    ): Promise<IProcedure | undefined>;
    getProcedureList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedure>>;
    destroy(): Promise<boolean>;
}

export interface IProcedureSiteService {
    getSite(
        signature: string,
    ): Promise<IProcedureSite | undefined>;
    getSiteList(
        page?: IPaginatingParams,
    ): Promise<IPaginatedList<IProcedureSite>>;
    createSite(
        signature: string,
        dependencies?: Array<IProcedureSite>,
    ): Promise<IProcedureSite | undefined>;
}

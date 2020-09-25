import {
    IPaginatedList,
    IPaginatingParams,
} from "./Pagination";


export interface IProcedureID {
    site: string;
    signature: string;
}

export interface IProcedureJointInput {
    readonly joint: string | undefined;
    readonly index: number;
}

export interface IProcedureJoint {
    readonly signature: string;
    readonly procedure: IProcedure;
    getInputs(): Promise<Array<IProcedureJointInput>>;
}

export interface IProcedure {
    readonly signature: string;
    readonly isEditable: boolean;
    getDocument(): Promise<string>;
    getInputSignatureList(): Promise<Array<string>>;
    getOutputSignatureList(): Promise<Array<string>>;
    getJoints(): Promise<Array<IProcedureJoint>>;
    getSite(): Promise<IProcedureSite>;
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

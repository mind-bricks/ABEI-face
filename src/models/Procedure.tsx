import { PaginatedList } from "./Pagination";


export interface IProcedureJointInput {
    joint: IProcedureJoint | undefined;
    index: number;
}

export interface IProcedureJoint {
    signature: string;
    procedure: string | IProcedure;
    inputs: Array<IProcedureJointInput>;
}

export interface IProcedure {
    signature: string;
    inputs: Array<string>;
    outputs: Array<string>;
    joints: Array<IProcedureJoint>;
    site?: string | IProcedureSite;
}

export interface IProcedureSite {
    name: string;
    baseSites?: Array<string | IProcedureSite>;
}


export interface IProcedureEditor {
    getSite(
        site: string,
    ): Promise<IProcedureSite | undefined>;

    getSiteList(
        limit: number,
        offset: number,
    ): Promise<PaginatedList<IProcedureSite>>;

    getProcedure(
        signature: string,
        site?: string,
    ): Promise<IProcedure | undefined>;

    getProcedureList(
        limit: number,
        offset: number,
        site?: string,
    ): Promise<PaginatedList<IProcedure>>;
}

// persistant data --------------------------------
export interface IProcedureJointInput {
    joint: IProcedureJoint | undefined;
    index: number;
}

export interface IProcedureJoint {
    signature: string;
    procedure: string | IProcedure;
    inputs: IProcedureJointInput[];
}

export interface IProcedure {
    signature: string;
    inputs: string[];
    outputs: string[];
    joints: IProcedureJoint[];
    position?: IProcedurePosition;
}

// temporal data -----------------------------------
export interface IProcedurePosition {
    x: number;
    y: number;
}

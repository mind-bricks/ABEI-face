import {
    DefaultPortModel,
    DefaultNodeModel,
    DagreEngine,
    DiagramEngine,
} from '@projectstorm/react-diagrams';
import {
    IProcedureID,
    IProcedure,
    IProcedureJoint,
} from './Procedure';


export interface IDiagramPort {
    getSignature(): string;
    getKey(): string;
    getImplement(): DefaultPortModel;
}

export interface IDiagramNode {
    destroy(): boolean;
    getSignature(): string;
    getDocument(): string;
    getInputList(): Map<number, IDiagramPort>;
    getOutputList(): Map<number, IDiagramPort>;
    getImplement(): DefaultNodeModel;
}

export interface IDiagramSheet {
    createNode(joint: IProcedureJoint): Promise<IDiagramNode | undefined>;
    addNode(node: IDiagramNode): boolean;
    destroy(): boolean;
}

export interface IDiagramNodeService {
    createNode(joint: IProcedureJoint): Promise<IDiagramNode | undefined>;
}

export interface IDiagramSheetService {
    createSheet(procedure: IProcedure): Promise<IDiagramSheet | undefined>;
    getSheet(id: IProcedureID): IDiagramSheet | undefined;
    destroyAllSheets(): void;
}

export interface IDiagramEngineService {
    getEngine(): DiagramEngine;
    getFormatter(): DagreEngine;
    setSheet(sheet: IDiagramSheet): boolean;
    formatSheet(sheet: IDiagramSheet): boolean;
}

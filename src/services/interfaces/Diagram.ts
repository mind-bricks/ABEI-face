import {
    DefaultPortModel,
    // DefaultNodeModel,
    DiagramEngine,
} from '@projectstorm/react-diagrams';
import {
    IProcedure,
    IProcedureID,
} from './Procedure';


export interface IDiagramPort {
    getSignature(): string;
    getKey(): string;
    getImplement(): DefaultPortModel;
}

export interface IDiagramNode {
    load(procedure: IProcedure): Promise<boolean>;
    destroy(): boolean;
    getSignature(): string;
    getDocument(): string;
    getInputList(): IDiagramPort[];
    getOutputList(): IDiagramPort[];
}

export interface IDiagramSheet {
    load(procedure: IProcedure): Promise<boolean>;
    createNode(procedure: IProcedure): Promise<IDiagramNode | undefined>;
    addNode(node: IDiagramNode): boolean;
    destroy(): boolean;
}

export interface IDiagramNodeService {
    createNode(procedure: IProcedure): Promise<IDiagramNode | undefined>;
}

export interface IDiagramSheetService {
    createSheet(procedure: IProcedure): Promise<IDiagramSheet | undefined>;
    getSheet(id: IProcedureID): IDiagramSheet | undefined;
    destroyAllSheets(): void;
}

export interface IDiagramEngineService {
    getEngine(): DiagramEngine;
    setSheet(sheet: IDiagramSheet): boolean;
}

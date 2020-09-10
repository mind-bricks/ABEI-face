import React from 'react';
import {
    IProcedure,
    IDiagramPort,
    IDiagramNode,
    IDiagramSheet,
    IDiagramNodeService,
    IDiagramSheetService,
    IDiagramEngineService,
} from '..';

import createEngine, {
    // DefaultLinkModel,
    DefaultNodeModel,
    DefaultPortModel,
    DiagramEngine,
    DiagramModel,
    // LinkModel,
    PortModel,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import {
    AbstractReactFactory,
    GenerateModelEvent,
    GenerateWidgetEvent,
    Toolkit,
} from '@projectstorm/react-canvas-core';
import {
    DiagramWidget
} from './DiagramWidget';


class DiagramNodeInput extends DefaultPortModel implements IDiagramPort {

    constructor(label: string) {
        super({
            in: true,
            name: Toolkit.UID(),
            label: label,
            alignment: PortModelAlignment.LEFT,
            maximumLinks: 1,
        });
    }

    canLinkToPort(port: PortModel): boolean {
        if (this.getNode() === port.getNode()) {
            // can not link to self node
            console.error('can not link to self');
            return false;
        }
        return super.canLinkToPort(port);
    }

    // createLinkModel(): LinkModel | null {
    //     return new DefaultLinkModel({
    //         color: 
    //     });
    // }

    getSignature(): string {
        return this.getOptions().label || '';
    }

    getKey(): string {
        return this.getID();
    }

    getImplement() {
        return this;
    }
}

class DiagramNodeOutput extends DefaultPortModel implements IDiagramPort {
    constructor(label: string) {
        super({
            in: false,
            name: Toolkit.UID(),
            label: label,
            alignment: PortModelAlignment.RIGHT,
        });
    }

    canLinkToPort(port: PortModel): boolean {
        if (this.getNode() === port.getNode()) {
            // can not link to self node
            console.error('can not link to self');
            return false;
        }
        if (Object.entries(port.getLinks()).length >= port.getMaximumLinks()) {
            return false;
        }
        return super.canLinkToPort(port);
    }

    getSignature(): string {
        return this.getOptions().label || '';
    }

    getKey(): string {
        return this.getID();
    }

    getImplement() {
        return this;
    }
}


class DiagramNode extends DefaultNodeModel implements IDiagramNode {
    protected signature = '';
    protected document = '';
    protected portsIn: DiagramNodeInput[] = [];
    protected portsOut: DiagramNodeOutput[] = [];

    constructor() {
        super({ type: 'procedure' });
    }

    addInPort(label: string, after = true): DefaultPortModel {
        const p = new DiagramNodeInput(label);
        if (!after) {
            this.portsIn.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    addOutPort(label: string, after = true): DefaultPortModel {
        const p = new DiagramNodeOutput(label);
        if (!after) {
            this.portsOut.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    async load(procedure: IProcedure): Promise<boolean> {
        this.signature = procedure.signature;
        this.document = await procedure.getDocument();
        const inputs = await procedure.getInputSignatureList();
        const outputs = await procedure.getOutputSignatureList();

        for (const p of this.portsIn.splice(0))
            this.removePort(p);

        for (const p of this.portsOut.splice(0))
            this.removePort(p);

        for (const sig of inputs)
            this.addInPort(sig);

        for (const sig of outputs)
            this.addOutPort(sig);

        return true;
    }

    destroy(): boolean {
        this.remove();
        return true;
    }

    getSignature(): string {
        return this.signature;
    }

    getDocument(): string {
        return this.document;
    }

    getInputList(): IDiagramPort[] {
        return this.portsIn;
    }

    getOutputList(): IDiagramPort[] {
        return this.portsOut;
    }
}


class DiagramSheet implements IDiagramSheet {
    signature: string | undefined;
    model: DiagramModel = new DiagramModel();

    constructor(protected sheetService: DiagramSheetService) { }

    async load(procedure: IProcedure): Promise<boolean> {
        // TODO: load procedure
        return false;
    }

    async createNode(procedure: IProcedure)
        : Promise<IDiagramNode | undefined> {
        const node = new DiagramNode();
        if (!await node.load(procedure)) {
            return undefined;
        }

        this.model.addNode(node);
        return node;
    }

    addNode(node: IDiagramNode): boolean {
        if (!(node instanceof DiagramNode))
            return false;

        this.model.addNode(node);
        return true;
    }

    destroy(): boolean {
        if (!this.signature)
            return false;

        return this.sheetService.destroySheet(this.signature);
    }
}

export class DiagramNodeService implements IDiagramNodeService {
    async createNode(procedure: IProcedure): Promise<IDiagramNode | undefined> {
        const node = new DiagramNode();
        if (await node.load(procedure)) {
            return node;
        }
        return undefined;
    }
}

export class DiagramSheetService implements IDiagramSheetService {
    protected models: Map<string, IDiagramSheet>;

    constructor() {
        this.models = new Map<string, IDiagramSheet>();
    }

    async createSheet(procedure: IProcedure)
        : Promise<IDiagramSheet | undefined> {
        if (this.models.has(procedure.signature))
            return undefined;

        const sheet = new DiagramSheet(this);
        if (!await sheet.load(procedure))
            return undefined;

        this.models.set(procedure.signature, sheet);
        return sheet
    }

    getSheet(signature: string): IDiagramSheet | undefined {
        return this.models.get(signature);
    }

    destroyAllSheets(): void {
        this.models.clear();
    }

    destroySheet(signature: string): boolean {
        return this.models.delete(signature);
    }
}

class DiagramNodeFactory extends AbstractReactFactory<
    DiagramNode,
    DiagramEngine
    >
{

    constructor() {
        super('procedure');
    }

    generateModel(event: GenerateModelEvent): DiagramNode {
        return new DiagramNode();
    }

    generateReactWidget(event: GenerateWidgetEvent<DiagramNode>): JSX.Element {
        return <DiagramWidget engine={this.engine} node={event.model}></DiagramWidget>
    }
}


export class DiagramEngineService implements IDiagramEngineService {

    constructor(protected engine = createEngine()) {
        engine.getNodeFactories().registerFactory(new DiagramNodeFactory());
    }

    getEngine(): DiagramEngine {
        return this.engine;
    }

    setSheet(sheet: IDiagramSheet): boolean {
        if (!(sheet instanceof DiagramSheet))
            return false;

        this.engine.setModel(sheet.model);
        return true;
    }
}

import React from 'react';
import {
    IProcedureID,
    IProcedure,
    IDiagramPort,
    IDiagramNode,
    IDiagramSheet,
    IDiagramNodeService,
    IDiagramSheetService,
    IDiagramEngineService,
} from '..';

import createEngine, {
    DagreEngine,
    DefaultLinkModel,
    DefaultNodeModel,
    DefaultPortModel,
    DiagramEngine,
    DiagramModel,
    LinkModel,
    // PathFindingLinkFactory,
    PortModel,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import {
    BaseEvent,
    AbstractReactFactory,
    GenerateModelEvent,
    GenerateWidgetEvent,
    Toolkit,
} from '@projectstorm/react-canvas-core';
import {
    DiagramNodeWidget,
} from './DiagramWidget';
import { IProcedureJoint } from '../interfaces/Procedure';


class DiagramLink extends DefaultLinkModel {

    load(): boolean {
        this.registerListener({
            targetPortChanged: async (_e: BaseEvent) => {
                const [portOut, portIn] = this.getSortedPorts();
                if (portOut && portIn) {
                    await portIn.joint.setLink(portIn.index, {
                        index: portOut.index,
                        joint: portOut.joint,
                    });
                }
            },
            entityRemoved: async (_e: BaseEvent) => {
                const [portOut, portIn] = this.getSortedPorts();
                if (portOut && portIn) {
                    console.log('deleting link');
                    await portIn.joint.setLink(
                        portIn.index, undefined);
                }
            },
        });
        return true;
    }

    getSortedPorts(): [DiagramPortOut | null, DiagramPortIn | null] {
        const source = this.getSourcePort();
        const target = this.getTargetPort();

        if (
            source instanceof DiagramPortOut &&
            target instanceof DiagramPortIn
        ) {
            return [source, target];
        }

        if (
            source instanceof DiagramPortIn &&
            target instanceof DiagramPortOut
        ) {
            return [target, source];
        }

        return [null, null];
    }

}

abstract class DiagramPort extends DefaultPortModel implements IDiagramPort {
    constructor(
        label: string,
        isIn: boolean,
        readonly index: number,
        readonly joint: IProcedureJoint,
    ) {
        super({
            in: isIn,
            name: Toolkit.UID(),
            label: label,
            alignment: isIn ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
            maximumLinks: isIn ? 1 : undefined,
        });
    }

    createLinkModel(): LinkModel {
        const link = new DiagramLink();
        link.load();
        return link;
    }

    getSignature(): string {
        return this.getOptions().label || '';
    }

    getKey(): string {
        return this.getID();
    }

    getIndex(): number {
        return this.index;
    }

    getImplement() {
        return this;
    }
}

class DiagramPortIn extends DiagramPort {

    constructor(
        index: number,
        label: string,
        joint: IProcedureJoint,
    ) {
        super(label, true, index, joint);
    }

    canLinkToPort(port: PortModel): boolean {
        if (!(port instanceof DiagramPort)) {
            console.error('invalid port type');
            return false;
        }

        if (this.getOptions().label !== port.getOptions().label) {
            console.error('output port mismatch');
            return false;
        }

        if (this.getNode() === port.getNode()) {
            // can not link to self node
            console.error('can not link to self');
            return false;
        }

        for (const l of Object.values(this.getLinks())) {
            if (l.getTargetPort() === port) {
                console.error('target port already linked');
                return false;
            }
            if (l.getSourcePort() === port) {
                console.error('source port already linked');
                return false;
            }
        }

        if (Object.entries(this.getLinks()).length > this.getMaximumLinks()) {
            return false;
        }

        return super.canLinkToPort(port);
    }
}

class DiagramPortOut extends DiagramPort {
    constructor(
        index: number,
        label: string,
        joint: IProcedureJoint,
    ) {
        super(label, false, index, joint);
    }

    canLinkToPort(port: PortModel): boolean {
        if (!(port instanceof DiagramPort)) {
            console.error('invalid port type');
            return false;
        }

        if (this.getOptions().label !== port.getOptions().label) {
            console.error('input port mismatch');
            return false;
        }

        if (this.getNode() === port.getNode()) {
            // can not link to self node
            console.error('can not link to self');
            return false;
        }

        for (const l of Object.values(this.getLinks())) {
            if (l.getTargetPort() === port) {
                console.error('target port already linked');
                return false;
            }
            if (l.getSourcePort() === port) {
                console.error('source port already linked');
                return false;
            }
        }

        return super.canLinkToPort(port);
    }
}


class DiagramNode extends DefaultNodeModel implements IDiagramNode {
    protected signature = '';
    protected document = '';
    protected inputs = new Map<number, DiagramPortIn>();
    protected outputs = new Map<number, DiagramPortOut>();

    constructor(readonly joint: IProcedureJoint) {
        super({ type: 'procedure' });
    }

    async load(): Promise<boolean> {
        const procedure = this.joint.getCallee();
        this.signature = procedure.signature;
        this.document = await procedure.getDocument();
        const inputs = await procedure.getInputSignatureList();
        const outputs = await procedure.getOutputSignatureList();

        for (const p of this.inputs.values())
            this.removePort(p);

        for (const p of this.outputs.values())
            this.removePort(p);

        this.inputs.clear();
        this.outputs.clear();

        for (const sig of [...inputs.entries()].sort()) {
            const [index, label] = sig;
            const port = new DiagramPortIn(index, label, this.joint);
            this.inputs.set(index, port);
            this.addPort(port);
        }

        for (const sig of [...outputs.entries()].sort()) {
            const [index, label] = sig;
            const port = new DiagramPortOut(index, label, this.joint);
            this.outputs.set(index, port);
            this.addPort(port);
        }

        // register listener
        this.registerListener({
            entityRemoved: async (_e: BaseEvent) => {
                console.log('deleting node');
                await this.joint.destroy();
            },
        });

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

    getInputList(): Map<number, IDiagramPort> {
        return this.inputs;
    }

    getOutputList(): Map<number, IDiagramPort> {
        return this.outputs;
    }

    getImplement(): DefaultNodeModel {
        return this;
    }
}


class DiagramSheet implements IDiagramSheet {
    signature: string | undefined;
    model: DiagramModel = new DiagramModel();

    constructor(protected sheetService: DiagramSheetService) { }

    async load(procedure: IProcedure): Promise<boolean> {
        const jointNodes = new Map<string, DiagramNode>();
        for (const joint of await procedure.getJointList()) {
            const node = new DiagramNode(joint);
            if (!await node.load()) {
                return false;
            }
            jointNodes.set(joint.signature, node);
        }

        for (const inputJointNode of jointNodes.values()) {
            // add node to model
            this.model.addNode(inputJointNode);
        }

        for (const inputJointNode of jointNodes.values()) {
            for (const i of (await inputJointNode.joint.getLinkList()).entries()) {
                const link = {
                    inputIndex: i[0],
                    outputIndex: i[1].index,
                    outputJoint: i[1].joint,
                }
                if (!link.outputJoint) {
                    // TODO: link to procedure input
                    throw Error('not implemented');

                } else {
                    const outputJointNode = jointNodes.get(link.outputJoint.signature);
                    if (!outputJointNode) {
                        throw Error('joint not found in current procedure');
                    }
                    const linkOutput = outputJointNode.getOutputList().get(link.outputIndex);
                    const linkInput = inputJointNode.getInputList().get(link.inputIndex);
                    if (!linkInput || !linkOutput) {
                        throw Error('port not found');
                    }

                    // add link to model
                    const linkNode = new DiagramLink();
                    linkNode.setSourcePort(linkOutput.getImplement());
                    linkNode.setTargetPort(linkInput.getImplement());
                    linkNode.load();
                    this.model.addLink(linkNode);
                }
            }
        }

        return true;
    }

    async createNode(joint: IProcedureJoint)
        : Promise<IDiagramNode | undefined> {
        const node = new DiagramNode(joint);
        if (!await node.load()) {
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
    async createNode(joint: IProcedureJoint): Promise<IDiagramNode | undefined> {
        const node = new DiagramNode(joint);
        if (await node.load()) {
            return node;
        }
        return undefined;
    }
}

export class DiagramSheetService implements IDiagramSheetService {
    protected models: Map<string, Map<string, IDiagramSheet>>;

    constructor() {
        this.models = new Map<string, Map<string, IDiagramSheet>>();
    }

    async createSheet(procedure: IProcedure)
        : Promise<IDiagramSheet | undefined> {
        const site = await procedure.getSite();
        let models = this.models.get(site.signature);
        if (models && models.has(procedure.signature)) {
            return undefined;
        }

        const sheet = new DiagramSheet(this);
        if (!await sheet.load(procedure))
            return undefined;

        if (!models) {
            models = new Map<string, IDiagramSheet>();
            this.models.set(site.signature, models);
        }

        models.set(procedure.signature, sheet);
        return sheet
    }

    getSheet(id: IProcedureID): IDiagramSheet | undefined {
        const models = this.models.get(id.site);
        return models ? models.get(id.signature) : undefined;
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
        if (!event.initialConfig.joint) {
            throw Error('node should be initialized by joint');
        }
        return new DiagramNode(event.initialConfig.joint);
    }

    generateReactWidget(event: GenerateWidgetEvent<DiagramNode>): JSX.Element {
        return <DiagramNodeWidget engine={this.engine} node={event.model}></DiagramNodeWidget>
    }
}

// class DiagramLinkFactory extends AbstractReactFactory<
//     DiagramLink,
//     DiagramEngine
//     >
// {

//     constructor() {
//         super('procedure');
//     }

//     generateModel(event: GenerateModelEvent): DiagramLink {
//         if (!event.initialConfig.joint) {
//             throw Error('link should be initialized by joint');
//         }
//         return new DiagramLink(event.initialConfig.joint);
//     }

//     generateReactWidget(event: GenerateWidgetEvent<DiagramLink>): JSX.Element {
//         return <DiagramWidget engine={this.engine} node={event.model}></DiagramWidget>
//     }
// }


export class DiagramEngineService implements IDiagramEngineService {

    constructor(
        protected engine = createEngine(),
        protected formatter = new DagreEngine({
            graph: {
                rankdir: 'LR',
                ranker: 'longest-path',
                marginx: 25,
                marginy: 25,
            },
            includeLinks: true,
        }),
    ) {
        engine.getNodeFactories().registerFactory(new DiagramNodeFactory());
    }

    getEngine(): DiagramEngine {
        return this.engine;
    }

    getFormatter(): DagreEngine {
        return this.formatter;
    }

    setSheet(sheet: IDiagramSheet): boolean {
        if (!(sheet instanceof DiagramSheet))
            return false;

        this.engine.setModel(sheet.model);
        return true;
    }

    formatSheet(sheet: IDiagramSheet): boolean {
        if (!(sheet instanceof DiagramSheet))
            return false;

        this.formatter.redistribute(sheet.model);
        return true;
    }
}

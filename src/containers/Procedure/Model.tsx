import {
    // DefaultLinkModel,
    DefaultNodeModel,
    DefaultPortModel,
    // LinkModel,
    PortModel,
    PortModelAlignment,
} from '@projectstorm/react-diagrams';
import { Toolkit } from '@projectstorm/react-canvas-core';


export class ProcedureInputModel extends DefaultPortModel {
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
}

export class ProcedureOutputModel extends DefaultPortModel {
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
}


export interface IProcedureModelOptions {
    signature: string;
    inputs: string[];
    outputs: string[];
}


export class ProcedureModel extends DefaultNodeModel {
    protected signature: string;

    constructor(options: IProcedureModelOptions) {
        super({ type: 'procedure' });

        this.signature = options.signature;

        for (const sig of options.inputs) {
            this.addInPort(sig);
        }

        for (const sig of options.outputs) {
            this.addOutPort(sig);
        }
    }

    getSignature() {
        return this.signature;
    }

    addInPort(label: string, after = true): DefaultPortModel {
        const p = new ProcedureInputModel(label);
        if (!after) {
            this.portsIn.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    addOutPort(label: string, after = true): DefaultPortModel {
        const p = new ProcedureOutputModel(label);
        if (!after) {
            this.portsOut.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    serialize() {
        return { ...super.serialize(), signature: this.signature };
    }

    deserialize(event: any): void {
        super.deserialize(event);
        this.signature = event.data.signature;
    }
}



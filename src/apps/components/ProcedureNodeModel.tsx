import {
    NodeModel,
    DefaultPortModel,
} from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface ProcedureNodeModelOptions extends BaseModelOptions {
    inputs?: string[];
    outputs?: string[];
    color?: string;
}

export class ProcedureNodeModel extends NodeModel {
    inputs: string[];
    outputs: string[];
    color: string;

    constructor(options: ProcedureNodeModelOptions = {}) {
        super({ ...options, type: 'ts-procedure-node' });
        this.color = options.color || 'red';
        this.inputs = options.inputs || [];
        this.inputs.forEach((sig: string, index: number, _: string[]) => {
            this.addPort(new DefaultPortModel({
                in: true,
                label: sig,
                name: `in_${index}`,
            }));
        });
        this.outputs = options.outputs || [];
        this.outputs.forEach((sig: string, index: number, _: string[]) => {
            this.addPort(new DefaultPortModel({
                in: false,
                label: sig,
                name: `out_${index}`,
            }));
        });
    }

    serialize() {
        return { ...super.serialize(), color: this.color };
    }

    deserialize(event: any): void {
        super.deserialize(event);
        this.color = event.data.color;
    }
}
import {
    NodeModel,
    DefaultPortModel,
} from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface IProcedureModelOptions extends BaseModelOptions {
    signature?: string;
    inputs?: string[];
    outputs?: string[];
    color?: string;
}

export class Procedure extends NodeModel {
    signature: string;
    color: string;

    constructor(options: IProcedureModelOptions = {}) {
        super({ ...options, type: 'ts-procedure-node' });
        this.signature = options.signature || 'unknown';
        this.color = options.color || 'red';

        const inputs = options.inputs || [];
        inputs.forEach((sig: string, index: number, _: string[]) => {
            this.addPort(new DefaultPortModel({
                in: true,
                label: sig,
                name: `in_${index}`,
            }));
        });

        const outputs = options.outputs || [];
        outputs.forEach((sig: string, index: number, _: string[]) => {
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
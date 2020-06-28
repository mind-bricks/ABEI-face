import {
    NodeModel,
    DefaultPortModel,
} from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface IProcedureModelOptions extends BaseModelOptions {
    signature?: string;
    inputs?: string[];
    outputs?: string[];
}

export class ProcedureModel extends NodeModel {
    signature: string;

    constructor(options: IProcedureModelOptions = {}) {
        super({ ...options, type: 'procedure' });
        this.signature = options.signature || 'unknown';

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
        return { ...super.serialize(), signature: this.signature };
    }

    deserialize(event: any): void {
        super.deserialize(event);
        this.signature = event.data.signature;
    }
}
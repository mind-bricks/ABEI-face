import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { ProcedureNodeModel } from './ProcedureNodeModel';
import { ProcedureNodeWidget } from './ProcedureNodeWidget';


export class ProcedureNodeFactory extends AbstractReactFactory<ProcedureNodeModel, DiagramEngine> {
    constructor() {
        super('ts-procedure-node');
    }

    generateModel(initialConfig: any) {
        return new ProcedureNodeModel(initialConfig);
    }

    generateReactWidget(event: any): JSX.Element {
        return <ProcedureNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
    }
}

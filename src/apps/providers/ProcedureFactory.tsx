import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { Procedure } from './Procedure';


export class ProcedureFactory extends AbstractReactFactory<
    Procedure,
    DiagramEngine
    >
{

    constructor() {
        super('ts-procedure-node');
    }

    generateModel(initialConfig: any) {
        return new Procedure(initialConfig);
    }

    generateReactWidget(event: any): JSX.Element {
        const AppProcedure = require('../components/AppProcedure');
        return <AppProcedure
            engine={this.engine as DiagramEngine}
            node={event.model}
        />;
    }
}

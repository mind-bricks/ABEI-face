import * as React from 'react';
import {
    AbstractReactFactory,
    GenerateModelEvent,
    GenerateWidgetEvent,
} from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { ProcedureModel } from './Model';
import { ProcedureWidget } from './Widget';


export class ProcedureFactory extends AbstractReactFactory<
    ProcedureModel, DiagramEngine>
{

    constructor() {
        super('procedure');
    }

    generateModel(event: GenerateModelEvent): ProcedureModel {
        return new ProcedureModel(event.initialConfig);
    }

    generateReactWidget(event: GenerateWidgetEvent<ProcedureModel>): JSX.Element {
        return (
            <ProcedureWidget
                engine={this.engine as DiagramEngine}
                model={event.model}
            />
        );
    }
}

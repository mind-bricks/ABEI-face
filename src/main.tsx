import * as React from 'react';
import * as ReactDOM from 'react-dom';
import createEngine, {
    DefaultLinkModel,
    DiagramModel,
} from '@projectstorm/react-diagrams';

import { ProcedureNodeFactory } from './apps/components/ProcedureNodeFactory';
import { ProcedurePanelWidget } from './apps/components/ProcedurePanelWidget';
import './theme/main.css';

document.addEventListener('DOMContentLoaded', () => {
    // create an instance of the engine
    const engine = createEngine();
    const factory = new ProcedureNodeFactory();

    // register the two engines
    engine.getNodeFactories().registerFactory(factory);
    // engine.getNodeFactories().registerFactory(new TSCustomNodeFactory());

    // create a diagram model
    const model = new DiagramModel();

    //####################################################
    // now create two nodes of each type, and connect them

    const node1 = factory.generateModel({ color: 'rgb(192,255,0)' });
    node1.setPosition(50, 50);

    const node2 = factory.generateModel({ color: 'rgb(0,192,255)' });
    node2.setPosition(200, 50);

    const link1 = new DefaultLinkModel();
    link1.setSourcePort(node1.getPort('out'));
    link1.setTargetPort(node2.getPort('in'));

    model.addAll(node1, node2, link1);

    //####################################################

    // install the model into the engine
    engine.setModel(model);

    ReactDOM.render(
        <ProcedurePanelWidget engine={engine} />,
        document.querySelector('#application')
    );
});

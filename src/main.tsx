import * as React from 'react';
import * as ReactDOM from 'react-dom';
import createEngine, {
    // DefaultLinkModel,
    DiagramModel,
} from '@projectstorm/react-diagrams';

import { ProcedureNodeFactory } from './apps/components/ProcedureNodeFactory';
import { ProcedurePanelWidget } from './apps/components/ProcedurePanelWidget';
import './theme/main.css';
// import './theme/main.less';

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

    const node1 = factory.generateModel({
        signature: 'add@py:float@py',
        color: 'rgb(192,255,0)',
        inputs: ['float@py', 'float@py'],
        outputs: ['float@py'],
    });
    node1.setPosition(50, 50);
    // node1.clearListeners();

    const node2 = factory.generateModel({
        signature: 'mul@py:float@py',
        inputs: ['float@py', 'float@py'],
        outputs: ['float@py'],
        color: 'rgb(0,192,255)',
    });
    node2.setPosition(200, 50);
    // node1.clearListeners();

    // const link1 = new DefaultLinkModel();
    // link1.setSourcePort(node1.getPort('out'));
    // link1.setTargetPort(node2.getPort('in'));

    model.addAll(node1, node2);

    //####################################################

    // install the model into the engine
    engine.setModel(model);

    ReactDOM.render(
        <ProcedurePanelWidget engine={engine} />,
        document.querySelector('#application')
    );
});

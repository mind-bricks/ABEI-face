import * as React from 'react';
import createEngine, {
    DiagramEngine,
    DiagramModel,
} from '@projectstorm/react-diagrams';
import {
    Container,
    CssBaseline,
} from '@material-ui/core';
import { AppTitle } from './AppTitle';
import { AppMenu } from './AppMenu';
import { AppContent } from './AppContent';
import { ProcedureFactory } from '../providers/ProcedureFactory';


export interface IAppIDEProps {
}

export interface IAppIDEState {
    engine: DiagramEngine,
    model: DiagramModel,
    factory: ProcedureFactory,
}

export class AppIDE extends React.Component<
    IAppIDEProps, IAppIDEState>
{

    constructor(props: IAppIDEProps) {
        super(props);
        const engine = createEngine();
        const factory = new ProcedureFactory();
        const model = new DiagramModel();
        engine.getNodeFactories().registerFactory(factory);
        engine.setModel(model);
        this.state = { engine, factory, model };
    }

    render() {
        return (
            <Container>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <AppMenu />
                <AppTitle name="ABEI" />
                <AppContent engine={this.state.engine} />
            </Container>
        );
    }
}

// function test() {
//     // create an instance of the engine
//     const engine = createEngine();
//     const factory = new ProcedureFactory();
//     // register factories
//     engine.getNodeFactories().registerFactory(factory);

//     // create a diagram model
//     const model = new DiagramModel();

//     //####################################################
//     // now create two nodes of each type, and connect them

//     const node1 = factory.generateModel({
//         signature: 'add@py:float@py',
//         color: 'rgb(192,255,0)',
//         inputs: ['float@py', 'float@py'],
//         outputs: ['float@py'],
//     });
//     node1.setPosition(50, 50);
//     // node1.clearListeners();

//     const node2 = factory.generateModel({
//         signature: 'mul@py:float@py',
//         inputs: ['float@py', 'float@py'],
//         outputs: ['float@py'],
//         color: 'rgb(0,192,255)',
//     });
//     node2.setPosition(200, 50);
//     // node1.clearListeners();

//     // const link1 = new DefaultLinkModel();
//     // link1.setSourcePort(node1.getPort('out'));
//     // link1.setTargetPort(node2.getPort('in'));

//     model.addAll(node1, node2);

//     //####################################################

//     // install the model into the engine
//     engine.setModel(model);
// }

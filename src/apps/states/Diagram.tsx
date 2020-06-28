import { Action } from 'redux';
import createEngine, {
    DiagramEngine,
    DiagramModel,
} from '@projectstorm/react-diagrams';

export interface IState {
    engine: DiagramEngine;
}

// interface IResetEngine extends Action<'RESET_ENGINE'> {
//     engine: DiagramEngine;
// }

interface IResetModel extends Action<'RESET_MODEL'> {
    model: DiagramModel;
}

type IAction = IResetModel;


function getInitialState(): IState {
    const engine = createEngine();
    engine.setModel(new DiagramModel());
    return { engine };

    // const factory = engine.getFactoryForNode('procedure');
    // const model = engine.getModel();
    // const node1 = factory.generateModel({
    //     initialConfig: {
    //         signature: 'add@py:float@py',
    //         color: 'rgb(192,255,0)',
    //         inputs: ['float@py', 'float@py'],
    //         outputs: ['float@py'],
    //     }
    // });
    // node1.setPosition(50, 50);
    // // node1.clearListeners();

    // const node2 = factory.generateModel({
    //     initialConfig: {
    //         signature: 'mul@py:float@py',
    //         inputs: ['float@py', 'float@py'],
    //         outputs: ['float@py'],
    //         color: 'rgb(0,192,255)',
    //     }
    // });
    // node2.setPosition(200, 50);
    // // node1.clearListeners();

    // // const link1 = new DefaultLinkModel();
    // // link1.setSourcePort(node1.getPort('out'));
    // // link1.setTargetPort(node2.getPort('in'));

    // model.addAll(node1, node2);
}

export function resetModel(model: DiagramModel): IResetModel {
    return {
        type: 'RESET_MODEL',
        model,
    }
}

export function reduce(
    state: IState = getInitialState(),
    action: IAction,
): IState {
    switch (action.type) {
        case 'RESET_MODEL':
            const engine = state.engine;
            engine.setModel(action.model);
            return { ...state };
        default:
            return state;
    }
}

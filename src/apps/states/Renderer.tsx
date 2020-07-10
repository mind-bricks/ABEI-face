import { Action } from 'redux';
import createEngine, {
    DiagramEngine,
    DiagramModel,
} from '@projectstorm/react-diagrams';
import { ProcedureFactory } from '../components/Procedure';

// import { AbstractFactory } from '@projectstorm/react-canvas-core';

export interface IState {
    engine: DiagramEngine;
    models: Map<string, DiagramModel>;
    modelNameSelected: string | undefined;
}

// interface IRegisterFactory extends Action<'REGISTER_FACTORY'> {
//     factory: AbstractFactory<DiagramEngine>;
// }

interface IAddModel extends Action<'ADD_MODEL'> {
    modelName: string;
    model: DiagramModel;
}

interface IDeleteModel extends Action<'DELETE_MODEL'> {
    modelName: string;
}

interface ISelectModel extends Action<'SELECT_MODEL'> {
    modelName: string;
}

type IAction =
    // IRegisterFactory |
    IAddModel |
    IDeleteModel |
    ISelectModel;


function getInitialState(): IState {
    const engine = createEngine();
    const factory = new ProcedureFactory();
    // FIXME: using actions to register factory 
    engine.getNodeFactories().registerFactory(factory);

    // return {
    //     engine,
    //     models: new Map(),
    //     modelNameSelected: undefined,
    // };

    // mock ----------------------------------------
    const model1 = new DiagramModel();
    // const factory = engine.getFactoryForNode('procedure');
    const node1 = factory.generateModel({
        initialConfig: {
            signature: 'add@py:float@py',
            inputs: ['float@py', 'float@py'],
            outputs: ['float@py'],
        }
    });

    const node2 = factory.generateModel({
        initialConfig: {
            signature: 'mul@py:float@py',
            inputs: ['float@py', 'float@py'],
            outputs: ['float@py'],
        }
    });
    // const link1 = new DefaultLinkModel();
    // link1.setSourcePort(node1.getPort('out'));
    // link1.setTargetPort(node2.getPort('in'));
    model1.addAll(node1, node2);

    const model2 = new DiagramModel();
    // const factory = engine.getFactoryForNode('procedure');
    const node3 = factory.generateModel({
        initialConfig: {
            signature: 'add@py:float@py',
            inputs: [],
            outputs: ['float@py'],
        }
    });

    const node4 = factory.generateModel({
        initialConfig: {
            signature: 'mul@py:float@py',
            inputs: ['float@py', 'float@py'],
            outputs: ['float@py'],
        }
    });
    // const link1 = new DefaultLinkModel();
    // link1.setSourcePort(node1.getPort('out'));
    // link1.setTargetPort(node2.getPort('in'));
    model2.addAll(node3, node4);
    // ---------------------------------------------

    return {
        engine,
        models: new Map([['test1', model1], ['test2', model2]]),
        modelNameSelected: 'test1',
    };

}

// export function registerFactory(
//     factory: AbstractFactory<DiagramEngine>,
// ): IRegisterFactory {
//     return {
//         type: 'REGISTER_FACTORY',
//         factory,
//     };
// }

export function addModel(
    modelName: string,
    model: DiagramModel,
): IAddModel {
    return {
        type: 'ADD_MODEL',
        modelName,
        model,
    };
}

export function deleteModel(
    modelName: string,
): IDeleteModel {
    return {
        type: 'DELETE_MODEL',
        modelName,
    };
}

export function selectModel(
    modelName: string,
): ISelectModel {
    return {
        type: 'SELECT_MODEL',
        modelName,
    };
}

export function reduce(
    state: IState = getInitialState(),
    action: IAction,
): IState {
    switch (action.type) {
        case 'ADD_MODEL':
            if (state.models.has(action.modelName)) {
                if (state.modelNameSelected === action.modelName) {
                    return state;
                }
                return {
                    ...state,
                    modelNameSelected: action.modelName,
                };
            }
            const models1 = new Map(state.models);
            models1.set(action.modelName, action.model);
            return {
                ...state,
                models: models1,
                modelNameSelected: action.modelName,
            };
        case 'DELETE_MODEL':
            if (!state.models.has(action.modelName)) {
                // nothing changed
                return state;
            }

            const models2 = new Map(state.models);
            models2.delete(action.modelName);

            if (state.modelNameSelected != action.modelName) {
                return { ...state, models: models2 };
            }

            return {
                ...state,
                models: models2,
                modelNameSelected: models2.values().next().value,
            };
        case 'SELECT_MODEL':
            if (!state.models.has(action.modelName)) {
                // nothing changed
                return state;
            }

            if (state.modelNameSelected == action.modelName) {
                return state;
            }

            return {
                ...state, modelNameSelected: action.modelName,
            };
        default:
            return state;
    }
}

import { combineReducers, createStore } from 'redux';
import {
    reduce as IDEReduce,
    IState as IIDEState,
} from './IDE';
import {
    reduce as DiagramReduce,
    IState as IDiagramState,
} from './Diagram';

export interface IState {
    ide: IIDEState;
    diagram: IDiagramState,
}

export const store = createStore(
    combineReducers({
        ide: IDEReduce,
        diagram: DiagramReduce,
    })
);

export {
    showSidebar as IDEShowSidebar,
    resizeSidebar as IDEResizeSidebar,
    showPanel as IDEShowPanel,
    resizePanel as IDEResizePanel,
    IState as IIDEState,
} from './IDE';
export {
    // resetEngine as DiagramResetEngine,
    resetModel as DiagramResetModel,
    IState as IDiagramState,
} from './Diagram';

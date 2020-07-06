import { combineReducers, createStore } from 'redux';
import {
    reduce as IDEReduce,
    IState as IIDEState,
} from './IDE';
import {
    reduce as DiagramReduce,
    IState as IDiagramState,
} from './Renderer';

export interface IState {
    ide: IIDEState;
    renderer: IDiagramState,
}

export const store = createStore(
    combineReducers({
        ide: IDEReduce,
        renderer: DiagramReduce,
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
    addModel as RendererAddModel,
    deleteModel as RendererDeleteModel,
    selectModel as RendererSelectModel,
    IState as IRendererState,
} from './Renderer';

import { combineReducers, createStore } from 'redux';
import {
    reduce as LayoutReduce,
    IState as ILayoutState,
} from './Layout';
import {
    reduce as RendererReduce,
    IState as IRendererState,
} from './Renderer';

export interface IState {
    layout: ILayoutState;
    renderer: IRendererState,
}

export const store = createStore(
    combineReducers({
        layout: LayoutReduce,
        renderer: RendererReduce,
    })
);

export {
    showSidebar as LayoutShowSidebar,
    resizeSidebar as LayoutResizeSidebar,
    showPanel as LayoutShowPanel,
    resizePanel as LayoutResizePanel,
    IState as ILayoutState,
} from './Layout';
export {
    addModel as RendererAddModel,
    deleteModel as RendererDeleteModel,
    selectModel as RendererSelectModel,
    IState as IRendererState,
} from './Renderer';

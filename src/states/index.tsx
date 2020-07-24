import { combineReducers, createStore } from 'redux';
import {
    reduce as LayoutReduce,
		IState as ILayoutState,
		showSidebar as LayoutShowSidebar,
    resizeSidebar as LayoutResizeSidebar,
    showPanel as LayoutShowPanel,
    resizePanel as LayoutResizePanel,
} from './Layout';
import {
    reduce as RendererReduce,
		IState as IRendererState,
		addModel as RendererAddModel,
    deleteModel as RendererDeleteModel,
    selectModel as RendererSelectModel,
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
    LayoutShowSidebar,
    LayoutResizeSidebar,
    LayoutShowPanel,
    LayoutResizePanel,
}
export {
    RendererAddModel,
    RendererDeleteModel,
    RendererSelectModel,
}

export type {ILayoutState};
export type {IRendererState};

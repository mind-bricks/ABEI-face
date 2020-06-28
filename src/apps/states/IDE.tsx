import { Action } from 'redux';

export interface IState {
    isSidebarShown: boolean;
    sidebarWidth: number;

    isPanelShown: boolean;
    panelHeight: number;
}


interface IShowSidebar extends Action<'SHOW_SIDEBAR'> {
    isSidebarShown: boolean;
}

interface IResizeSidebar extends Action<'RESIZE_SIDEBAR'> {
    sidebarWidth: number;
}

interface IShowPanel extends Action<'SHOW_PANEL'> {
    isPanelShown: boolean;
}

interface IResizePanel extends Action<'RESIZE_PANEL'> {
    panelHeight: number;
}

type IAction = IShowSidebar | IResizeSidebar | IShowPanel | IResizePanel;


export function showSidebar(show: boolean): IShowSidebar {
    return {
        type: 'SHOW_SIDEBAR',
        isSidebarShown: show,
    }
}

export function resizeSidebar(sidebarWidth: number): IResizeSidebar {
    return {
        type: 'RESIZE_SIDEBAR',
        sidebarWidth,
    }
}

export function showPanel(show: boolean): IShowPanel {
    return {
        type: 'SHOW_PANEL',
        isPanelShown: show,
    }
}

export function resizePanel(panelHeight: number): IResizePanel {
    return {
        type: 'RESIZE_PANEL',
        panelHeight,
    }
}

export function reduce(
    state: IState = {
        isSidebarShown: true,
        sidebarWidth: 240,

        isPanelShown: false,
        panelHeight: 240,
    },
    action: IAction,
): IState {
    switch (action.type) {
        case 'SHOW_SIDEBAR':
            return { ...state, isSidebarShown: action.isSidebarShown };
        case 'RESIZE_SIDEBAR':
            return { ...state, sidebarWidth: action.sidebarWidth };
        case 'SHOW_PANEL':
            return { ...state, isSidebarShown: action.isPanelShown };
        case 'RESIZE_PANEL':
            return { ...state, panelHeight: action.panelHeight };
        default:
            return state;
    }
}

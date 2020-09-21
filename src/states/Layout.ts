import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'layout',
    initialState: {
        isSidebarShown: true,
        sidebarWidth: 240,
        isPanelShown: false,
        panelHeight: 240,
    },
    reducers: {
        showSidebar: (state, action: PayloadAction<boolean>) => {
            state.isSidebarShown = action.payload;
        },
        showPanel: (state, action: PayloadAction<boolean>) => {
            state.isPanelShown = action.payload;
        },
        resizeSidebar: (state, action: PayloadAction<number>) => {
            state.sidebarWidth = action.payload;
        },
        resizePanel: (state, action: PayloadAction<number>) => {
            state.panelHeight = action.payload;
        },
    },
});

export const actions = slice.actions;
export const reducer = slice.reducer;

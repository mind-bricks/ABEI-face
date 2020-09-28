import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';


const slice = createSlice({
    name: 'notice',
    initialState: {
        warning: undefined as string | undefined,
        warningTimeout: 2, // seconds
        // warnings: [] as string[],
        // warningTimout: 3.0,
        // diaglogs: [] as string[],
    },
    reducers: {
        showWarning: (state, action: PayloadAction<string>) => {
            state.warning = action.payload;
        },
        clearWarning: (state, action: PayloadAction<void>) => {
            state.warning = undefined;
        },
        // showDiaglog: (state, action: PayloadAction<boolean>) => {
        //     state.isPanelShown = action.payload;
        // },
    },
});

export const actions = slice.actions;
export const reducer = slice.reducer;

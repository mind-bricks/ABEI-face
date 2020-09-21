import {
    createSlice,
    createAsyncThunk,
    PayloadAction,
} from '@reduxjs/toolkit';


interface IClearWarningArgs {
    id: string,
    timeout: number,
}

const clearWarning = createAsyncThunk<
    string,
    IClearWarningArgs
>(
    'notice/clearWarning',
    async (args: IClearWarningArgs) => {
        return new Promise<string>((reslove) => {
            setTimeout(
                () => { reslove(args.id); },
                args.timeout * 1000,
            );
        });
    }
);

interface IWarning {
    id: string,
    message: string,
}

const slice = createSlice({
    name: 'notice',
    initialState: {
        warning: undefined as IWarning | undefined,
        // warnings: [] as string[],
        // warningTimout: 3.0,
        // diaglogs: [] as string[],
    },
    reducers: {
        showWarning: (state, action: PayloadAction<IWarning>) => {
            state.warning = action.payload;
        },
        // showDiaglog: (state, action: PayloadAction<boolean>) => {
        //     state.isPanelShown = action.payload;
        // },
    },
    extraReducers: builder => {
        builder.addCase(clearWarning.fulfilled, (state, { payload }) => {
            if (state.warning && state.warning.id === payload) {
                state.warning = undefined;
            }
        });
    },
});

export const actions = { clearWarning, ...slice.actions };
export const reducer = slice.reducer;

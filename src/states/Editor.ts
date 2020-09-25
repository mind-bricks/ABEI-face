import {
    createSlice,
    createAsyncThunk,
    PayloadAction,
} from '@reduxjs/toolkit';
import {
    IProcedureID,
    IProcedureSite,
    IProcedureSiteService,
} from '../services';

// async actions =============================================================
interface IListSitesArgs {
    service: IProcedureSiteService;
}

const listSites = createAsyncThunk<
    string[],
    IListSitesArgs
>(
    'editor/listSites',
    async (args: IListSitesArgs) => {
        const { service } = args;
        const response = await service.getSiteList();
        // TODO: get all results
        const results = [];
        for (const r of response.results) {
            results.push(r.signature);
        }
        return results;
    }
);

interface IDestroySiteArgs {
    service: IProcedureSite;
}

const destroySite = createAsyncThunk<
    [string, boolean],
    IDestroySiteArgs
>(
    'editor/destroySite',
    async (args: IDestroySiteArgs) => {
        const { service } = args;
        return [service.signature, await service.destroy()];
    }
);

interface IListProceduresArgs {
    service: IProcedureSite;
}
const listProcedures = createAsyncThunk<
    [string, string[]],
    IListProceduresArgs
>(
    'editor/listProcedures',
    async (args: IListProceduresArgs) => {
        const { service } = args;
        const response = await service.getProcedureList();
        // TODO: get all results
        const results = [];
        for (const r of response.results) {
            results.push(r.signature);
        }
        return [service.signature, results];
    }
);

// ===========================================================================

// slice =====================================================================

const slice = createSlice({
    name: 'editor',
    initialState: {
        procedures: {} as { [key: string]: string[] },
        proceduresOpened: [] as IProcedureID[],
        procedureSelected: undefined as IProcedureID | undefined,
    },
    reducers: {
        selectProcedure: (state, action: PayloadAction<IProcedureID>) => {
            state.procedureSelected = action.payload;
            if (state.proceduresOpened.findIndex((value) => (
                value.site === action.payload.site &&
                value.signature === action.payload.signature
            )) === -1) {
                state.proceduresOpened.push(action.payload);
            }
        },
        closeProcedure: (state, action: PayloadAction<IProcedureID>) => {
            const index = state.proceduresOpened.findIndex((value) => (
                value.site === action.payload.site &&
                value.signature === action.payload.signature
            ));
            if (index !== -1) {
                state.proceduresOpened.splice(index, 1);
            }

            if (
                state.procedureSelected &&
                state.procedureSelected.site === action.payload.site &&
                state.procedureSelected.signature === action.payload.signature
            ) {
                state.procedureSelected =
                    state.proceduresOpened.length
                        ? state.proceduresOpened[0] : undefined;
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(listSites.fulfilled, (state, { payload }) => {
            const procedures = {} as { [key: string]: string[] };
            for (const site of payload)
                procedures[site] = state.procedures[site] || [];
            state.procedures = procedures;
        });
        builder.addCase(destroySite.fulfilled, (state, { payload }) => {
            if (payload[1]) {
                const signature = payload[0];
                delete state.procedures[signature];
            }
        });
        // builder.addCase(updateSites.rejected, (state, action) => {
        //     // TODO: add 
        // })
        builder.addCase(listProcedures.fulfilled, (state, { payload }) => {
            state.procedures[payload[0]] = payload[1];
        });
    }
});


// export ====================================================================
export const actions = {
    listSites,
    destroySite,
    listProcedures,
    ...slice.actions,
};
export const reducer = slice.reducer;

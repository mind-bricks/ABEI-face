import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';
import {
    IProcedureService,
    IProcedureSiteService,
} from '../services';


interface IUpdateAllSitesArgs {
    service: IProcedureSiteService;
}

const updateAllSites = createAsyncThunk<
    string[],
    IUpdateAllSitesArgs
>(
    'editor/updateAllSites',
    async (args: IUpdateAllSitesArgs) => {
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


interface ISelectProcedureArgs {
    service: IProcedureService;
    signature: string;
}

// interface demo 

const selectProcedure = createAsyncThunk<
    string,
    ISelectProcedureArgs
>(
    'editor/selectProcedure',
    async (args: ISelectProcedureArgs) => {
        const { service, signature } = args;
        const p = await service.getProcedure(signature);
        return p ? p.signature : '';
    }
);

const slice = createSlice({
    name: 'editor',
    initialState: {
        procedures: {} as { [key: string]: string[] },
        proceduresOpened: [] as string[],
        procedureSelected: '',
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(updateAllSites.fulfilled, (state, { payload }) => {
            const procedures = {} as { [key: string]: string[] };
            for (const site of payload)
                procedures[site] = state.procedures[site] || [];
            state.procedures = procedures;
        });
        // builder.addCase(updateSites.rejected, (state, action) => {
        //     // TODO: add 
        // })
        builder.addCase(selectProcedure.fulfilled, (state, { payload }) => {
            state.procedureSelected = payload;
        });
    }
});

export const actions = { updateAllSites, selectProcedure, ...slice.actions };
export const reducer = slice.reducer;

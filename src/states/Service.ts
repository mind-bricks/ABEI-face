import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import {
    DiagramEngine,
} from '@projectstorm/react-diagrams';
import {
    IProcedureSiteService,
    IDiagramNodeService,
    IDiagramSheetService,
    IDiagramEngineService,
    IUtilService,
} from '../services';

// service implementation -----------------------------------------------------
// import {
//     ProcedureSiteService,
// } from '../services/implements/ProcedureForMock';
import {
    ProcedureSiteService,
} from '../services/implements/ProcedureOfAPIV1';
import {
    DiagramNodeService,
    DiagramSheetService,
    DiagramEngineService,
} from '../services/implements/Diagram';
import {
    UtilService,
} from '../services/implements/Util';
// -----------------------------------------------------------------------------

const slice = createSlice({
    name: 'service',
    initialState: {
        // procedureSiteService: new ProcedureSiteService() as IProcedureSiteService,
        procedureSiteService: new ProcedureSiteService(
            process.env.REACT_APP_API_URL
                ? process.env.REACT_APP_API_URL : 'localhost',
        ) as IProcedureSiteService,
        diagramNodeService: new DiagramNodeService() as IDiagramNodeService,
        diagramSheetService: new DiagramSheetService() as IDiagramSheetService,
        diagramEngineService: new DiagramEngineService() as IDiagramEngineService,
        utilService: new UtilService() as IUtilService,
    },
    reducers: {
        resetEngine: (state, action: PayloadAction<DiagramEngine>) => {
            state.diagramEngineService = new DiagramEngineService(action.payload);
        },
    },
});

export const actions = slice.actions;
export const reducer = slice.reducer;


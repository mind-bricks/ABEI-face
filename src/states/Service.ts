import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import {
    DiagramEngine,
} from '@projectstorm/react-diagrams';
import {
    IProcedureService,
    IProcedureSiteService,
    IDiagramNodeService,
    IDiagramSheetService,
    IDiagramEngineService,
    IUtilService,
} from '../services';

// service implementation -----------------------------------------------------
import {
    ProcedureService,
    ProcedureSiteService,
} from '../services/implements/ProcedureForMock';
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
        procedureService: new ProcedureService() as IProcedureService,
        procedureSiteService: new ProcedureSiteService() as IProcedureSiteService,
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


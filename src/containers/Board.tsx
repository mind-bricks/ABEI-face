import React, {
    useState,
    useEffect,
} from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,
    Theme,
    Box,
    Typography,
} from '@material-ui/core';
import {
    CanvasWidget,
} from '@projectstorm/react-canvas-core';
import {
    IDiagramSheetService,
    IDiagramEngineService,
    IProcedureID,
    IProcedureSiteService,
    IUtilService,
} from '../services';
import {
    EditorActions,
    NoticeActions,
    IState,
} from '../states';


interface IBoardProps {
    // services
    diagramSheetService: IDiagramSheetService;
    diagramEngineService: IDiagramEngineService;
    procedureSiteService: IProcedureSiteService;
    utilSerivice: IUtilService;
    // resetEngine: Function,

    // layout
    sidebarWidth: number;
    isSidebarShown: boolean;
    panelHeight: number;
    isPanelShown: boolean;

    // editor
    procedureSelected: IProcedureID | undefined;
    closeProcedure: Function;

    // notice
    showWarning: Function;
}


export const Board = connect(
    (state: IState) => {
        return {
            diagramSheetService: state.service.diagramSheetService,
            diagramEngineService: state.service.diagramEngineService,
            procedureSiteService: state.service.procedureSiteService,
            utilSerivice: state.service.utilService,

            sidebarWidth: state.layout.sidebarWidth,
            isSidebarShown: state.layout.isSidebarShown,
            panelHeight: state.layout.panelHeight,
            isPanelShown: state.layout.isPanelShown,

            // procedures: state.editor.procedures,
            procedureSelected: state.editor.procedureSelected,
        };
    },
    {
        closeProcedure: EditorActions.closeProcedure,
        showWarning: NoticeActions.showWarning,
    }
)((props: IBoardProps) => {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            boardHeader: {
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                // necessary for content to be below app bar
                ...theme.mixins.toolbar,
                justifyContent: 'flex-end',
            },
            board: {
                // flexGrow: 1,
                // padding: theme.spacing(3),
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                marginLeft: 0,
                // width: '100vw',
            },
            boardShift: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: props.sidebarWidth,
            },
            boardCanvas: {
                height: `calc(100vh - ${props.isPanelShown ? props.panelHeight : 0}px)`,
                // width: '100vw',
            },
        }),
    );

    const classes = useStyles();

    const [, forceUpdate] = useState<object>({});
    const [
        selectedProcedure,
        setSelectedProcedure,
    ] = useState<IProcedureID | undefined>(undefined);

    useEffect(() => {
        (async () => {
            if (!props.procedureSelected) {
                setSelectedProcedure(undefined);
                return;
            }

            const site = await props.procedureSiteService.getSite(
                props.procedureSelected.site);
            if (!site) {
                props.showWarning('procedure is invalid');
                props.closeProcedure(props.procedureSelected);
                return;
            }

            const procedure = await site.getProcedure(
                props.procedureSelected.signature);
            if (!procedure) {
                props.showWarning('procedure is invalid');
                props.closeProcedure(props.procedureSelected);
                return;
            }

            if (!await procedure.getEditable()) {
                props.showWarning('procedure is not editable');
                props.closeProcedure(props.procedureSelected);
                return;
            }

            let sheet = props.diagramSheetService.getSheet(
                props.procedureSelected);

            let sheetCreated = false;
            if (!sheet) {
                sheet = await props.diagramSheetService.createSheet(procedure);
                sheetCreated = Boolean(sheet);
            }

            if (!sheet) {
                props.showWarning('procedure can not be loaded');
                props.closeProcedure(props.procedureSelected);
                return;
            }

            if (
                site.signature !== selectedProcedure?.site ||
                procedure.signature !== selectedProcedure?.signature
            ) {
                props.diagramEngineService.setSheet(sheet);
                setSelectedProcedure(props.procedureSelected);

                if (sheetCreated) {
                    // format sheet when it is loaded for the first time

                    await new Promise<void>((resolve) => {
                        // wait for 200 milliseconds
                        setTimeout(() => resolve(), 200);
                    });
                    props.diagramEngineService.formatSheet(sheet);
                    const engine = props.diagramEngineService.getEngine();
                    engine.repaintCanvas();
                }
            }

        })();
    });

    return (
        <Box
            className={clsx(classes.board, {
                [classes.boardShift]: props.isSidebarShown,
            })}
        >
            <Box className={classes.boardHeader} />
            {
                selectedProcedure
                    ? <Box
                        onDrop={async (event: React.DragEvent<HTMLElement>) => {
                            event.persist();

                            const data = JSON.parse(event.dataTransfer.getData('dragProcedure'));
                            const currentSite = await props.procedureSiteService.getSite(
                                selectedProcedure.site);

                            if (!currentSite) {
                                props.showWarning(`procedure site ${selectedProcedure.site} not found`);
                                return;
                            }

                            const currentProcedure = await currentSite.getProcedure(
                                selectedProcedure.signature);

                            if (!currentProcedure) {
                                props.showWarning(`procedure ${selectedProcedure.signature} not found`);
                                return;
                            }

                            if (
                                currentSite.signature === data.site &&
                                currentProcedure.signature === data.signature
                            ) {
                                props.showWarning('recursive calling is not allowed');
                                return;
                            }

                            const site = await props.procedureSiteService.getSite(data.site);
                            if (!site) {
                                props.showWarning('procedure site not found');
                                return;
                            }

                            if (!await currentSite.isDependingOn(site)) {
                                props.showWarning('current procedure does not depend on droped in procedure');
                                return;
                            }

                            const procedure = await site.getProcedure(data.signature);
                            if (!procedure) {
                                props.showWarning('invalid droped in procedure');
                                return;
                            }

                            const sheet = props.diagramSheetService.getSheet(
                                selectedProcedure);
                            if (!sheet) {
                                props.showWarning('current sheet not found');
                                props.closeProcedure(props.procedureSelected);
                                return;
                            }

                            const joint = await currentProcedure.createJoint(
                                props.utilSerivice.generateRandomString(6),
                                procedure,
                            )
                            if (!joint) {
                                props.showWarning('failed to create joint');
                                return;
                            }

                            const node = await sheet.createNode(joint);
                            if (!node) {
                                props.showWarning('procedure load error');
                                return;
                            }

                            // adjust node position
                            const engine = props.diagramEngineService.getEngine();
                            node.getImplement().setPosition(
                                engine.getRelativeMousePoint(event));

                            forceUpdate({});
                        }}
                        onDragOver={(event: React.DragEvent<HTMLElement>) => {
                            event.preventDefault();
                        }}
                    >
                        <CanvasWidget
                            className={classes.boardCanvas}
                            engine={props.diagramEngineService.getEngine()}
                        />
                    </Box>
                    : <Typography>Loading</Typography>
            }

        </Box>
    );
})

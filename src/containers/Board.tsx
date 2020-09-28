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
    IDiagramSheet,
    IDiagramSheetService,
    IDiagramEngineService,
    IProcedureID,
    IProcedure,
    IProcedureSiteService,
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
        currentSheet,
        setCurrentSheet
    ] = useState<IDiagramSheet | undefined>(undefined);
    const [
        currentProcedure,
        setCurrentProcedure,
    ] = useState<IProcedure | undefined>(undefined);

    useEffect(() => {
        (async () => {
            if (!props.procedureSelected) {
                setCurrentSheet(undefined);
                setCurrentProcedure(undefined);
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

            if (!procedure.isEditable) {
                props.showWarning('procedure is not editable');
                props.closeProcedure(props.procedureSelected);
                return;
            }

            let sheet = props.diagramSheetService.getSheet(
                props.procedureSelected);

            if (!sheet) {
                sheet = await props.diagramSheetService.createSheet(procedure);
            }

            if (!sheet) {
                props.showWarning('procedure can not be loaded');
                props.closeProcedure(props.procedureSelected);
                return;
            }

            props.diagramEngineService.setSheet(sheet);

            setCurrentSheet(sheet);
            setCurrentProcedure(procedure);
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
                currentSheet && currentProcedure
                    ? <Box
                        onDrop={async (event) => {
                            event.persist();

                            const data = JSON.parse(event.dataTransfer.getData('dragProcedure'));
                            const currentSite = await currentProcedure.getSite();
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

                            const node = await currentSheet.createNode(procedure);
                            if (!node) {
                                props.showWarning('procedure load error');
                                return;
                            }
                            // adjust node position
                            node.getImplement().setPosition(
                                props.diagramEngineService.getEngine().getRelativeMousePoint(event));

                            forceUpdate({});
                        }}
                        onDragOver={(event) => {
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

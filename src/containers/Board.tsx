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
    utilService: IUtilService;
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
    clearWarning: Function;
}

export const Board = connect(
    (state: IState) => {
        return {
            diagramSheetService: state.service.diagramSheetService,
            diagramEngineService: state.service.diagramEngineService,
            procedureSiteService: state.service.procedureSiteService,
            utilService: state.service.utilService,

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
        clearWarning: NoticeActions.clearWarning,
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
                width: '100vw',
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
                width: '100vw',
            },
        }),
    );

    const classes = useStyles();
    const [sheet, setSheet] = useState<IDiagramSheet | undefined>(undefined);

    useEffect(() => {
        const updateSheet = async () => {
            if (!props.procedureSelected) {
                return;
            }

            const id = props.utilService.generateRandomString(8);
            const site = await props.procedureSiteService.getSite(
                props.procedureSelected.site);
            if (!site) {
                props.showWarning({ id, message: 'procedure is invalid' });
                props.clearWarning({ id, timeout: 2 });

                props.closeProcedure(props.procedureSelected);
                return;
            }

            const procedure = await site.getProcedure(
                props.procedureSelected.signature);
            if (!procedure) {
                props.showWarning({ id, message: 'procedure is invalid' });
                props.clearWarning({ id, timeout: 2 });

                props.closeProcedure(props.procedureSelected);
                return;
            }

            if (!procedure.isEditable) {
                props.showWarning({ id, message: 'procedure is not editable' });
                props.clearWarning({ id, timeout: 2 });

                props.closeProcedure(props.procedureSelected);
                return;
            }

            let sheet = props.diagramSheetService.getSheet(
                props.procedureSelected);

            if (!sheet) {
                sheet = await props.diagramSheetService.createSheet(procedure);
            }


            if (!sheet) {
                props.showWarning({ id, message: 'procedure can not be loaded' });
                props.clearWarning({ id, timeout: 2 });

                props.closeProcedure(props.procedureSelected);
                return;
            }

            props.diagramEngineService.setSheet(sheet);
            setSheet(sheet);
        }
        updateSheet();
    });

    return (
        <Box
            className={clsx(classes.board, {
                [classes.boardShift]: props.isSidebarShown,
            })}
        >
            <Box className={classes.boardHeader} />
            {
                sheet && props.procedureSelected
                    ? <CanvasWidget
                        className={classes.boardCanvas}
                        engine={props.diagramEngineService.getEngine()}
                    />
                    : <Typography>Loading</Typography>
            }

        </Box>
    );
})

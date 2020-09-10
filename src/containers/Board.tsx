import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,
    Theme,
    Box,
} from '@material-ui/core';
import {
    CanvasWidget,
} from '@projectstorm/react-canvas-core';
import {
    IDiagramSheetService,
    IDiagramEngineService,
} from '../services';
import {
    IState,
    // ServiceActions,
} from '../states';


interface IBoardProps {
    // services
    diagramSheetService: IDiagramSheetService;
    diagramEngineService: IDiagramEngineService;
    // resetEngine: Function,

    // layout
    sidebarWidth: number;
    isSidebarShown: boolean;
    panelHeight: number;
    isPanelShown: boolean;

    // editor
    // procedures: Map<string, string[]>;
    // proceduresOpened: string[];
    procedureSelected: string;
}

export const Board = connect(
    (state: IState) => {
        return {
            diagramSheetService: state.service.diagramSheetService,
            diagramEngineService: state.service.diagramEngineService,

            sidebarWidth: state.layout.sidebarWidth,
            isSidebarShown: state.layout.isSidebarShown,
            panelHeight: state.layout.panelHeight,
            isPanelShown: state.layout.isPanelShown,

            // procedures: state.editor.procedures,
            // proceduresOpened: state.editor.proceduresOpened,
            procedureSelected: state.editor.procedureSelected,
        };
    },
    // {
    //     resetEngine: ServiceActions.resetEngine,
    // }
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
    const sheet = props.diagramSheetService.getSheet(props.procedureSelected);

    if (!sheet) {
        return (
            <Box
                className={clsx(classes.board, {
                    [classes.boardShift]: props.isSidebarShown,
                })}
            >
                <div className={classes.boardHeader} />
                Ready to Load
            </Box>
        );
    } else {
        // set as current sheet
        props.diagramEngineService.setSheet(sheet);

        return (
            <Box
                className={clsx(classes.board, {
                    [classes.boardShift]: props.isSidebarShown,
                })}
            >
                <Box className={classes.boardHeader} />
                <CanvasWidget
                    className={classes.boardCanvas}
                    engine={props.diagramEngineService.getEngine()}
                />
            </Box>
        );
    }
})

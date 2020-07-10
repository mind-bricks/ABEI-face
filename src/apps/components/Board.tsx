import * as React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,

    Theme,
    Box,
} from '@material-ui/core';
import {
    DiagramEngine,
    DiagramModel,
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { IState } from '../states';


interface IBoardProps {
    sidebarWidth: number;
    isSidebarShown: boolean;
    panelHeight: number;
    isPanelShown: boolean;

    engine: DiagramEngine;
    openedProcedures: string[];
    selectedProcedureName: string | undefined;
    selectedProcedureModel: DiagramModel | undefined;
}

export const Board = connect(
    (state: IState) => {
        return {
            sidebarWidth: state.ide.sidebarWidth,
            isSidebarShown: state.ide.isSidebarShown,
            panelHeight: state.ide.panelHeight,
            isPanelShown: state.ide.isPanelShown,

            engine: state.renderer.engine,
            openedProcedures: [...state.renderer.models.keys()],
            selectedProcedureName: state.renderer.modelNameSelected,
            selectedProcedureModel: state.renderer.models.get(
                state.renderer.modelNameSelected
            ),
        };
    },
)(function (props: IBoardProps) {

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

    if (!props.selectedProcedureModel) {
        if (props.selectedProcedureName) {
            // TODO: 
        }
        return (
            <Box
                className={clsx(classes.board, {
                    [classes.boardShift]: props.isSidebarShown,
                })}
            >
                <div className={classes.boardHeader} />
                AHAHAHAHAHA
            </Box>
        );
    }

    props.engine.setModel(props.selectedProcedureModel);

    return (
        <Box
            className={clsx(classes.board, {
                [classes.boardShift]: props.isSidebarShown,
            })}
        >
            <Box className={classes.boardHeader} />
            <CanvasWidget
                className={classes.boardCanvas}
                engine={props.engine}
            />
        </Box>
    );
})

import * as React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,

    Theme,
    Typography,
    Box,
} from '@material-ui/core';

import { DiagramEngine } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { ProcedureFactory } from './Procedure';
import { IState } from '../states';


interface IBoardProps {
    engine: DiagramEngine;
    sidebarWidth: number;
    isSidebarShown: boolean;
    panelHeight: number;
    isPanelShown: boolean;
}

export const Board = connect(
    (state: IState) => {
        return {
            engine: state.diagram.engine,
            sidebarWidth: state.ide.sidebarWidth,
            isSidebarShown: state.ide.isSidebarShown,
            panelHeight: state.ide.panelHeight,
            isPanelShown: state.ide.isPanelShown,
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
            },
            boardShift: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: props.sidebarWidth,
            },
            boardCavas: {
                height: `calc(100vh - ${props.isPanelShown
                    ? props.panelHeight
                    : 0}px)`,
            }
        }),
    );

    const classes = useStyles();

    // register procedure factory
    props.engine.getNodeFactories().registerFactory(
        new ProcedureFactory());

    return (
        <Box
            className={clsx(classes.board, {
                [classes.boardShift]: props.isSidebarShown,
            })}
        >
            <div className={classes.boardHeader} />
            <CanvasWidget
                className={classes.boardCavas}
                engine={props.engine}
            />
        </Box>
    );
})

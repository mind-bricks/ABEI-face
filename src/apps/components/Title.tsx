import * as React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,

    AppBar,
    IconButton,
    Theme,
    Toolbar,
    Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import {
    IDEShowSidebar,
    IState,
} from '../states';

interface ITitleProps {
    name: string;
    sidebarWidth: number;
    isSidebarShown: boolean;

    showSidebar: Function;
}

export const Title = connect(
    (state: IState) => {
        return {
            sidebarWidth: state.ide.sidebarWidth,
            isSidebarShown: state.ide.isSidebarShown,
        };
    },
    { showSidebar: IDEShowSidebar },
)(function (props: ITitleProps) {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            appBar: {
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            },
            appBarShift: {
                width: `calc(100% - ${props.sidebarWidth}px)`,
                marginLeft: props.sidebarWidth,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        }),
    );
    const classes = useStyles();

    return (
        <AppBar
            position="fixed"
            // className={classes.appBar}
            className={clsx(classes.appBar, {
                [classes.appBarShift]: props.isSidebarShown
            })}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => props.showSidebar(!props.isSidebarShown)}
                    edge="start"
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    {props.name}
                </Typography>
            </Toolbar>
        </AppBar>
    );
});

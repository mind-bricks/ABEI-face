import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,
    AppBar,
    IconButton,
    Theme,
    Tab,
    Tabs,
    Toolbar,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import {
    IDiagramSheetService,
} from '../services';
import {
    EditorActions,
    LayoutActions,
    IState,
} from '../states';

interface ITitleProps {
    // service
    diagramSheetService: IDiagramSheetService;

    // layout
    sidebarWidth: number;
    isSidebarShown: boolean;
    showSidebar: Function;

    // editor
    proceduresOpened: string[];
    procedureSelected: string;
    selectProcedure: Function;
}

export const Title = connect(
    (state: IState) => {
        return {
            diagramSheetService: state.service.diagramSheetService,

            sidebarWidth: state.layout.sidebarWidth,
            isSidebarShown: state.layout.isSidebarShown,

            proceduresOpened: state.editor.proceduresOpened,
            procedureSelected: state.editor.procedureSelected,
        };
    },
    {
        showSidebar: LayoutActions.showSidebar,
        selectProcedure: EditorActions.selectProcedure,
    },
)((props: ITitleProps) => {

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
            className={clsx(classes.appBar, {
                [classes.appBarShift]: props.isSidebarShown
            })}
        >
            <Toolbar>
                {
                    !props.isSidebarShown && <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => props.showSidebar(!props.isSidebarShown)}
                        edge="start"
                    >
                        <MenuIcon />
                    </IconButton>
                }
                <Tabs
                    value={props.proceduresOpened.indexOf(props.procedureSelected)}
                    onChange={
                        (_ev: React.ChangeEvent<{}>, newValue: number) => {
                            props.selectProcedure(props.proceduresOpened[newValue]);
                        }
                    }
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                // aria-label="scrollable auto tabs example"
                >
                    {props.proceduresOpened.map((procedureSig: string) => (
                        <Tab label={procedureSig} key={procedureSig} />)
                    )}
                </Tabs>
            </Toolbar>
        </AppBar>
    );
});

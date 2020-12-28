import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,
    // useTheme,

    AppBar,
    // Button,
    IconButton,
    Snackbar,
    Theme,
    Tab,
    Tabs,
    Toolbar,
} from '@material-ui/core';
import {
    Alert,
} from '@material-ui/lab';
import {
    Cancel,
    Menu,
} from '@material-ui/icons';

import {
    IProcedureID,
    IDiagramSheetService,
} from '../services';
import {
    EditorActions,
    LayoutActions,
    NoticeActions,
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
    proceduresOpened: IProcedureID[];
    procedureSelected: IProcedureID | undefined;
    selectProcedure: Function;
    closeProcedure: Function;

    // notice
    warning: string | undefined;
    warningTimeout: number;
    clearWarning: Function;
}

export const Title = connect(
    (state: IState) => {
        return {
            diagramSheetService: state.service.diagramSheetService,
            // procedureSerivce: state.service.procedureService,

            sidebarWidth: state.layout.sidebarWidth,
            isSidebarShown: state.layout.isSidebarShown,

            proceduresOpened: state.editor.proceduresOpened,
            procedureSelected: state.editor.procedureSelected,

            warning: state.notice.warning,
            warningTimeout: state.notice.warningTimeout,
        };
    },
    {
        showSidebar: LayoutActions.showSidebar,
        selectProcedure: EditorActions.selectProcedure,
        closeProcedure: EditorActions.closeProcedure,
        clearWarning: NoticeActions.clearWarning,
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
            // tabWrapper: {
            //     flexDirection: "row-reverse",
            // },
            closeIcon: {
                color: `${theme.palette.warning.main}`,
                // marginRight: theme.spacing(2),
                marginLeft: "auto",
            }
        }),
    );

    const classes = useStyles();
    // const theme = useTheme();

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
                        <Menu color="secondary" />
                    </IconButton>
                }
                <Tabs
                    value={props.proceduresOpened.findIndex((value) => (
                        props.procedureSelected &&
                        props.procedureSelected.site === value.site &&
                        props.procedureSelected.signature === value.signature
                    ))}
                    onChange={(event, newValue) => {
                        const id = props.proceduresOpened[newValue];
                        if (id !== undefined) {
                            props.selectProcedure(id);
                        }
                    }}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                // aria-label="scrollable auto tabs example"
                >
                    {props.proceduresOpened.map((id) => (
                        <Tab
                            // classes={{ wrapper: classes.tabWrapper }}
                            label={id.signature}
                            key={id.signature}
                        />
                    ))}
                </Tabs>
                {/* <Button color="inherit">Login</Button> */}
                <IconButton
                    className={classes.closeIcon}
                    color="inherit"
                    // edge="end"
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        console.log(props.procedureSelected);
                        props.closeProcedure(props.procedureSelected);
                    }}
                >
                    <Cancel />
                </IconButton>
            </Toolbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={props.warningTimeout * 1000}
                open={!!props.warning}
                onClose={() => { props.clearWarning(); }}
            >
                <Alert
                    severity="warning"
                    onClose={() => { props.clearWarning(); }}
                >
                    {props.warning}
                </Alert>
            </Snackbar>
        </AppBar >
    );
});

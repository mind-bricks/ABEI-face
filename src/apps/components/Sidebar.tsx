import * as React from 'react';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,
    useTheme,

    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Theme,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import {
    IDEResizeSidebar,
    IDEShowSidebar,
    IState,
} from '../states';


interface ISidebarProps {
    isShown: boolean;
    width: number;

    resize: Function;
    show: Function;
}

export const Sidebar = connect(
    (state: IState) => {
        return {
            isShown: state.ide.isSidebarShown,
            width: state.ide.sidebarWidth,
        };
    },
    {
        resize: IDEResizeSidebar,
        show: IDEShowSidebar,
    },
)(function (props: ISidebarProps) {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            drawer: {
                width: props.width,
                flexShrink: 0,
            },
            drawerPaper: {
                width: props.width,
                // zIndex: 0,
            },
            drawerHeader: {
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                // necessary for content to be below app bar
                ...theme.mixins.toolbar,
                justifyContent: 'flex-end',
            },
        }),
    );

    const classes = useStyles();
    const theme = useTheme();

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={props.isShown}
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={() => props.show(false)}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
});

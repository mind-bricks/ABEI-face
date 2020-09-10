import React from 'react';
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
import {
    ChevronLeft,
    ChevronRight,
    Inbox,
    Mail,
} from '@material-ui/icons';

import {
    LayoutActions,
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
            isShown: state.layout.isSidebarShown,
            width: state.layout.sidebarWidth,
        };
    },
    {
        resize: LayoutActions.resizeSidebar,
        show: LayoutActions.showSidebar,
    },
)((props: ISidebarProps) => {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            drawer: {
                width: props.width,
                flexShrink: 0,
            },
            drawerPaper: {
                width: props.width,
                // backgroundColor: theme.palette.primary.light,
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
            drawerIcon: {
                color: theme.palette.primary.main,
            }
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
                    {theme.direction === 'ltr' ? <ChevronLeft className={classes.drawerIcon} /> : <ChevronRight className={classes.drawerIcon} />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <Inbox className={classes.drawerIcon} /> : <Mail className={classes.drawerIcon} />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <Inbox className={classes.drawerIcon} /> : <Mail className={classes.drawerIcon} />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
});

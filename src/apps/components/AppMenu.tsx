import * as React from 'react';
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';


export interface IAppMenuProps {
    // width: number;
}

export interface IAppMenuState {
    isOpen: boolean;
}

export class AppMenu extends React.Component<
    IAppMenuProps, IAppMenuState>
{
    // readonly classes = useStyles();
    // readonly theme = useTheme();

    constructor(props: IAppMenuProps) {
        super(props);
        this.state = { isOpen: true };
    }

    closeMenu() {
        this.setState({ isOpen: false });
    }

    render() {
        return <Drawer
            // className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={this.state.isOpen}
        // classes={{
        //     paper: `{ width: ${this.props.width} }`,
        // }}
        >
            <div>
                <IconButton onClick={this.closeMenu.bind(this)}>
                    <ChevronLeftIcon />
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

    }
}

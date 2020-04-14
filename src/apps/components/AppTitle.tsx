import * as React from 'react';
import {
    AppBar,
    // createStyles,
    // makeStyles,
    // Theme,
    Toolbar,
    Typography,
} from '@material-ui/core';


export interface IAppTitleProps {
    name: string;
}

export class AppTitle extends React.Component<IAppTitleProps>
{
    // styleClasses: any;

    constructor(props: IAppTitleProps) {
        super(props);
    }

    render() {
        // this.styleClasses = makeStyles((theme: Theme) =>
        //     createStyles({
        //         appBar: {
        //             zIndex: theme.zIndex.drawer + 1,
        //         },
        //     }),
        // )();
        return <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" noWrap>
                    {this.props.name}
                </Typography>
            </Toolbar>
        </AppBar>;
    }
}

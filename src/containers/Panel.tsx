import React from 'react';
import { connect } from 'react-redux';
import { Drawer, createStyles, makeStyles, Theme, useTheme } from '@material-ui/core';
import Terminal from 'terminal-in-react';
import { IState } from '../states';

interface IPanelProps {
    isPanelShown: boolean;
    panelHeight: number;
}

export const Panel = connect(
    (state: IState) => {
        return {
            isPanelShown: state.layout.isPanelShown,
            panelHeight: state.layout.panelHeight,
        };
    },
    {
    },
)((props: IPanelProps) => {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            panel: {
                marginLeft: 0,
                height: props.panelHeight,
            },
            panelPaper: {
                overflow: "hidden",
                height: props.panelHeight,
            }
        }))

    const classes = useStyles();

    const theme = useTheme();

    return (
        <Drawer
            variant="persistent"
            anchor="bottom"
            open={true}
            className={classes.panel}
            classes={{ paper: classes.panelPaper }}>
            <Terminal watchConsoleLogging
                color={theme.palette.text.primary}
                barColor="red"
                backgroundColor={theme.palette.primary.light}
                startState="maximised"
                hideTopBar
            />
        </Drawer>
    )
}
)
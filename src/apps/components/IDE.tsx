import * as React from 'react';
import {
    createMuiTheme,
    colors,
    Container,
    CssBaseline,
    ThemeProvider,
} from '@material-ui/core';
import { Title } from './Title';
import { Sidebar } from './Sidebar';
import { Board } from './Board';

export function IDE() {
    const theme = createMuiTheme({
        palette: {
            primary: {
                main: '#75409A',
                light: '#c5b4ef',
                // light: '#a079bc',
            },
            secondary: {
                main: '#11cb5f',
                light: '#75dba0',
            },
            text: {
                primary: '#e6ddec',
                secondary: '#dfccec',
                disabled: '#a093a8',
                hint: '#75dba0',
            },
            error: {
                main: colors.red.A400,
            },
            background: {
                default: '#d3d3d3',
                paper: '#c5b4ef',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Sidebar />
                <Title />
                <Board />
            </Container>
        </ThemeProvider>
    );
};

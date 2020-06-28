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
                main: '#556cd6',
            },
            secondary: {
                main: '#19857b',
            },
            error: {
                main: colors.red.A400,
            },
            background: {
                default: '#fff',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Sidebar />
                <Title name="ABEI" />
                <Board />
            </Container>
        </ThemeProvider>
    );
};

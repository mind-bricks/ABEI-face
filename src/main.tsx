import 'typeface-roboto';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    createMuiTheme,
    colors,
    CssBaseline,
    ThemeProvider,
} from '@material-ui/core';

import './theme/main.less';
import { AppIDE } from './apps/components/AppIDE'


document.addEventListener('DOMContentLoaded', () => {
    // Create a theme instance.
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

    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <AppIDE />
        </ThemeProvider>,
        document.querySelector('#application')
    );
});

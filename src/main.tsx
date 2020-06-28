import 'typeface-roboto';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './theme/main.less';
import { IDE } from './apps/components/IDE';
import { store } from './apps/states';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Provider store={store}>
            <IDE />
        </Provider>,
        document.querySelector('#application')
    );
});

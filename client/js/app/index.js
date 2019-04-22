import React from 'react';
import {Provider} from 'react-redux';
import {Route} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';

import route from './route';
import history from './history';
import store from './store';

import {reAuthorize} from 'src/auth/actions';

// Setup user token if exist at the page load
if (localStorage.getItem('jwtToken')) {
    store.dispatch(reAuthorize(localStorage.getItem('jwtToken')));
}

const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Route component={route} />
        </ConnectedRouter>
    </Provider>
);

// Hot reloading support for development mode
const hot = (__DEV__) ? require('react-hot-loader').hot : undefined;
const exportedApp = (__DEV__) ? hot(module)(App) : App;
export default exportedApp;

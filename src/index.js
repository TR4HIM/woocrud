import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore , applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import thunk  from 'redux-thunk';
import { ConnectedRouter  , routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';


// Import files
import rootReducer from './rootReducer';
import Layout from './layout/Layout';

import * as serviceWorker from './serviceWorker';

import './styles.css';
import { USE_REDUX_CONSOLE } from "./config";


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


const theme = createMuiTheme({
    direction: 'rtl',
    typography: {
        useNextVariants: true,
    }
});


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const history       = createBrowserHistory();
const middleware    = routerMiddleware(history);

const COMPOSE       = USE_REDUX_CONSOLE ? composeEnhancers(applyMiddleware(middleware, thunk) ) : compose(applyMiddleware(middleware, thunk) );

const store         = createStore(rootReducer, COMPOSE);


ReactDOM.render((
    <MuiThemeProvider theme={theme}>
        <Provider store={store} >
            <ConnectedRouter  history={history}>
                {/* <TranslateProvider> */}
                <Layout />
                {/* </TranslateProvider> */}
            </ConnectedRouter >
        </Provider>
    </MuiThemeProvider>

), document.getElementById('root'));


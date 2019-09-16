import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ConnectedRouter  } from 'connected-react-router';
import Layout from './pages/';
import configureStore, { history } from './store/';
import * as serviceWorker from './serviceWorker';
import './styles.css';

const store = configureStore();

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


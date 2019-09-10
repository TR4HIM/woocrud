import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import {AUTHORIZED , USER} from './pages/login/reducers';

import {
    WOO_PRODUCTS,
    EDITING_WOO_PRODUCT
} from './pages/products/reducers';

import {
    LOADER
} from './layout/reducers';

import { createBrowserHistory } from 'history';


const history       = createBrowserHistory();

const appReducer = combineReducers({
    AUTHORIZED,
    USER,
    WOO_PRODUCTS,
    LOADER,
    EDITING_WOO_PRODUCT,
    router : connectRouter(history)
});

const rootReducer = ( state, action ) => {
    if ( action.type === 'LOGOUT' )
        state = undefined;

    return appReducer(state, action)
}

export default rootReducer;
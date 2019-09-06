import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import {AUTHORIZED} from './pages/login/reducers';

import {
    LOADER
} from './layout/reducers';

const appReducer = combineReducers({
    AUTHORIZED,
    LOADER
});

const rootReducer = ( state, action ) => {
    if ( action.type === 'LOGOUT' )
        state = undefined;

    return appReducer(state, action)
}

export default rootReducer;
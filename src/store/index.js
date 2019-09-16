import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducers/";

const rootReducer = ( state, action ) => {
    if ( action.type === 'LOGOUT' )
        state = undefined;

    return appReducer(state, action)
}

const COMPOSE       = compose(applyMiddleware(thunk) );

const store         = createStore(rootReducer, COMPOSE);

export default store;
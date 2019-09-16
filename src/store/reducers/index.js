import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'
import * as REDUCERS from "./reducers";

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    ...REDUCERS
})

export default createRootReducer

import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history';
import * as REDUCERS from "./reducers";

const history       = createBrowserHistory();

export default combineReducers({ router: connectRouter(history) , ...REDUCERS });
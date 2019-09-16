import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createRootReducer  from "./reducers/";
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router'

export const history = createBrowserHistory();

export default  (preloadedState) =>  {
    const store = createStore(
      createRootReducer(history), // root reducer with router state
      preloadedState,
      compose(applyMiddleware(routerMiddleware(history),thunk)),
    )
    return store
}
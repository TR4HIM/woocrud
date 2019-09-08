import {
    _STORE_WOO_PRODUCTS_,
    _CLEAR_STORE_WOO_PRODUCTS_
} from './actions';


export const WOO_PRODUCTS = (state = [], action)=>{

    if(action.type === _STORE_WOO_PRODUCTS_)
        return action.payload;

    else if(action.type === _CLEAR_STORE_WOO_PRODUCTS_){
        return [];
    }

    return state;
}
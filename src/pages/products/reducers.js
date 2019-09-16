import {
    _STORE_WOO_PRODUCTS_,
    _CLEAR_STORE_WOO_PRODUCTS_,
    _EDIT_WOO_PRODUCT_
} from './actions';


export const WOO_PRODUCTS = (state = [], action)=>{

    if(action.type === _STORE_WOO_PRODUCTS_)
        return action.payload;

    else if(action.type === _CLEAR_STORE_WOO_PRODUCTS_){
        return [];
    }

    return state;
}


export const EDITING_WOO_PRODUCT = (state = { status : false , currentProduct : null }, action)=>{

    if(action.type === _EDIT_WOO_PRODUCT_){
        if(action.payload.status === null) {
            return {
                status          : state.status, 
                currentProduct  : action.payload.currentProduct
            }
        }
        else
            return action.payload;
    }
        

    return state;
}
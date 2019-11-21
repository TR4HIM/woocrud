import TYPES from "../actions/types";

export const LOADER = (state = [] , action)=>{

    if( action.type === TYPES.LOADING){
        let alreadyExist = state.find((item)=>item.id === action.payload.id);

        if(alreadyExist)
            return [
                ...state.filter((item)=> item.id !== action.payload.id),
                action.payload
            ]
        else
            return [
                ...state,
                action.payload
            ]
        
    }

    return state;
}

export const AUTHORIZED = (state = false, action)=>{

    if(action.type === TYPES.LOGIN)
        return action.payload;
    
    
    return state;
}

export const USER_PROFILE = (state = null, action)=>{

    if( action.type === TYPES.STORE_PROFILE)
        return action.payload;
        
    return state;
}

export const USER = (state = {}, action)=>{

    if( (action.type === TYPES.LOGIN) && action.payload )
        return JSON.parse(localStorage.getItem('woo-app'));
    return state;
}

export const WOO_PRODUCTS = (state = [], action)=>{

    if(action.type === TYPES.STORE_WOO_PRODUCTS)
        return action.payload;

    else if(action.type === TYPES.CLEAR_STORE_WOO_PRODUCTS){
        return [];
    }

    else if( action.type === TYPES.UPDATE_WOO_PRODUCT )
        return state.map((product)=> (product.id === action.payload.id) ? { ...product, ...action.payload } :  product );
    else if(action.type === TYPES.DELETE_WOO_PRODUCT)
        return state.filter((product)=>product.id !== action.payload)

    return state;
}

export const WOO_CATEGORIES = (state = [], action)=>{
    if(action.type === TYPES.STORE_WOO_CATEGORIES)
        return action.payload;
    return state;
}

export const WOO_TAGS = (state = [], action)=>{
    if(action.type === TYPES.STORE_WOO_TAGS)
        return action.payload;
    return state;
}

export const EDITING_WOO_PRODUCT = (state = { status : false , currentProduct : null }, action)=>{

    if(action.type === TYPES.EDIT_WOO_PRODUCT){
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
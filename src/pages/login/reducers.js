import {
    _LOGIN_,
    _STORE_PROFILE_
} from './actions';


export const AUTHORIZED = (state = false, action)=>{

    if(action.type === _LOGIN_)
        return action.payload;
    
    
    return state;
}


export const USER_PROFILE = (state = null, action)=>{

    if( action.type === _STORE_PROFILE_ )
        return action.payload;
        
    return state;
}

export const USER = (state = {}, action)=>{

    if( (action.type === _LOGIN_) && action.payload )
        return JSON.parse(localStorage.getItem('woo-app'));
    return state;
}
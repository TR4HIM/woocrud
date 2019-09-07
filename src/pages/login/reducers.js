import {
    _LOGIN_
} from './actions';


export const AUTHORIZED = (state = false, action)=>{

    if(action.type === _LOGIN_)
        return action.payload;
    
    
    return state;
}

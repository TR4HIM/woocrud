import {
    _LOADING_
} from './actions';


export const LOADER = (state = [] , action)=>{

    if( action.type === _LOADING_ ){
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

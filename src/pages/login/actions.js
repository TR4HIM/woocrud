export const _LOGIN_         = "LOGIN";
export const _STORE_PROFILE_ = "STORE_PROFILE";


export const login = (connected)=>{
    return {
        type    : _LOGIN_,
        payload : connected
    }
}




export const storeUserData = (payload)=>{
    return {
        type : _STORE_PROFILE_,
        payload
    }
}
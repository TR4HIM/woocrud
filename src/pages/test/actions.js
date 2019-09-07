export const _LOGIN_        = "LOGIN";


export const login = (connected)=>{
    return {
        type    : _LOGIN_,
        payload : connected
    }
}


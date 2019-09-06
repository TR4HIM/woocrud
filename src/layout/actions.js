export const _LOADING_                    = "LOADING";

export const loading = ( status, id )=>{

    return {
        type        : _LOADING_,
        payload     : {
            id : id || undefined,
            status
        }
    }

}


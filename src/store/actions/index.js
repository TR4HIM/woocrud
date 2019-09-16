import TYPES from "./types";

export const loading = ( status, id )=>{
    return {
        type        : TYPES.LOADING,
        payload     : {
            id : id || undefined,
            status
        }
    }
}

export const login = (connected)=>{
    return {
        type    : TYPES.LOGIN,
        payload : connected
    }
}

export const storeUserData = (payload)=>{
    return {
        type : TYPES.STORE_PROFILE,
        payload
    }
}

export const storeWooProducts = (products)=>{
    return {
        type    : TYPES.STORE_WOO_PRODUCTS,
        payload : products
    }
}

export const clearStoreWooProducts = ()=>{
    return {
        type    : TYPES.CLEAR_STORE_WOO_PRODUCTS,
    }
}

export const storeCheckedProducts = (product)=>{
    return {
        type    : TYPES.STORE_CHECKED_PRODUCTS,
        payload : product
    }
}

export const editWooProduct = (bool, currentProduct)=>{
    return {
        type    : TYPES.EDIT_WOO_PRODUCT,
        payload : {
            status          : bool,
            currentProduct  : currentProduct
        }
    }
}

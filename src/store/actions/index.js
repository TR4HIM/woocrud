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

export const storeWooCategories = (categories)=>{
    return {
        type    : TYPES.STORE_WOO_CATEGORIES,
        payload : categories
    }
}

export const storeWooTags = (tags)=>{
    return {
        type    : TYPES.STORE_WOO_TAGS,
        payload : tags
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

export const storeUserProfile = (payload)=>{
    return {
        type : TYPES.STORE_PROFILE,
        payload
    }
}

export const updateUser = (payload)=>{
    return {
        type    : TYPES.UPDATE_USER,
        payload
    }
}

export const updateWooProudct = (payload)=>{
    return {
        type    : TYPES.UPDATE_WOO_PRODUCT,
        payload 
    }
}

export const deleteWooProudct = (productId)=>{
    return {
        type    : TYPES.DELETE_WOO_PRODUCT,
        payload : productId
    }
}
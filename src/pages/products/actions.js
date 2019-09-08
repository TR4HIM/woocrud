export const _STORE_WOO_PRODUCTS_           = 'STORE_WOO_PRODUCTS';
export const _CLEAR_STORE_WOO_PRODUCTS_     = 'CLEAR_STORE_WOO_PRODUCTS';


export const storeWooProducts = (products)=>{
    return {
        type    : _STORE_WOO_PRODUCTS_,
        payload : products
    }
}


export const clearStoreWooProducts = ()=>{
    return {
        type    : _CLEAR_STORE_WOO_PRODUCTS_
    }
}
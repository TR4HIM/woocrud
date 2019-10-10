import axios from 'axios';

export const protocol  = (process.env.NODE_ENV === 'production') ? 'https://' : 'http://';
export const endPoint  = (process.env.NODE_ENV === 'production') ? 'kibo.ma' : 'woocrud.test';


// Wordpress API
export const WP         = `${protocol + endPoint}/wp-json/wp/v2`;
// WooCommerce API
export const WC         = `${protocol + endPoint}/wp-json/wc/v3`;

export const AUTH       = `${protocol + endPoint}/wp-json/jwt-auth/v1`;
export const WC_VENDOR  = `${protocol + endPoint}/wp-json/wc-vendor/v1`;


const LOGIN = (formData)=>{

    return axios.post( `${AUTH}/token`, formData)
            .then((tokenResult)=>{
                return tokenResult.data
            });

}

const TOKEN_VALIDATE = (token)=>{

    return axios.post( `${AUTH}/token/validate`, null, {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        return result.data;
    })

}

const WC_getWooProducts = ()=>{

    var call;

    return (token, categoryId, pager, limit)=>{

        if (call)
            call.cancel();
        
        call = axios.CancelToken.source();
        return axios.get( `${WC}/products`, {
            headers : {
                "Authorization" : `Bearer ${token}`
            },
            cancelToken: call.token
        })
        .then((result)=>{
            return result.data;
        })
        .catch((error)=>{
            if ( !axios.isCancel(error)) 
                return error;
        })
    }
    

}

const WC_getWooSearchProducts = ()=>{

    var call;

    return (token, query)=>{

        if (call)
            call.cancel();
        
        call = axios.CancelToken.source();
        return axios.get( `${WC}/products?search=${query}`, {
            headers : {
                "Authorization" : `Bearer ${token}`
            },
            cancelToken: call.token
        })
        .then((result)=>{
            return result.data;
        })
        .catch((error)=>{
            if ( !axios.isCancel(error)) 
                return error;
        })
    }
    

}

const WC_getWooCategories = ()=>{

    var call;

    return (token)=>{

        if (call)
            call.cancel();
        
        call = axios.CancelToken.source();
        return axios.get( `${WC}/products/categories`, {
            headers : {
                "Authorization" : `Bearer ${token}`
            },
            cancelToken: call.token
        })
        .then((result)=>{
            return result.data;
        })
        .catch((error)=>{
            if ( !axios.isCancel(error)) 
                return error;
        })
    }
    

}
const WC_getWooTags = ()=>{

    var call;

    return (token)=>{

        if (call)
            call.cancel();
        
        call = axios.CancelToken.source();
        return axios.get( `${WC}/products/tags`, {
            headers : {
                "Authorization" : `Bearer ${token}`
            },
            cancelToken: call.token
        })
        .then((result)=>{
            return result.data;
        })
        .catch((error)=>{
            if ( !axios.isCancel(error)) 
                return error;
        })
    }
    

}

export default {
    LOGIN,
    TOKEN_VALIDATE,
    WC_getWooProducts,
    WC_getWooSearchProducts,
    WC_getWooCategories,
    WC_getWooTags
}
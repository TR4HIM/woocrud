import axios from 'axios';

const APP_API_URL = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_LIVE_STORE_URL : process.env.REACT_APP_LOCAL_STORE_URL;

// Wordpress API
export const WP         = `${APP_API_URL}/wp-json/wp/v2`;
// WooCommerce API
export const WC         = `${APP_API_URL}/wp-json/wc/v3`;
// JWT API
export const AUTH       = `${APP_API_URL}/wp-json/jwt-auth/v1`;

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

const WC_getWooProducts = (token,perpage,pager)=>{
    return axios.get( `${WC}/products?per_page=${perpage}&page=${pager}`, {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        
        return result;
    })
    .catch((error)=>{
        if ( !axios.isCancel(error)) 
            return error;
    })
}

const WC_getWooProductById = (token, productId)=>{
    return axios.get( `${WC}/products/${productId}`, {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        return result.data;
    })
    .catch((error)=>{
        if ( !axios.isCancel(error)) 
            return error;
    })
}

const WC_getWooProductByName = ()=>{
    var call;
    return (token, productName)=>{

        if (call)
            call.cancel();
        
        call = axios.CancelToken.source();
        return axios.get( `${WC}/products?search=${productName}`, {
            headers : {
                "Authorization" : `Bearer ${token}`,
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

const WC_getWooCategories = (token)=>{
    return axios.get( `${WC}/products/categories?per_page=100`, {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        return result.data;
    })
    .catch((error)=>{
        if ( !axios.isCancel(error)) 
            return error;
    })
}

const WC_getWooTags = (token)=>{
    return axios.get( `${WC}/products/tags?per_page=100`, {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        return result.data;
    })
    .catch((error)=>{
        if ( !axios.isCancel(error)) 
            return error;
    })
}

const WC_createWooTags = (token,data)=>{
    let newTag = data;
    return axios.post( `${WC}/products/tags`, newTag , {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        return result.data;
    })
    .catch((error)=>{
        if ( !axios.isCancel(error)) 
            return error;
    })
}

const WC_createWooCategories = (token,data)=>{
    let newTag = data;
    return axios.post( `${WC}/products/categories`, newTag , {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        return result.data;
    })
    .catch((error)=>{
        if ( !axios.isCancel(error)) 
            return error;
    })
}

const WP_getProfileInfo = (token)=>{
    return axios.get( `${WP}/users/me?context=edit`, {
        headers : {
            "Authorization" : `Bearer ${token}`,
        }
    })
    .then((result)=>{
        return result.data
    });
}

const WP_updateProfileInfo = (token, data)=>{

    return axios.post( `${WP}/users/${data.id}`, data , {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        return result.data
    });

}

const WP_change_password = (token, payload)=>{

    return axios.put( `${WP}/current-user/${payload.id}/change_password`, payload , {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((result)=>{
        return result.data
    });
}


const WC_updateProduct = (token, id, property)=>{
    let data = {
        ...property
    }

    return axios.put( `${WC}/products/${id}`, data, {
        headers : {
            "Authorization" : `Bearer ${token}`,
        }
    })
    .then((result)=>{
        return result.data
    });

}

const WC_deleteProduct = (token, id)=> {
    return axios.delete( `${WC}/products/${id}?force=true`, {
        headers : {
            "Authorization" : `Bearer ${token}`,
        }
    })
    .then((result)=>{
        return result.data
    });

}

const WC_createProduct = (token, property)=>{
    let data = {
        ...property
    }
    return axios.post( `${WC}/products`, data, {
        headers : {
            "Authorization" : `Bearer ${token}`,
        }
    })
    .then((result)=>{
        return result.data
    });
}

const WP_uploadImage = (token, data)=>{
    return axios.post( `${WP}/media`, data, {
        headers : {
            "Authorization" : `Bearer ${token}`,
        }
    })
    .then((result)=>{
        return result.data
    });
}

const WP_deleteImage = (token, id)=>{
    return axios.delete( `${WP}/media/${id}?force=true`,  {
        headers : {
            "Authorization" : `Bearer ${token}`,
        }
    })
    .then((result)=>{
        return result.data
    });
}

export default {
    LOGIN,
    TOKEN_VALIDATE,
    WC_getWooProducts,
    WC_getWooSearchProducts,
    WC_getWooCategories,
    WC_getWooTags,
    WC_getWooProductById,
    WP_getProfileInfo,
    WP_updateProfileInfo,
    WP_change_password,
    WC_updateProduct,
    WC_getWooProductByName,
    WP_uploadImage,
    WC_createProduct,
    WC_deleteProduct,
    WC_createWooTags,
    WC_createWooCategories,
    WP_deleteImage
}
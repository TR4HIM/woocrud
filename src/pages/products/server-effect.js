import axios from 'axios';
import { WC } from '../../API';


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

export default {
    WC_getWooProducts
}
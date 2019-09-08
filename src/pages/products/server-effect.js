import axios from 'axios';
import { WC } from '../../API';


const WC_getWooProducts = ()=>{

    var call;

    return (token, categoryId, pager, limit)=>{

        if (call)
            call.cancel();
        
        call = axios.CancelToken.source();

        // consumer_key=ck_f1b1cd3ff0ba2181d5857aa43db4fb2cd2635cf4
        // consumer_secret=cs_a24ab0a6247fb3ed27956fab7014f1e9dc14aa14
        return axios.get( `${WC}/products`, {
            headers : {
                "Authorization" : `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*'
            },
            cancelToken: call.token
        })
        .then((result)=>{
            console.log("dsfsdf");
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
import axios from 'axios';
import { AUTH } from '../../API';


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

export default {
    LOGIN,
    TOKEN_VALIDATE
}
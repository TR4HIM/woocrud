import React , {useState , useRef , useEffect } from 'react';
import {connect} from 'react-redux';
import {    
        Container, 
        Grid , 
        Paper , 
        TextField , 
        FormControlLabel , 
        Switch , Typography , Checkbox ,
        Divider , Chip , Button ,
        ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductsAutoComplete from '../../components/input-autocomplete/InputAutocomplete';
import ButtonUploadImage from '../../components/button-upload/ButtonUpload';
import EditableImage from '../../components/editable-image/EditableImage';
import ProductForm from '../../components/product-form/ProductForm';
import API from '../../API/'; 
import {
    Link,
    useParams
} from "react-router-dom";

import {loading , storeWooProducts , clearStoreWooProducts, storeWooCategories , storeWooTags} from '../../store/actions/';

  
const EditProductPage = ({dispatch , USER , match}) =>  {
    const { params } = match;
    const [product,setProduct] = useState(null);
    
    useEffect(()=>{
        API.WC_getWooProductById(USER.token, params.productId)
        .then((result)=>{
            if( result !== undefined ){
                // HIDE LOADER
                setProduct(result);
                dispatch(loading(false, "header-loader"));
            }
        })
        .catch((error)=>{
            dispatch({
                type : 'ERROR',
                payload : error
            })
            // HIDE LOADING
            dispatch(loading(false, "header-loader"));
        })

    },[]);

    /* FOR DEV ONLY THIS SHOULD BE SHARED */
    useEffect(() => {
        // SHOW LOADER
        API.WC_getWooCategories(USER.token)
            .then((result)=>{
                if( result !== undefined ){
                    const productCategories = result.map(category => ({
                        ...category,
                        selected: false
                    }));
                    dispatch(storeWooCategories(productCategories));
                }
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
            })
    }, []);

    useEffect(() => {
        // SHOW LOADER
        API.WC_getWooTags(USER.token)
            .then((result)=>{
                if( result !== undefined ){
                    // const productTags = result.map(tag => ({
                    //     ...tag,
                    //     selected: false
                    // }));
                    dispatch(storeWooTags(result));
                }
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
            })
    }, []);


    return (
        <div id="add-product-page">
            <Header />
                { (product !== null ) ? <ProductForm toEdit={true} productData={ product }/> : false }
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER  }) => ({ USER });

export default   connect(mapStateToProps)(EditProductPage) ;
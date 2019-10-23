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
import {loading , storeWooProducts , clearStoreWooProducts, storeWooCategories , storeWooTags} from '../../store/actions/';


const AddProduct = ({dispatch , USER , WOO_CATEGORIES}) =>  {

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
            <ProductForm />
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER , WOO_CATEGORIES  }) => ({ USER , WOO_CATEGORIES });

export default   connect(mapStateToProps)(AddProduct) ;
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

import {loading } from '../../store/actions/';

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductsAutoComplete from '../../components/input-autocomplete/InputAutocomplete';
import ButtonUploadImage from '../../components/button-upload/ButtonUpload';
import EditableImage from '../../components/editable-image/EditableImage';
import ProductForm from '../../components/product-form/ProductForm';


const EditProductPage = ({dispatch , USER}) =>  {


    return (
        <div id="add-product-page">
            <Header />
            <ProductForm formType="edit"/>
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER  }) => ({ USER });

export default   connect(mapStateToProps)(EditProductPage) ;
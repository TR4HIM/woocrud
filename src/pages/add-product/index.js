import React , {useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductForm from '../../components/product-form/ProductForm';
import API from '../../API/'; 
import {loading} from '../../store/actions/';
import { Redirect } from 'react-router';


const AddProduct = ({dispatch , USER }) =>  {

    const [isNewProductSaved, setIsNewProductSaved]                         = useState(false);
    const [productID,setProductID]                                          = useState(false);

    const saveNewProduct = (payload) => {
        API.WC_createProduct(USER.token,  payload).then((data)=>{ 
            dispatch(loading(false, "header-loader"));
            setIsNewProductSaved(true);
            setProductID(data.id);
        })
        .catch((error)=>{
            dispatch({
                type : "ERROR",
                payload : error
            });
            // HIDE LOADING
            dispatch(loading(false, "header-loader"));
        })
    }

    return (
        <div id="add-product-page">
            <Header />
            { isNewProductSaved && productID !== false && <Redirect to={`/edit-produit/${productID}`} /> }
            { <ProductForm saveProductAction={(productData) => saveNewProduct(productData)} /> }
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER  }) => ({ USER });

export default   connect(mapStateToProps)(AddProduct) ;
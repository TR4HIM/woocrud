import React , {useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductForm from '../../components/product-form/ProductForm';
import API from '../../API/'; 
import {loading , storeWooCategories , storeWooTags} from '../../store/actions/';
  
const EditProductPage = ({dispatch , USER , WOO_CATEGORIES , match}) =>  {
    
    const { params }            = match;
    const [ product,setProduct] = useState(null);

    dispatch(loading(true, "header-loader"));

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

    const saveEditedProduct = (payload) => {
        API.WC_updateProduct(USER.token,  payload.productId , payload.payload ).then((data)=>{ 
            dispatch(loading(false, "header-loader"));
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
                { (product !== null) ? <ProductForm toEdit={true} productData={ product } saveProductAction={(productData) => saveEditedProduct(productData)}/> : false }
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER }) => ({ USER });

export default connect(mapStateToProps)(EditProductPage) ;
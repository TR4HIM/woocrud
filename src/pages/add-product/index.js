import React , {useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductForm from '../../components/product-form/ProductForm';
import API from '../../API/'; 
import {loading , storeWooProducts} from '../../store/actions/';
import { Redirect } from 'react-router';
import { store as notifStore} from 'react-notifications-component';
import {APP_PATHS} from '../../config';

const DEFAULT_PER_PAGE          = 18;

const AddProduct = ({dispatch , USER , WOO_PRODUCTS }) =>  {

    const [isNewProductSaved, setIsNewProductSaved]                         = useState(false);
    const [productID,setProductID]                                          = useState(false);

    useEffect(() => {
        if(!('products' in WOO_PRODUCTS)){ 
            dispatch(loading(true, "header-loader"));
            getWooProducts();
        }
    }, []); 

    const getWooProducts = () => {
        dispatch(loading(true, "header-loader"));
        API.WC_getWooProducts( USER.token , DEFAULT_PER_PAGE , 1 )
        .then((result)=>{
            if( result !== undefined ){
                dispatch(storeWooProducts({ products : result.data , productsCount : result.headers['x-wp-total'] , selectedPage : 1 }));
                // HIDE LOADER
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
    }

    const saveNewProduct = (payload) => {
        API.WC_createProduct(USER.token,  payload).then((data)=>{ 
            dispatch(loading(false, "header-loader"));
            setIsNewProductSaved(true);
            setProductID(data.id);
            let storeProducts = [...WOO_PRODUCTS.products]
            // remove one product to fix the grid :)
            storeProducts.pop();
            dispatch(storeWooProducts({ products : [data , ...storeProducts]  , productsCount : parseInt(WOO_PRODUCTS.productsCount) + 1 , selectedPage : WOO_PRODUCTS.selectedPage  }));
            notifStore.addNotification({
                title: "Success",
                message:  "Product has been added" ,
                type: "success",
                container: "top-right",
                width: 400,
                dismiss: {
                  duration: 2000,
                  onScreen: true
                }
            });
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
            { isNewProductSaved && productID !== false && <Redirect to={ APP_PATHS.EDIT_PRODUCT.replace(':productId', productID ) } /> }
            { <ProductForm saveProductAction={(productData) => saveNewProduct(productData)} /> }
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER , WOO_PRODUCTS  }) => ({ USER , WOO_PRODUCTS });

export default   connect(mapStateToProps)(AddProduct) ;
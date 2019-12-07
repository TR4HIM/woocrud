import React , {useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductForm from '../../components/product-form/ProductForm';
import API from '../../API/'; 
import {loading , updateWooProudct , storeWooProducts } from '../../store/actions/';
import { store as notifStore} from 'react-notifications-component';

const DEFAULT_PER_PAGE          = 18;

const EditProductPage = ({dispatch , USER , WOO_PRODUCTS , match}) =>  {
    
    const { params }            = match;
    const [ product,setProduct] = useState(null);

    
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

    const saveEditedProduct = (payloadData) => {
        let id      = payloadData.productId;
        let payload = {...payloadData.payload};
        console.log({id , ...payload});
        API.WC_updateProduct(USER.token, id , payload ).then((data)=>{ 
            dispatch(loading(false, "header-loader"));

            dispatch(updateWooProudct({id , ...payload}));
            notifStore.addNotification({
                title: "Success",
                message: ` Product ${payload.name}  has been updated ` ,
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
                { (product !== null) ? <ProductForm toEdit={true} productData={ product } saveProductAction={(productData) => saveEditedProduct(productData)}/> : false }
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER , WOO_PRODUCTS }) => ({ USER , WOO_PRODUCTS });

export default connect(mapStateToProps)(EditProductPage) ;
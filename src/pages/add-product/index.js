import React , {useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductForm from '../../components/product-form/ProductForm';
import API from '../../API/'; 
import {loading , storeWooCategories , storeWooTags} from '../../store/actions/';


const AddProduct = ({dispatch , USER }) =>  {

    const [isCategoriesLoaded,setIsCategoriesLoaded] = useState(false);
    const [isTagsLoaded,setIsTagsLoaded] = useState(false);

    dispatch(loading(true, "header-loader"));

    /* FOR DEV ONLY THIS SHOULD BE SHARED */
    useEffect(() => {
        dispatch(loading(true, "header-loader"));

        // SHOW LOADER
        API.WC_getWooCategories(USER.token)
            .then((result)=>{
                if( result !== undefined ){
                    const productCategories = result.map(category => ({
                        ...category,
                        selected: false
                    }));
                    dispatch(storeWooCategories(productCategories));
                    setIsCategoriesLoaded(true);
                }
                dispatch(loading(false, "header-loader"));
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
                dispatch(loading(false, "header-loader"));
            })
    }, []);

    useEffect(() => {
        dispatch(loading(true, "header-loader"));

        // SHOW LOADER
        API.WC_getWooTags(USER.token)
            .then((result)=>{
                if( result !== undefined ){
                    dispatch(storeWooTags(result));
                    setIsTagsLoaded(true);
                }
                dispatch(loading(false, "header-loader"));

            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
                dispatch(loading(false, "header-loader"));
            })
    }, []);

    return (
        <div id="add-product-page">
            <Header />
            { isCategoriesLoaded && isTagsLoaded && <ProductForm saveProductAction={(productData)=>console.log(productData)} /> }
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER , WOO_CATEGORIES  }) => ({ USER , WOO_CATEGORIES });

export default   connect(mapStateToProps)(AddProduct) ;
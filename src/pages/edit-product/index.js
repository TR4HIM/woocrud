import React , {useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ProductForm from '../../components/product-form/ProductForm';
import API from '../../API/'; 
import {loading , storeWooCategories , storeWooTags} from '../../store/actions/';
  
const EditProductPage = ({dispatch , USER , WOO_CATEGORIES , match}) =>  {
    
    const { params } = match;
    const [ product,setProduct] = useState(null);
    const [ isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
    const [isTagsLoaded,setIsTagsLoaded] = useState(false);
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
                    setIsCategoriesLoaded(true)
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

    const saveEditedProduct = (payload) => {
        console.log(payload);
        
        API.WC_updateProduct(USER.token,  payload.productId , payload.payload ).then((data)=>{ 
            console.log("Done");
            console.log(data);
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
                { (product !== null && isCategoriesLoaded  && isTagsLoaded) ? <ProductForm toEdit={true} productData={ product } saveProductAction={(productData) => saveEditedProduct(productData)}/> : false }
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER , WOO_CATEGORIES  }) => ({ USER , WOO_CATEGORIES});

export default connect(mapStateToProps)(EditProductPage) ;
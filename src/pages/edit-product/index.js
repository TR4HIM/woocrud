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
    // useEffect(()=>{
    //     console.log(WOO_CATEGORIES);
    //     // if(isCategoriesLoaded)

    // },[isCategoriesLoaded])
    // useEffect(() => {
    //     // SHOW LOADER
    //     API.WC_getWooTags(USER.token)
    //         .then((result)=>{
    //             if( result !== undefined ){
    //                 dispatch(storeWooTags(result));
    //             }
    //         })
    //         .catch((error)=>{
    //             dispatch({
    //                 type : 'ERROR',
    //                 payload : error 
    //             })
    //         })
    // }, []);

    return (
        <div id="add-product-page">
            <Header />
                { (product !== null && isCategoriesLoaded) ? <ProductForm toEdit={true} productData={ product }/> : false }
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER , WOO_CATEGORIES  }) => ({ USER , WOO_CATEGORIES});

export default connect(mapStateToProps)(EditProductPage) ;
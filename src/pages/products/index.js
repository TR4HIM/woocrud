import React, { useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer'; 
import ProductItem from '../../components/product-item/ProductItem'; 
import EditProductModal from '../../components/edit-modal/EditModal'; 
import {loading , storeWooProducts} from '../../store/actions/';
import API from '../../API/'; 


const Products = ({dispatch , USER , WOO_PRODUCTS  }) => {
    
    useEffect(() => {
        if(WOO_PRODUCTS.length <= 0){
            dispatch(loading(true, "header-loader"));
            API.WC_getWooProducts( USER.token , 65, 1, 1 )
                .then((result)=>{
                    if( result !== undefined ){
                        dispatch(storeWooProducts(result));
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
    }, []);

    const renderProducts = () => {
        return WOO_PRODUCTS.map((product, i)=> (<ProductItem key={i} data={product} />) );
    }
    
    const renderProductsContainer = () => {
        return(
            <ul id="products-list" className={WOO_PRODUCTS.length < 3 ? 'few-products' : ''}>
                    { renderProducts() }
            </ul>
        )
    }

    return(
        <div id="user-products-page" > 
            <Header />
            <div id="container">
                { WOO_PRODUCTS.length ? renderProductsContainer() : null}
            </div>
            <EditProductModal />
            <Footer />
        </div>
    );
}

const mapStateToProps = ({ USER , WOO_PRODUCTS }) => ({ USER , WOO_PRODUCTS});

export default connect(mapStateToProps)(Products);
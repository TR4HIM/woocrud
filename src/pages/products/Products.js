import React, { useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer'; 


import ProductItem from './ProductItem';
import EditWooProductDrawer from './EditWooProductDrawer'
 

import {loading , storeWooProducts , clearStoreWooProducts} from '../../store/actions/';
import API from '../../API/'; 


const GET_WOO_PRODUCTS  = API.WC_getWooProducts();

const Products = ({dispatch , USER , WOO_PRODUCTS  }) => {

    useEffect(() => getWooProducts(), []);
    const getWooProducts = () => {
        // SHOW LOADER
        dispatch(loading(true, "header-loader"));
        dispatch(clearStoreWooProducts()); 
        GET_WOO_PRODUCTS( USER.token , 65, 1, 1 )
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
            <EditWooProductDrawer isSearchResult={false} />

            <Footer />

        </div>
    );
}

const mapStateToProps = ({ USER , WOO_PRODUCTS }) => ({ USER , WOO_PRODUCTS});

export default connect(mapStateToProps)(Products);
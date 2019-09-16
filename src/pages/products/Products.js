import React, { useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer'; 


import ProductItem from './ProductItem';
import EditWooProductDrawer from './EditWooProductDrawer'
 

import {loading , storeWooProducts , clearStoreWooProducts} from '../../store/actions/';
import API from '../../API/'; 


const GET_WOO_PRODUCTS  = API.WC_getWooProducts();

const Products = ({dispatch , USER , WOO_PRODUCTS , EDITING_WOO_PRODUCT }) => {

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [pager, setPager]                 = useState(1);
    const [perPage, setPerPage]             = useState(10);


    useEffect(() => getWooProducts(), []);


    
    const getWooProducts = () => {

        // SHOW LOADER
        dispatch(loading(true, "header-loader"));

        dispatch(clearStoreWooProducts()); 

        setIsLoadingData(true);

        GET_WOO_PRODUCTS( USER.token , 65, pager, perPage )
            .then((result)=>{
                if( result !== undefined ){
                    
                    dispatch(storeWooProducts(result));
                    setIsLoadingData(true);
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


    // const renderProducts = () => {
    //     return data.map((el)=>(
    //         <Product key={el['@id']} data={el} selected={ !!ids.find((id)=>id === el['@id']) }  />
    //     ))
    // }

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

const mapStateToProps = ({ USER , WOO_PRODUCTS , EDITING_WOO_PRODUCT }) => ({ USER , WOO_PRODUCTS , EDITING_WOO_PRODUCT});

export default connect(mapStateToProps)(Products);
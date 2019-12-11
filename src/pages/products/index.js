import React, { useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer'; 
import ProductItem from '../../components/product-item/ProductItem'; 
import EditProductModal from '../../components/edit-modal/EditModal'; 
import {loading , storeWooProducts , deleteWooProudct , editWooProduct} from '../../store/actions/';
import API from '../../API/'; 
import Pagination from 'rc-pagination';
import { store as notifStore} from 'react-notifications-component';

const DEFAULT_PER_PAGE          = 18;

const Products = ({dispatch , USER , WOO_PRODUCTS  }) => {

    const [productsCount,setProductsCount]      = useState(0);
    const [pager,setPager]                      = useState(1);
    const [wooProducts,setWooProducts]          = useState([]);
    
    useEffect(() => {
        if(!('products' in WOO_PRODUCTS)){ 
            dispatch(loading(true, "header-loader"));
            getWooProducts();
        }
    }, []); 
    
    useEffect(() => {
        if(productsCount > 0 && pager !== WOO_PRODUCTS.selectedPage){
            getWooProducts(pager);
        }
    }, [pager]);

    useEffect(() => {
        if( ('products' in WOO_PRODUCTS) && WOO_PRODUCTS.products.length > 0){
            setWooProducts(WOO_PRODUCTS.products)
            setProductsCount(WOO_PRODUCTS.productsCount)
            setPager(WOO_PRODUCTS.selectedPage);
        }
    }, [WOO_PRODUCTS]);

    const getWooProducts = () => {
        dispatch(loading(true, "header-loader"));
        API.WC_getWooProducts( USER.token , DEFAULT_PER_PAGE  ,pager )
        .then((result)=>{
            if( result !== undefined ){
                dispatch(storeWooProducts({ products : result.data , productsCount : result.headers['x-wp-total'] , selectedPage : pager }));
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
        return wooProducts.map((product, i)=> (<ProductItem key={i} liveUrl={API.APP_API_URL} data={product} deleteFunc={(id)=>deleteProduct(id)} openModalEdit={(data)=>dispatch(editWooProduct(true,data))}/>) );
    }
    
    const renderProductsContainer = () => {
        return(
            <ul id="products-list" className={wooProducts.length < 3 ? 'few-products' : ''}>
                { renderProducts() }
            </ul>
        )
    }

    const pageChangeHandler = (pg) => {
        
        setPager(pg);
    }

    const deleteProduct = (productId) => {
        dispatch(loading(true, "header-loading"));
        API.WC_deleteProduct(USER.token, productId).then((data)=>{ 
            dispatch(deleteWooProudct(data.id));
            dispatch(loading(false, "header-loading"));
            notifStore.addNotification({
                title: "Success",
                message: "The product has been deleted." ,
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
            notifStore.addNotification({
                title: "Error!",
                message:  "Network error please try again !" ,
                type: "danger",
                container: "top-center",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
            });

            // HIDE LOADING
            dispatch(loading(false, "header-loading"));

        })
        // handleClose()
    }

    return(
        <div id="user-products-page" > 
            <Header />
            <div id="container">
                { wooProducts.length > 0 ? renderProductsContainer() : null}

                { productsCount > 0 ? 
                <Pagination 
                    pageSize={DEFAULT_PER_PAGE}
                    onChange={pageChangeHandler} 
                    current={pager} 
                    total={ parseInt(productsCount) }
                    showLessItems
                    locale={{
                        prev_page   : "PREV_PAGE",
                        next_page   : "NEXT_PAGE",
                        prev_5      : "PREV_5_PAGES",
                        next_5      : "NEXT_5_PAGES",
                        prev_3      : "PREV_3_PAGES",
                        next_3      : "NEXT_3_PAGES"
                    }}
                />
                : null}
            </div>
            <EditProductModal />
            <Footer />
        </div>
    );
}

const mapStateToProps = ({ USER , WOO_PRODUCTS }) => ({ USER , WOO_PRODUCTS});

export default connect(mapStateToProps)(Products);
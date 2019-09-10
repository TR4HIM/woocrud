import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loading} from '../../layout/actions';
import Header from '../../layout/header/Header';

import API_WOO from './server-effect';

import ProductItem from './ProductItem';
import EditWooProductDrawer from './EditWooProductDrawer'
import {
    storeWooProducts,
    clearStoreWooProducts
} from './actions';


const GET_WOO_PRODUCTS  = API_WOO.WC_getWooProducts();

class Products extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentCategory         : {},
            isLoadingData           : false,
            pager                   : 1,
            pagesTotal              : null,
            perPage                 : 10,

        }
    } 

    getWooProducts(){

        // SHOW LOADER
        this.props.loading(true, "header-loader");

        this.props.clearStoreWooProducts();

        this.setState({
            isLoadingData   : true
        });

        

        GET_WOO_PRODUCTS( this.props.USER.token , 65, this.state.pager, this.state.perPage )
            .then((result)=>{
                if( result !== undefined ){
                    
                    this.props.storeWooProducts(result);

                    this.setState({
                        isLoadingData   : false
                    }, ()=>{
                        window.scrollTo(0, 0)
                    });

                    // HIDE LOADER
                    this.props.loading(false, "header-loader");
                }
            })
            .catch((error)=>{
                this.props.dispatch({
                    type : 'ERROR',
                    payload : error
                })
                // HIDE LOADING
                this.props.loading(false, "header-loader");
            })

    }

    componentDidMount(){
        this.getWooProducts();
        
    }

    renderProducts(){

        let listItems = this.props.WOO_PRODUCTS.map((product, i)=> <ProductItem key={i} data={product} /> );
        return (
            <ul id="products-list" className={this.props.WOO_PRODUCTS.length < 3 ? 'few-products' : ''}>
                {listItems}
            </ul>
        ) 
        
    }

    render(){
        
        return(
            <div id="user-products-page" > 
                <Header />

                <div id="container">
                    { this.props.WOO_PRODUCTS.length ? this.renderProducts() : null}
                </div>

                <EditWooProductDrawer isSearchResult={this.props.SEARCH_PRODUCTS ? true : false} /> 

               
            </div>
        );
    }
}





const mapStateToProps = (state) => {
    return {
        AUTHORIZED          : state.AUTHORIZED,
        USER                : state.USER,
        WOO_PRODUCTS        : state.WOO_PRODUCTS,
        EDITING_WOO_PRODUCT : state.EDITING_WOO_PRODUCT
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({
            loading,
            storeWooProducts,
            clearStoreWooProducts
        }, dispatch ),

        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Products);
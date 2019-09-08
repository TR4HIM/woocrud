import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Paper from '@material-ui/core/Paper';
import { TextField , MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {loading} from '../../layout/actions';
import { APP_ROUTES , APP_PATHS } from '../../config';
import Header from '../../layout/header/Header';
import { NavLink } from "react-router-dom";

import API_WOO from './server-effect';

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
            perPage              : 10,

        }
    } 

    componentDidMount(){
        GET_WOO_PRODUCTS( this.props.USER.token , 65, this.state.pager, this.state.perPage )
            .then((result)=>{

                console.log(result);
                if( result !== undefined ){
                    
                    this.props.storeKiboProducts(result.products);

                    this.setState({
                        isLoadingData   : false,
                        pagesTotal      : result.pages
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

    render(){
        return(
            <div>
                <h3>Hello World</h3>
                <MenuItem>
                    <NavLink activeClassName='selected' to={APP_PATHS.HOME} >
                        Home
                    </NavLink>
                </MenuItem>
            </div>
        );
    }
}





const mapStateToProps = (state) => {
    return {
        AUTHORIZED          : state.AUTHORIZED,
        USER                : state.USER,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({
            loading,
            storeWooProducts
        }, dispatch ),

        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Products);
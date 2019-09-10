import React, { Component, Fragment } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';

import {loading} from '../../layout/actions';
import {TextField, Button, IconButton } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import SiteLoader from '../../components/SiteLoader';
import ToggleDisplay from 'react-toggle-display';
import {green} from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';

import {
    editWooProduct
} from './actions';


class EditWooProductDrawer extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            percentage              : 0,
            showDeleteConfirmModal   : false,
            editShortDesc           : false,

            // FIELDS
            regularPrice            : 0,
            salePrice            : 0,
            productName             : "",
            productThumbnail        : "",
            status                  : false,
            bargain                 : false,
            fake                    : false,
            
        }

        this.updatingCount = 0;
    }    

    componentWillReceiveProps(nextProps) {

        // FILL THE FIELD OF THE COMPONENTS BY SETTING THE STATES
        if( nextProps.EDITING_WOO_PRODUCT.currentProduct  ){

            let regularPrice    = nextProps.EDITING_WOO_PRODUCT.currentProduct.regular_price;
            let salePrice       = nextProps.EDITING_WOO_PRODUCT.currentProduct.sale_price;
            this.setState({
                percentage      : (regularPrice.length && salePrice.length) ? this.getPercentage(salePrice, regularPrice) : 0,
                regularPrice    : regularPrice.length ? regularPrice : '',
                salePrice    : salePrice,
                productName     : nextProps.EDITING_WOO_PRODUCT.currentProduct.name,
                productThumbnail     : nextProps.EDITING_WOO_PRODUCT.currentProduct.images[0].src,
                status          : (nextProps.EDITING_WOO_PRODUCT.currentProduct.status === 'publish'),
                bargain         : nextProps.EDITING_WOO_PRODUCT.currentProduct.bargain,
                fake            : nextProps.EDITING_WOO_PRODUCT.currentProduct.fake
            });


            // ADD THE OVERFLOW HIDDEN 
            document.body.classList.add('overflow-hidden');
        }
        else
            // REMOVE THE OVERFLOW HIDDEN 
            document.body.classList.remove('overflow-hidden');
        
    }

    componentWillUnmount() {
        // REMOVE THE OVERFLOW HIDDEN 
        document.body.classList.remove('overflow-hidden');
    }
    
    
    
    closeDrawer(){
        this.props.editWooProduct(false);
  
    }

    getPercentage(salePrice, regularPrice){
        return  (salePrice === 0) ? 0 : Math.ceil( ( 100 - (( salePrice * 100 ) / regularPrice) ));
    }

    percentageChangeHandler(e){
        this.setState({
            percentage : e.target.value
        });
        this.updateProduct(e, "sale_price");
    }

    keyPressHandler(e){

        if(e.keyCode === 13)
            e.target.blur();

    }

    switchChangeHandler(field){

        this.setState((prevState)=>({
            [field] : !prevState[field]
        }), ()=>{
            // UPDATE PRODUCTS STATUS
            this.updateProduct(null, field);
        });
    }

    

    readyToRender(product){
        const editShortDesc = this.state.editShortDesc;
        const productImage = this.state.productThumbnail;
        const { classes } = this.props;
         
        return(
            <Fragment>
                
                <div className="visual">
                    <img src={productImage} alt={product.name}  />
                    <a href={this.props.EDITING_WOO_PRODUCT.currentProduct.permalink} target="_blank"  rel="noopener noreferrer" className="product-page-link">
                        <IconButton >
                            <LaunchIcon />
                        </IconButton>
                    </a>
                </div>
                

                <ToggleDisplay show={Boolean(!editShortDesc)}>

                    <div id="status">
                        <label> PUBLISH_A_PRODUCT </label>
                        <Switch
                            className="switch"
                            checked={this.state.status}
                            onChange={()=>this.switchChangeHandler('status')}
                            classes={{
                                switchBase: classes.greenSwitch,
                                checked: classes.colorChecked,
                            }}
                        />
                    </div>

                    <div id="bargain">
                        <label> PRODUCT_IS_BARGAIN </label>
                        <Switch
                            className="switch"
                            checked={this.state.bargain}
                            onChange={()=>this.switchChangeHandler('bargain')}
                            color="primary"
                            
                        />
                    </div>

                    <div id="fake">
                        <label> PRODUCT_IS_FAKE </label>
                        <Switch
                            className="switch"
                            checked={this.state.fake}
                            onChange={()=>this.switchChangeHandler('fake')}
                            color="primary"
                        />
                    </div>

                </ToggleDisplay>

                <ToggleDisplay show={Boolean(!editShortDesc)}>
                    <TextField
                        label='PRODUCT_NAME' 
                        value={this.state.productName}
                        className="title"
                        onBlur={(e)=>this.updateProduct(e, "name")}
                        onKeyDown={(e)=>this.keyPressHandler(e)}
                        onChange={(e)=>this.setState({ productName : e.target.value })}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rowsMax={3}
                    />
                    
                    <div className="price-box">
                        <TextField
                            label='REGULAR_PRICE' 
                            value={this.state.regularPrice}
                            className="regular-price"
                            onBlur={(e)=>this.updateProduct(e, "regular_price")}
                            onKeyDown={(e)=>this.keyPressHandler(e)}
                            onChange={(e)=>this.setState({ regularPrice : e.target.value })}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                        />
                    </div>

                    <div className="price-box">
                        <TextField
                            label='Sale Price' 
                            value={this.state.salePrice}
                            className="regular-price"
                            onBlur={(e)=>this.updateProduct(e, "sale_price")}
                            onKeyDown={(e)=>this.keyPressHandler(e)}
                            onChange={(e)=>this.setState({ salePrice : e.target.value })}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                        />
                                
                    </div> 

                    <Button variant="outlined" id="delete-product" color="secondary" onClick={()=>this.setState({ showDeleteConfirmModal : true})} >
                         DELETE 
                    </Button>
                </ToggleDisplay>
            </Fragment>
        )
    }
    
    render() {

        const product       = this.props.EDITING_WOO_PRODUCT.currentProduct;
        const editShortDesc = this.state.editShortDesc;

        return (
            <Drawer 
                id="edit-product" 
                anchor="left" 
                open={this.props.EDITING_WOO_PRODUCT.status} 
                onClose={this.closeDrawer.bind(this)}
            >

                <div className={`edit-product-inner ${editShortDesc ? "short-desc-showen" : "" }`}>
                    <SiteLoader id="edit-product-loader"  size={22} />

                    <CloseIcon id="close" onClick={this.closeDrawer.bind(this)} />

                    {product ? this.readyToRender(product) : null}
                </div>
            </Drawer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        USER                    : state.USER,
        EDITING_WOO_PRODUCT     : state.EDITING_WOO_PRODUCT
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({
            editWooProduct,
            loading,
        }, dispatch ),

        dispatch
    }
}

const styles = () => ({
    greenSwitch: {
        color: "",
        '&$colorChecked': {
            color: green[500],
            '& + $colorBar': {
                backgroundColor: green[500],
            },
        },
    },
    colorBar: {},
    colorChecked: {}
});


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditWooProductDrawer));

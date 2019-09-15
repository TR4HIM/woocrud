import React, { Component, Fragment } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';

import {loading} from '../../layout/actions';
import {TextField} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import SiteLoader from '../../components/SiteLoader';
import ToggleDisplay from 'react-toggle-display';
import {green} from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

import {
    editWooProduct
} from './actions';


class EditWooProductDrawer extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            // FIELDS
            regularPrice            : 0,
            salePrice            : 0,
            productName             : "",
            productThumbnail        : "",
            productDescription        : "",
            status                  : false,
            
        }

        this.updatingCount = 0;
    }    

    componentWillReceiveProps(nextProps) {

        // FILL THE FIELD OF THE COMPONENTS BY SETTING THE STATES
        if( nextProps.EDITING_WOO_PRODUCT.currentProduct  ){

            let regularPrice    = nextProps.EDITING_WOO_PRODUCT.currentProduct.regular_price;
            let salePrice       = nextProps.EDITING_WOO_PRODUCT.currentProduct.sale_price;
            this.setState({
                regularPrice    : regularPrice.length ? regularPrice : '',
                salePrice       : salePrice,
                productName     : nextProps.EDITING_WOO_PRODUCT.currentProduct.name,
                productDescription     : nextProps.EDITING_WOO_PRODUCT.currentProduct.description,
                productThumbnail     : nextProps.EDITING_WOO_PRODUCT.currentProduct.images[0].src,
                status          : (nextProps.EDITING_WOO_PRODUCT.currentProduct.status === 'publish'),
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

   

    switchChangeHandler(field){
        this.setState((prevState)=>({
            [field] : !prevState[field]
        }));
    }

    

    readyToRender(product){
        const productImage = this.state.productThumbnail;
        const { classes } = this.props;
         
        return(
            <Fragment>
                
                <div className="visual">
                    <img src={productImage} alt={product.name}  />
                </div>
                

                <ToggleDisplay>
                    <div id="status">
                        <label> Publish Product </label>
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
                </ToggleDisplay>

                <ToggleDisplay>
                    <TextField
                        label='Product Name' 
                        value={this.state.productName}
                        className="title"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rowsMax={3}
                    />
                    <TextField
                        label='Product Description' 
                        value={this.state.productDescription}
                        className="title"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows="6"
                    />

                    <TextField
                        label='Product Price' 
                        value={this.state.regularPrice}
                        className="regular-price"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                    />
                   
                </ToggleDisplay>
            </Fragment>
        )
    }
    
    render() {

        const product       = this.props.EDITING_WOO_PRODUCT.currentProduct;
        const editShortDesc = this.state.editShortDesc;
        const { classes } = this.props;
        return (
            <Drawer 
                id="edit-product" 
                anchor="left" 
                open={this.props.EDITING_WOO_PRODUCT.status} 
                onClose={this.closeDrawer.bind(this)}
                classes={{
                    paper: classes.drawerPaper,
                }}
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
    colorChecked: {},
    drawerPaper: {
        width: '50%',
    },
});


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditWooProductDrawer));

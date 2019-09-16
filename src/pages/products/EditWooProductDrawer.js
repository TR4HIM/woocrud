import React, { useState, Fragment , useEffect } from 'react';
import {connect} from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import {TextField} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import SiteLoader from '../../components/SiteLoader';
import ToggleDisplay from 'react-toggle-display';
import {green} from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
 

import { editWooProduct } from '../../store/actions/';

const EditWooProductDrawer = ({dispatch , classes , EDITING_WOO_PRODUCT}) => {

       
    const [regularPrice ,       setRegularPrice]        = useState(0);
    const [salePrice ,          setSalePrice]           = useState(0);
    const [productName ,        setProductName]         = useState("");
    const [productThumbnail ,   setProductThumbnail]    = useState("");
    const [productDescription , setProductDescription]  = useState("");
    const [status ,             setStatus]              = useState(false);


    useEffect(() => {
        if(EDITING_WOO_PRODUCT.currentProduct){
            let regularPrice    = EDITING_WOO_PRODUCT.currentProduct.regular_price;
            let salePrice       = EDITING_WOO_PRODUCT.currentProduct.sale_price.length ;
    
            setRegularPrice(regularPrice);
            setSalePrice(salePrice);
            setProductName(EDITING_WOO_PRODUCT.currentProduct.name);
            setProductThumbnail(EDITING_WOO_PRODUCT.currentProduct.images[0].src);
            setProductDescription(EDITING_WOO_PRODUCT.currentProduct.description);
            setStatus((EDITING_WOO_PRODUCT.currentProduct.status === 'publish'))
    
            // ADD THE OVERFLOW HIDDEN 
            document.body.classList.add('overflow-hidden');
        }
    },[EDITING_WOO_PRODUCT]);

    useEffect(() => {
        return () => document.body.classList.remove('overflow-hidden');
    }, [])
    
    const closeDrawer = () => {
        dispatch(editWooProduct(false));
    }

    const readyToRender = (product) => {
         
        return(
            <Fragment>
                
                <div className="visual">
                    <img src={productThumbnail} alt={product.name}  />
                </div>
                

                <ToggleDisplay>
                    <div id="status">
                        <label> Publish Product </label>
                        <Switch
                            className="switch"
                            checked={status}
                            onChange={(e) => setStatus(!status)}
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
                        value={productName}
                        className="title"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rowsMax={3}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    <TextField
                        label='Product Description' 
                        value={productDescription}
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
                        value={regularPrice}
                        className="title"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        label='Sale Price' 
                        value={salePrice}
                        className="title"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                    />
                   
                </ToggleDisplay>
            </Fragment>
        )
    }
    
    
    return (
        <Drawer 
            id="edit-product" 
            anchor="left" 
            open={EDITING_WOO_PRODUCT.status} 
            onClose={closeDrawer}
            classes={{
                paper: classes.drawerPaper,
            }}
        >

            <div className={`edit-product-inner `}>
                <SiteLoader id="edit-product-loader"  size={22} />

                <CloseIcon id="close" onClick={ closeDrawer } />

                {EDITING_WOO_PRODUCT.currentProduct ? readyToRender(EDITING_WOO_PRODUCT.currentProduct) : null}
            </div>
        </Drawer>
    );
 
}



const mapStateToProps = ({ USER  , EDITING_WOO_PRODUCT }) => ({ USER  , EDITING_WOO_PRODUCT});



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


export default withStyles(styles)(connect(mapStateToProps)(EditWooProductDrawer));

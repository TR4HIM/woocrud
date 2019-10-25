import React , {useState , useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect} from 'react-redux';
import { loading , editWooProduct } from '../../store/actions/';
import {    
    Grid , 
    TextField , 
    FormControlLabel , 
    Switch } from '@material-ui/core';

import ButtonUploadImage from '../../components/button-upload/ButtonUpload'; 
import EditableImage from '../../components/editable-image/EditableImage';
import { Link , Redirect } from "react-router-dom";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import API from '../../API/'; 


const MaxWidthDialog = ({dispatch  , USER ,  EDITING_WOO_PRODUCT}) => {

    const [productId,setProductId]                      = useState(0);
    const [regularPrice,setRegularPrice]                = useState(0);
    const [published,setPublished]                      = useState(false);
    const [salePrice,setSalePrice]                      = useState(0);
    const [productName,setProductName]                  = useState("");
    const [productThumbnail,setProductThumbnail]        = useState(false);
    const [productDescription,setProductDescription]    = useState("");

    useEffect(() => {
        if(EDITING_WOO_PRODUCT.currentProduct){
            setProductId(EDITING_WOO_PRODUCT.currentProduct.id);
            setRegularPrice(EDITING_WOO_PRODUCT.currentProduct.regular_price);
            setSalePrice(EDITING_WOO_PRODUCT.currentProduct.sale_price);
            setProductName(EDITING_WOO_PRODUCT.currentProduct.name);
            setProductThumbnail(EDITING_WOO_PRODUCT.currentProduct.images[0].src);
            setProductDescription(EDITING_WOO_PRODUCT.currentProduct.short_description);
            setPublished((EDITING_WOO_PRODUCT.currentProduct.status === 'publish'))
             // ADD THE OVERFLOW HIDDEN 
             document.body.classList.add('overflow-hidden');
        }   
    },[EDITING_WOO_PRODUCT]);

    const handleClose = () => {
        document.body.classList.remove('overflow-hidden');
        dispatch(editWooProduct(false));
    };
    
    const handleClickAdvanced = () => {
        dispatch(editWooProduct(false)); 
        return (<Redirect to={`/edit-produit/${productId}`} />)
    }

    const updateProductProperty = (e,field) => {
        let payload = {};
        dispatch(loading(true, "header-loader"));
        if(field === "name"){
            if( EDITING_WOO_PRODUCT.currentProduct.name === e.target.value ) return;
            payload = {
                name   : e.target.value,
                slug   : e.target.value
            }
        }
        else if( field === "regular_price" ){
            payload = {
                regular_price : e.target.value,
            }
        }
        else if( field === "sale_price" ){
            payload = {
                sale_price    : e.target.value,
            }
        }
        else if( field === "short_description" ){
            payload = {
                short_description    : e.target.value,
            }
        }
        else if( field === "status" ){
            let isPublished = (!published) ? 'publish' : 'draft';
            payload = {
                status    : isPublished,
            }
            setPublished(!published);
        }

        API.WC_updateProduct(USER.token, EDITING_WOO_PRODUCT.currentProduct.id, payload).then(()=>{ 
            console.log('Here we are again ');   
            dispatch(loading(false, "header-loader"));
        })
        .catch((error)=>{
            dispatch({
                type : "ERROR",
                payload : error
            });

            // HIDE LOADING
            dispatch(loading(false, "header-loader"));

        })
    }

    return (
        <>
        <Dialog
            fullWidth={true}
            maxWidth="lg"
            open={EDITING_WOO_PRODUCT.status}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
            scroll="body"
        >
            <MuiDialogTitle disableTypography >
                <Typography variant="h6">
                    Edit [ { productName } ]
                </Typography>
                {/* Redirect */}
                <Button variant="outlined" color="secondary" className="modal-button" onClick={ handleClose }>
                    <Link to={`/edit-produit/${productId}`}>
                        Advanced Edit 
                    </Link>
                </Button>
            </MuiDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                            <TextField
                                id="product-name"
                                label="Product Name"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                                value={productName} 
                                onChange={(e) => setProductName(e.target.value)}
                                onBlur={(e)=> updateProductProperty(e, "name")}
                            />
                            <TextField
                                id="regular-price"
                                label="Regular Price"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                                value={regularPrice}
                                onChange={(e) => setRegularPrice(e.target.value)}
                                onBlur={(e)=> updateProductProperty(e, "regular_price")}
                            />
                            <TextField
                                id="sales-price"
                                label="Sales Price"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                onBlur={(e)=> updateProductProperty(e, "sale_price")}
                            />
                            <TextField
                                id="product-description"
                                label="Short Product Description"
                                className="default-wysiwyg" 
                                margin="normal"
                                variant="outlined"
                                multiline
                                rows="8"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                onBlur={(e)=> updateProductProperty(e, "short_description")}
                            />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <div className="featured-image">
                                { productThumbnail  ? <EditableImage imageObject={productThumbnail} removeImageFunc={() => setProductThumbnail(false)} /> 
                                                : <ButtonUploadImage typeImage="thumbnail" onChange ={ (thumbnail) => setProductThumbnail(thumbnail.target.files[0]) } /> }
                        </div>  
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={published}
                                    onChange={(e) => updateProductProperty(e, "status")}
                                    value="published"
                                    color="primary"
                                />
                            }
                            label="Published"
                        />
                    </Grid>
                </Grid> 
            </DialogContent>
        </Dialog>
        </>
    );
}

const mapStateToProps = ({ USER , EDITING_WOO_PRODUCT }) => ({ USER , EDITING_WOO_PRODUCT});

export default connect(mapStateToProps)(MaxWidthDialog);
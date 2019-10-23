import React , {useState , useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect} from 'react-redux';
import { editWooProduct } from '../../store/actions/';
import {    
    Grid , 
    TextField , 
    FormControlLabel , 
    Switch } from '@material-ui/core';

import ButtonUploadImage from '../../components/button-upload/ButtonUpload'; 
import EditableImage from '../../components/editable-image/EditableImage';

const MaxWidthDialog = ({dispatch  , EDITING_WOO_PRODUCT}) => {

    const [regularPrice,setRegularPrice]                = useState(0);
    const [published,setPublished]                      = useState(false);
    const [salePrice,setSalePrice]                      = useState(0);
    const [productName,setProductName]                  = useState("");
    const [productThumbnail,setProductThumbnail]        = useState(false);
    const [productDescription,setProductDescription]    = useState("");
    const [status,setStatus]                            = useState(false);

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

    const handleClose = () => {
        document.body.classList.remove('overflow-hidden');
        dispatch(editWooProduct(false));
    };

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
            <DialogTitle id="max-width-dialog-title">Edit [ { productName } ]</DialogTitle>
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
                            />
                            <TextField
                                id="regular-price"
                                label="Regular Price"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                                value={regularPrice}
                            />
                            <TextField
                                id="sales-price"
                                label="Sales Price"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                                value={salePrice}
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
                            />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <div className="featured-image">
                                { productThumbnail  ? <EditableImage imageObject={productThumbnail} removeImageFunc={() => setProductThumbnail(false)} /> 
                                                : <ButtonUploadImage typeImage="thumbnail" onChange ={ (var1) => console.log(var1) } /> }
                        </div>  
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={status}
                                    onChange={() => setStatus(!published)}
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

const mapStateToProps = ({ EDITING_WOO_PRODUCT }) => ({ EDITING_WOO_PRODUCT});

export default connect(mapStateToProps)(MaxWidthDialog);
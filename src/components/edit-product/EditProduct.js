import React , {useState , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {connect} from 'react-redux';
import { editWooProduct } from '../../store/actions/';
import {    
    Container, 
    Grid , 
    Paper , 
    TextField , 
    FormControlLabel , 
    Switch , Typography , Checkbox ,
    Divider , Chip , Button ,
    ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails} from '@material-ui/core';

const MaxWidthDialog = ({dispatch  , EDITING_WOO_PRODUCT}) => {

    const [regularPrice,setRegularPrice]                = useState(0);
    const [published,setPublished]                = useState(false);
    const [salePrice,setSalePrice]                      = useState(0);
    const [productName,setProductName]                  = useState("");
    const [productThumbnail,setProductThumbnail]        = useState("");
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
            scroll="paper"
        >
            <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle>
            <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={8}>
                                <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                    Product Informations 
                                </Typography>
                                <Divider className="paper-divider" />
                                <TextField
                                    id="product-name"
                                    label="Product Name"
                                    className="default-input"
                                    variant="outlined"
                                    margin="normal"
                                    value={productName}
                                />
                                <TextField
                                    id="product-description"
                                    label="Product Description"
                                    className="default-wysiwyg" 
                                    margin="normal"
                                    variant="outlined"
                                    multiline
                                    rows="8"
                                    margin="normal"
                                    value={productDescription}
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
                                    id="product-sku"
                                    label="SKU"
                                    className="default-input"
                                    variant="outlined"
                                    margin="normal"
                                />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                Product Publish 
                            </Typography>
                            <Divider className="paper-divider" />
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
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Close
            </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}

const mapStateToProps = ({ EDITING_WOO_PRODUCT }) => ({ EDITING_WOO_PRODUCT});

export default connect(mapStateToProps)(MaxWidthDialog);
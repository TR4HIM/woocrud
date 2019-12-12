import React , {useState , useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {connect} from 'react-redux';
import { loading , editWooProduct, updateWooProudct } from '../../store/actions/';
import {    
    Grid , 
    FormControlLabel , 
    Switch } from '@material-ui/core';

import ButtonUploadImage from '../../components/button-upload/ButtonUpload'; 
import EditableImage from '../../components/editable-image/EditableImage';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import API from '../../API/'; 
import Loader from '../loader/loader';

import { EditorState , convertToRaw, ContentState  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html'; 
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { store as notifStore} from 'react-notifications-component';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

const EditProductModal = ({dispatch  , USER ,  EDITING_WOO_PRODUCT}) => {

    const [productId,setProductId]                      = useState(0);
    const [regularPrice,setRegularPrice]                = useState(0);
    const [published,setPublished]                      = useState(false);
    const [salePrice,setSalePrice]                      = useState(0);
    const [productName,setProductName]                  = useState("");
    const [productThumbnail,setProductThumbnail]        = useState(false); 
    const [productDescription,setProductDescription]    = useState(EditorState.createEmpty());
    const [isThumbnailUploade,setIsThumbnailUploade]    = useState(false);
    const [tmpUploadedImageUrl,setTmpUploadedImageUrl]  = useState("");
    const [tmpUploadedImageId,setTmpUploadedImageId]    = useState("");
    
    const [isPriceValide,setIsPriceValide]              = useState(false);
    const [isSalePriceValide,setIsSalePriceValide]      = useState(false);
    const [isProductNameValide,setIsProductNameValide]  = useState(false);
    
    useEffect(()=>{
        ValidatorForm.addValidationRule('isSalePriceValide', (value) => {
            return (parseInt(salePrice) >= parseInt(regularPrice)) ? false : true;
        });
    })

    useEffect(() => {
        if(EDITING_WOO_PRODUCT.currentProduct){
            setProductId(EDITING_WOO_PRODUCT.currentProduct.id);
            setRegularPrice(EDITING_WOO_PRODUCT.currentProduct.regular_price);
            setSalePrice(EDITING_WOO_PRODUCT.currentProduct.sale_price);
            setProductName(EDITING_WOO_PRODUCT.currentProduct.name);
            if(EDITING_WOO_PRODUCT.currentProduct.images.length>0){
                let imageObj = {sourceUrl : EDITING_WOO_PRODUCT.currentProduct.images[0].src , id : EDITING_WOO_PRODUCT.currentProduct.images[0].id};
                setProductThumbnail(imageObj);
            }else{
                setProductThumbnail(false);
            }
            const blocksFromHtml = htmlToDraft(EDITING_WOO_PRODUCT.currentProduct.short_description);
            const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap);
            setProductDescription(EditorState.createWithContent(contentState));
            setPublished((EDITING_WOO_PRODUCT.currentProduct.status === 'publish'));
            dispatch(updateWooProudct({id : EDITING_WOO_PRODUCT.currentProduct.id ,isUpdated : false}));
             document.body.classList.add('overflow-hidden');
        }   
    },[EDITING_WOO_PRODUCT]);

    const handleClose = () => {
        document.body.classList.remove('overflow-hidden');
        dispatch(editWooProduct(false));
        dispatch(updateWooProudct({id : productId ,isUpdated : true}));
    };

    useEffect(()=>{
        if(isThumbnailUploade === true && tmpUploadedImageUrl !== ""){
            let payload = {};
            let currentGallery = EDITING_WOO_PRODUCT.currentProduct.images;
            let id = EDITING_WOO_PRODUCT.currentProduct.id;
            //Remove first image
            currentGallery.shift();
            payload = {
                images: [
                    {
                      "src": productThumbnail.sourceUrl
                    },
                    ...currentGallery
                ]
            }

            API.WC_updateProduct(USER.token, EDITING_WOO_PRODUCT.currentProduct.id, payload).then(()=>{ 
                dispatch(updateWooProudct({id ,...payload}));
                dispatch(loading(false, "edit-modal-loading"));
                setIsThumbnailUploade(false);
            })
            .catch((error)=>{
                dispatch({
                    type : "ERROR",
                    payload : error
                });
    
                // HIDE LOADING
                dispatch(loading(false, "edit-modal-loading"));
                setIsThumbnailUploade(false);
            })
        }
    },[isThumbnailUploade,isThumbnailUploade])

    useEffect(()=>{
        if(tmpUploadedImageUrl !== ""){
            let imageObj = {...productThumbnail , isUloading : false, sourceUrl : tmpUploadedImageUrl , id : tmpUploadedImageId};
            setProductThumbnail(imageObj);
        }
    },[tmpUploadedImageUrl,tmpUploadedImageId]);

    const uploadProductThumbnail = (file) => {
        let formData = new FormData();
        let imageObject = file.imageObject;
		formData.append( 'file', imageObject );
		formData.append( 'title', EDITING_WOO_PRODUCT.currentProduct.name );
		formData.append( 'alt_text', EDITING_WOO_PRODUCT.currentProduct.name );
		formData.append( 'caption', EDITING_WOO_PRODUCT.currentProduct.name );
        formData.append( 'post', EDITING_WOO_PRODUCT.currentProduct.id );
        dispatch(loading(true, "edit-modal-loading"));
        
        API.WP_uploadImage(USER.token, formData).then((data)=>{ 
            setTmpUploadedImageUrl(data.source_url);
            setTmpUploadedImageId(data.id);
            setIsThumbnailUploade(true);
            
            dispatch(loading(false, "edit-modal-loading"));
        })
        .catch((error)=>{
            dispatch({
                type : "ERROR",
                payload : error
            });

            // HIDE LOADING
            dispatch(loading(false, "edit-modal-loading"));

        })
    }

    const handleThumbnailProduct = (file) =>{
        let imageObj = {id : file.name, name : file.name, isUloading : true, imageObject : file};
        setProductThumbnail(imageObj);
        uploadProductThumbnail(imageObj);
    }

    const deleteThumbnailImage = (imgObject) => {
        dispatch(loading(true, "edit-modal-loading"));
        API.WP_deleteImage(USER.token, imgObject.id).then((data)=>{ 
            setProductThumbnail(false);
            let id = EDITING_WOO_PRODUCT.currentProduct.id;
            let currentGallery = EDITING_WOO_PRODUCT.currentProduct.images;
            currentGallery.shift();
            let payload = {
                images: [
                    ...currentGallery
                ]
            }
            dispatch(updateWooProudct({id ,...payload}));
            dispatch(loading(false, "edit-modal-loading"));
        })
        .catch((error)=>{
            dispatch({
                type : "ERROR",
                payload : error
            });

            // HIDE LOADING
            dispatch(loading(false, "edit-modal-loading"));

        })
    }
    
    const updateProductProperty = (e,field) => {
        let payload = {};
        let id = EDITING_WOO_PRODUCT.currentProduct.id;

        if(field === "name"){
            if( EDITING_WOO_PRODUCT.currentProduct.name === e.target.value || !isProductNameValide) return;
            payload = {
                name   : e.target.value,
                slug   : e.target.value
            } 
        }
        else if( field === "regular_price" ){
            if( EDITING_WOO_PRODUCT.currentProduct.regular_price === e.target.value || !isPriceValide ) return;
            payload = {
                regular_price : e.target.value,
            }
        }
        else if( field === "sale_price" ){
            if (EDITING_WOO_PRODUCT.currentProduct.sale_price === e.target.value || !isSalePriceValide ) return;
            
            payload = {
                sale_price    : e.target.value,
            }
        }
        else if( field === "description" ){
            payload = {
                description    : draftToHtml(convertToRaw(productDescription.getCurrentContent())),
            }
        }

        else if( field === "status" ){
            let isPublished = (!published) ? 'publish' : 'draft';
            payload = {
                status    : isPublished,
            }
            setPublished(!published);
        }

        dispatch(loading(true, "edit-modal-loading"));

        
        API.WC_updateProduct(USER.token, id, payload).then(()=>{ 
            dispatch(loading(false, "edit-modal-loading"));
            dispatch(updateWooProudct({id , ...payload}));
            notifStore.addNotification({
                title: "Success",
                message: `Product ${field.replace('_',' ')}  has been updated` ,
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
            dispatch({
                type : "ERROR",
                payload : error
            });
            
            // HIDE LOADING
            dispatch(loading(false, "edit-modal-loading"));

        })
    }

    return (
        <form>
        <Dialog
            fullWidth={true}
            maxWidth="lg"
            open={EDITING_WOO_PRODUCT.status}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
            scroll="body"
            className="edit-modal-container"
            id="edit-modal-container"
        >
            <MuiDialogTitle disableTypography className="edit-modal-title">
                <Typography variant="h6">
                    Edit [ { productName } ]
                </Typography>
                <Button className="btn-close-modal" onClick={handleClose}>
                        <CloseIcon />
                </Button>
                <Loader id="edit-modal-loading"  type="linear" />
            </MuiDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <ValidatorForm
                            onSubmit={()=>{}}
                        > 
                            <TextValidator
                                id="product-name"
                                label="Product Name"
                                name="product-name"
                                value={productName}
                                validatorListener={(valid)=>setIsProductNameValide(valid)}
                                validators={['required','minStringLength:3']}
                                errorMessages={["This field is required" , 'At least 3 letters']}
                                className="default-input"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => setProductName(e.target.value)}
                                onBlur={(e)=> updateProductProperty(e, "name")}
                            />
                            <TextValidator
                                id="regular-price"
                                label="Regular Price"
                                name="regular-price"
                                value={regularPrice}
                                validatorListener={(valid)=>setIsPriceValide(valid)}
                                validators={[ 'isNumber' ]}
                                errorMessages={[ "Invalide number" ]}
                                className="default-input"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => setRegularPrice(e.target.value)}
                                onBlur={(e)=> updateProductProperty(e, "regular_price")}
                            />

                            <TextValidator
                                id="sales-price"
                                label="Sales Price"
                                name="sales-price"
                                value={salePrice}
                                validatorListener={(valid)=>setIsSalePriceValide(valid)}
                                validators={[
                                    'isNumber',
                                    'isSalePriceValide'
                                ]}
                                errorMessages={[ 
                                    "Invalide number",
                                    "Sale price should be less than regular price",
                                ]}
                                className="default-input"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => setSalePrice(e.target.value)}
                                onBlur={(e)=> updateProductProperty(e, "sale_price")}
                            />
                        </ValidatorForm>
                        <Editor
                            editorState={productDescription}
                            onEditorStateChange={(editorState) => setProductDescription(editorState)}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onBlur={(event, editorState) => updateProductProperty(editorState, "description")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <div className="featured-image">
                                { productThumbnail  ? <EditableImage imageObject={productThumbnail} removeImageFunc={() => deleteThumbnailImage(productThumbnail)} /> 
                                                : <ButtonUploadImage typeImage="thumbnail" onChange ={ (thumbnail) =>handleThumbnailProduct(thumbnail.target.files[0]) } /> }
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
        </form>
    );
}

const mapStateToProps = ({ USER , EDITING_WOO_PRODUCT }) => ({ USER , EDITING_WOO_PRODUCT});

export default connect(mapStateToProps)(EditProductModal);
import React , {useState , useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {connect} from 'react-redux';
import { loading , editWooProduct, updateWooProudct , deleteWooProudct} from '../../store/actions/';
import {    
    Grid , 
    TextField , 
    FormControlLabel , 
    Switch } from '@material-ui/core';

import ButtonUploadImage from '../../components/button-upload/ButtonUpload'; 
import EditableImage from '../../components/editable-image/EditableImage';
import { Link } from "react-router-dom";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import API from '../../API/'; 
import Loader from '../loader/loader';
import { EditorState , convertToRaw, ContentState  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html'; 
import htmlToDraft from 'html-to-draftjs';


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

    const [editorState,setEditorState]                  = useState(EditorState.createEmpty());

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
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            console.log(blocksFromHtml);
            setProductDescription(EditorState.createWithContent(contentState));

            // setProductDescription(EditorState.createWithContent(EDITING_WOO_PRODUCT.currentProduct.name));
            setPublished((EDITING_WOO_PRODUCT.currentProduct.status === 'publish'));
            let id = EDITING_WOO_PRODUCT.currentProduct.id;
            dispatch(updateWooProudct({id ,isUpdated : false}));
             // ADD THE OVERFLOW HIDDEN 
             document.body.classList.add('overflow-hidden');
        }   
    },[EDITING_WOO_PRODUCT]);

    useEffect(() => {
       
            console.log(productDescription) 
    },[productDescription]);

    const handleClose = () => {
        document.body.classList.remove('overflow-hidden');
        let id = EDITING_WOO_PRODUCT.currentProduct.id;
        dispatch(editWooProduct(false));
        dispatch(updateWooProudct({id ,isUpdated : true}));

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
            let descContent = draftToHtml(convertToRaw(productDescription.getCurrentContent()));
            console.log('Done');
            console.log(descContent);
            console.log('END');
            payload = {
                short_description    : descContent,
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

    const deleteProduct = () => {
        dispatch(loading(true, "header-loading"));
        handleClose();
        API.WC_deleteProduct(USER.token, productId).then((data)=>{ 
            console.log(data);
            dispatch(deleteWooProudct(data.id));
            dispatch(loading(false, "header-loading"));
        })
        .catch((error)=>{
            dispatch({
                type : "ERROR",
                payload : error
            });

            // HIDE LOADING
            dispatch(loading(false, "header-loading"));

        })
        // handleClose()
    }

    const onEditorStateChange = (editorState) => {
        // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        setProductDescription(editorState)
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
                {/* Redirect */}
                {/* <div className="modal-button">
                    <Button variant="outlined" color="primary" onClick={ handleClose }>
                        <Link to={`/edit-produit/${productId}`}>
                            Advanced Edit 
                        </Link>
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={ deleteProduct }>
                        Delete Product
                    </Button>
                </div> */}
                <Loader id="edit-modal-loading"  type="linear" />
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
                            {/* <TextField
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
                            /> */}
                            <Editor
                                editorState={productDescription}
                                onEditorStateChange={onEditorStateChange}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onFocus={(event) => {console.log('Focus')}}
                                onBlur={(event, editorState) => updateProductProperty(editorState, "short_description")}
                                onTab={(event) => {console.log('Tab')}}
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
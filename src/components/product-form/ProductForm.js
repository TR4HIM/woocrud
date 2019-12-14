import React , { useState , useEffect } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {    
        Container, 
        Grid , 
        Paper , 
        TextField , 
        FormControlLabel ,  
        Switch , Typography , Checkbox ,
        Divider  , Button ,
        ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails} from '@material-ui/core';
import { loading , deleteWooProudct} from '../../store/actions/';
import { Redirect } from 'react-router';
import API  from '../../API/'; 
import Icon from '@material-ui/core/Icon';
import ProductsAutoComplete from '../../components/input-autocomplete/InputAutocomplete';
import ButtonUploadImage    from '../../components/button-upload/ButtonUpload';
import EditableImage        from '../../components/editable-image/EditableImage';
import FormTags             from '../../components/form-tags/FormTags';
import FormCategories       from '../../components/form-categories/FormCategories';
import FormGallery          from '../../components/form-gallery/FormGallery';
import { EditorState , convertToRaw, ContentState  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html'; 
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { store as notifStore} from 'react-notifications-component';
import ModalConfirmation from '../../components/modal-confirmation/ModalConfirmation';
import {APP_PATHS} from '../../config';
import Loader from '../loader/loader';

const ProductForm = ({dispatch , USER ,  toEdit=false , productData=null , saveProductAction}) =>  {

    const [productID,setProductID]                                          = useState(false);
    const [productName,setProductName]                                      = useState("");
    const [productDescription,setProductDescription]                        = useState(EditorState.createEmpty());
    const [shortProductDescription,setShortProductDescription]              = useState(EditorState.createEmpty());
    const [regularPrice,setRegularPrice]                                    = useState(0);
    const [salePrice,setSalePrice]                                          = useState(0);
    const [sku,setSku]                                                      = useState("");
    const [published,setPublished]                                          = useState(false);
    const [virtual,setVirtual]                                              = useState(false);
    const [downloadable,setDownloadable]                                    = useState(false);
    const [upSellsProducts,setUpSellsProducts]                              = useState([]);
    const [crossSellsProducts,setCrossSellsProducts]                        = useState([]);
    const [upSellsProductsIds,setUpSellsProductsIds]                        = useState([]);
    const [crossSellsProductsIds,setCrossSellsProductsIds]                  = useState([]);
    const [productImage,setProductImage]                                    = useState(false);
    const [productGallery,setProductGallery]                                = useState([]);
    const [productTags,setProductTags]                                      = useState([]);
    const [wooStoreCategories,setWooStoreCategories]                        = useState([]);
    const [getProductCategories,setGetProductCategories]                    = useState([]);
    const [isThumbnailUploade,setIsThumbnailUploade]                        = useState(false);
    const [tmpUploadedImageUrl,setTmpUploadedImageUrl]                      = useState("");
    const [isProductDeleted,setIsProductDeleted]                            = useState(false);
    const [ isEditedProductLoaded,setIsEditedProductLoaded]                 = useState(false);
    const [showConfirmation,setShowConfirmation]          = useState(false);

    useEffect(()=>{
        ValidatorForm.addValidationRule('isSalePriceValide', (value) => {
            return (parseInt(value) > parseInt(regularPrice)) ? false : true;
        });
    },[regularPrice])

    useEffect(()=>{
        if(toEdit === true){
            const isPublished   = (productData.status === "publish") ? true : false;
            let galleryImages   = productData.images.map(img => ({sourceUrl : img.src , id : img.id}));

            setUpSellsProductsIds(productData.upsell_ids);
            setCrossSellsProductsIds(productData.cross_sell_ids);

            setProductID(productData.id);
            setProductName(productData.name);

            const descriptionFromHtml = htmlToDraft(productData.description);
            const contentStateDesc = ContentState.createFromBlockArray(descriptionFromHtml.contentBlocks, descriptionFromHtml.entityMap);
            setProductDescription(EditorState.createWithContent(contentStateDesc));

            const shortDescriptionFromHtml = htmlToDraft(productData.short_description);
            const contentStateShortDesc = ContentState.createFromBlockArray(shortDescriptionFromHtml.contentBlocks, shortDescriptionFromHtml.entityMap);
            setShortProductDescription(EditorState.createWithContent(contentStateShortDesc));

            setRegularPrice(productData.regular_price);
            setSalePrice(productData.sale_price);
            setSku(productData.sku);
            setDownloadable(productData.downloadable);
            setVirtual(productData.virtual);
            setProductTags(productData.tags);
            setGetProductCategories(productData.categories);

            // Remove First Element For Featured Image :) 
            setProductImage(galleryImages.shift());
            setProductGallery(productData.images);
            setPublished(isPublished);
        }
        setIsEditedProductLoaded(true);
    },[]);

    useEffect(()=>{
        if(isThumbnailUploade && tmpUploadedImageUrl !== ""){
            const productGalleryObj = productGallery.map(a => a.isUloading === true ? { ...a, isUloading : false , sourceUrl : tmpUploadedImageUrl} : a);
            setProductGallery(productGalleryObj);
            setTmpUploadedImageUrl(""); 
            setIsThumbnailUploade(false);
        }
    },[productGallery,isThumbnailUploade])

    const handleThumbnailProduct = (file) =>{
        let imageObj = {id : file.name, name : file.name, isUloading : true, imageObject : file};

        setProductImage(imageObj);

        let formData    = new FormData();

        formData.append( 'file', file );
        
        dispatch(loading(true, "product-image-loading"));

        API.WP_uploadImage(USER.token, formData).then((data)=>{ 
            setProductImage(data.source_url);
            setIsThumbnailUploade(true);
            dispatch(loading(false, "product-image-loading"));
        })
        .catch((error)=>{
            dispatch({
                type : "ERROR",
                payload : error
            });
            dispatch(loading(false, "product-image-loading"));
        })
    }
    
    const productPayLoadData = () => {
        
        dispatch(loading(true, "header-loader"));
        
        let galleryImages       = productGallery.map(img => ({src : img.sourceUrl}));

        if( productImage !== undefined && productImage !== false){
            if(toEdit === true && typeof productImage !== "string")
                galleryImages.unshift({src : productImage.sourceUrl});
            else
                galleryImages.unshift({src : productImage});
        }

        let payload = {
            sale_price          : salePrice.toString(),
            status              : (published)  ? 'publish' : 'draft',
            short_description   : draftToHtml(convertToRaw(shortProductDescription.getCurrentContent())) ,
            sku                 : sku,
            categories          : wooStoreCategories,
            tags                : productTags,
            virtual             : virtual,
            downloadable        : downloadable,
            upsell_ids          : upSellsProducts,
            cross_sell_ids      : crossSellsProducts,
        };

        payload = {...payload, regular_price : regularPrice.toString()};
        payload = {...payload, name          : productName};
        payload = {...payload, description   : draftToHtml(convertToRaw(productDescription.getCurrentContent()))};
        payload = {...payload, images        : galleryImages};
        // If new product
        (toEdit === true) ? saveProductAction({ productId : productID , payload }) : saveProductAction(payload);
    }

    const deleteProduct = (action) => {
        setShowConfirmation(false);
        if(action === true) {
            dispatch(loading(true, "header-loading"));
            API.WC_deleteProduct(USER.token, productID).then((data)=>{ 
                setIsProductDeleted(true)
                dispatch(deleteWooProudct(data.id));
                dispatch(loading(false, "header-loading"));
                notifStore.addNotification({
                    title: "Success",
                    message: "The product has been deleted." ,
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
                notifStore.addNotification({
                    title: "Error!",
                    message:  "Delete Error : please try again !" ,
                    type: "danger",
                    container: "top-center",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    width: 400,
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
                dispatch(loading(false, "header-loading"));
            })
        }
    }

    return (
    <Container maxWidth="lg" id="product-form-container">
        {isProductDeleted && toEdit && <Redirect to={APP_PATHS.MY_PRODUCTS} />}
        <ModalConfirmation product={productName} openModalConfirmation={showConfirmation} validateAction={(val)=>deleteProduct(val)}/>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
                <ValidatorForm onSubmit={() => { productPayLoadData() } }>
                <Paper className="product-form">
                    { toEdit && <Button variant="outlined" color="secondary" className="delete-product-btn" onClick={() => setShowConfirmation(true)}> Delete Product </Button> }
                    <Typography variant="subtitle2" className="paper-title" gutterBottom> 
                        Product Informations 
                    </Typography>
                    <Divider className="paper-divider" />
                    <TextValidator
                        id="product-name"
                        label="Product Name"
                        name="product-name"
                        value={productName}
                        validators={['required','minStringLength:3']}
                        errorMessages={["This field is required" , 'At least 3 letters']}
                        className="default-input"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    <Editor
                        editorState={productDescription}
                        onEditorStateChange={(editorState) => setProductDescription(editorState)}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                    />
                    <TextValidator
                        id="regular-price"
                        label="Regular Price"
                        name="regular-price"
                        value={regularPrice}
                        validators={[
                            'isNumber'
                        ]}
                        errorMessages={[ 
                            "Invalide number"
                        ]}
                        className="default-input"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setRegularPrice(e.target.value)}
                    />
                    <TextValidator
                        id="sales-price"
                        label="Sales Price"
                        name="sales-price"
                        value={salePrice}
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
                    />
                    <TextField
                        id="product-sku"
                        label="SKU"
                        className="default-input"
                        variant="outlined"
                        margin="normal"
                        value={sku} 
                        onChange={(e) => setSku(e.target.value)}
                    />
                </Paper>
                <div className="expansion-panel-container">
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<Icon>expand_more</Icon>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className="product-panel">
                                Product Short Description
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Editor
                                editorState={shortProductDescription}
                                onEditorStateChange={(editorState) => setShortProductDescription(editorState)}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                            />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<Icon>expand_more</Icon>}
                            aria-controls="panel1a-content2"
                            id="panel1a-header2"
                        >
                            <Typography className="product-panel">
                                Advanced
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={virtual} onChange={() => setVirtual(!virtual)} value="checkedA" />
                                }
                                label="Virtual"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={downloadable} onChange={() => setDownloadable(!downloadable)} value="checkedA" />
                                }
                                label="Downloadable"
                            />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<Icon>expand_more</Icon>}
                            aria-controls="panel1a-content3"
                            id="auto-complete-panel"
                        >
                            <Loader id="auto-complete-loading"  type="linear" />
                            <Typography className="product-panel">
                                Linked Proudcts
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className="panel-form">
                            <div className="autocomplete-container">
                                { isEditedProductLoaded      && <ProductsAutoComplete fieldLabel="UpSells" currentProduct={upSellsProductsIds} onChangeAuto={(upsellsvalue) => setUpSellsProducts(upsellsvalue)}/> }
                            </div>
                            <div className="autocomplete-container">
                                { isEditedProductLoaded   && <ProductsAutoComplete fieldLabel="Cross-Sells"  currentProduct={crossSellsProductsIds} onChangeAuto={(crosssellsvalue) => setCrossSellsProducts(crosssellsvalue)} /> }
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
                <Paper className="product-form">
                    <Button type="submit" variant="contained" color="primary">
                        { (toEdit === true)  ? 'Save Porduct' : 'Add Porduct' }
                    </Button>
                </Paper>
            </ValidatorForm>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Paper className="product-form">
                    <Typography variant="subtitle2" className="paper-title" gutterBottom>
                        Product Publish 
                    </Typography>
                    <Divider className="paper-divider" />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={published}
                                onChange={() => setPublished(!published)}
                                value="published"
                                color="primary"
                            />
                        }
                        label="Published"
                    />
                </Paper>
                <Paper className="product-form" elevation={2}>
                    <Loader id="product-image-loading"  type="linear" />
                    <Typography variant="subtitle2" className="paper-title" gutterBottom>
                        Product Image 
                    </Typography>
                    <Divider className="paper-divider" />
                    <div className="featured-image">
                        { productImage  ? <EditableImage imageObject={productImage} removeImageFunc={() =>setProductImage(false)} />  
                                        : <ButtonUploadImage typeImage="thumbnail" onChange ={ (thumbnail) => handleThumbnailProduct(thumbnail.target.files[0]) } /> }
                    </div>    
                </Paper>
                { isEditedProductLoaded && <FormGallery toEdit={toEdit} currentGallery={productGallery} saveProductGallery={(gallery)=> setProductGallery(gallery)}/> }
                { isEditedProductLoaded && <FormCategories toEdit={toEdit} currentCategories={getProductCategories} updateSelectedCategories={(selectedCategories) => setWooStoreCategories([...selectedCategories])} /> }
                { isEditedProductLoaded && <FormTags toEdit={toEdit} currentTags={productTags} updateSelectedTags={(selectedTags)=>setProductTags(selectedTags)} /> }
            </Grid>
        </Grid>
    </Container> ); 
}

ProductForm.propTypes = {
    toEdit : PropTypes.bool,
    productData : PropTypes.object,
    saveProductAction : PropTypes.func
}

const mapStateToProps = ({ USER }) => ({ USER });

export default   connect(mapStateToProps)(ProductForm) ;
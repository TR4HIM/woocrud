import React , { useState , useEffect } from 'react';
import {connect} from 'react-redux';
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

const ProductForm = ({dispatch , USER ,  toEdit=false , productData=null , saveProductAction}) =>  {

    const [productID,setProductID]                                          = useState(false);
    const [productName,setProductName]                                      = useState("");
    const [productDescription,setProductDescription]                        = useState("");
    const [shortProductDescription,setShortProductDescription]              = useState("");
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
    const [productDeletedImages,setProductDeletedImages]                    = useState([]);
    const [isProductDeleted,setIsProductDeleted]                            = useState(false);
    const [ isEditedProductLoaded,setIsEditedProductLoaded]                 = useState(false);


    useEffect(()=>{
        if(toEdit === true){
            const isPublished   = (productData.status === "publish") ? true : false;
            let galleryImages   = productData.images.map(img => ({sourceUrl : img.src , id : img.id}));

            setUpSellsProductsIds(productData.upsell_ids);
            setCrossSellsProductsIds(productData.cross_sell_ids);

            setProductID(productData.id);
            setProductName(productData.name);
            setProductDescription(productData.description);
            setShortProductDescription(productData.short_description);
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
        
        dispatch(loading(true, "header-loader"));

        API.WP_uploadImage(USER.token, formData).then((data)=>{ 
            setProductImage(data.source_url);
            setIsThumbnailUploade(true);
            dispatch(loading(false, "header-loader"));
        })
        .catch((error)=>{
            dispatch({
                type : "ERROR",
                payload : error
            });
            dispatch(loading(false, "header-loader"));
        })
    }
    
    const deleteThumbnailImage = (imgObject) => {
        setProductImage(false);
        if(typeof imgObject !== "string"){
            setProductDeletedImages(currentDeletedImages => [...currentDeletedImages, imgObject])
        }
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
            short_description   : shortProductDescription,
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
        payload = {...payload, description   : productDescription};
        payload = {...payload, images        : galleryImages};

        // If new product
        (toEdit === true) ? saveProductAction({ productId : productID , payload }) : saveProductAction(payload);
    }

    const deleteProduct = () => {
        dispatch(loading(true, "header-loading"));
        API.WC_deleteProduct(USER.token, productID).then((data)=>{ 
            setIsProductDeleted(true)
            dispatch(deleteWooProudct(productID));
            dispatch(loading(false, "header-loading"));
        })
        .catch((error)=>{
            dispatch({
                type : "ERROR",
                payload : error
            });
            dispatch(loading(false, "header-loading"));
        })
    }

    return (
        <Container maxWidth="lg" id="product-form-container">
                {isProductDeleted && toEdit && <Redirect to={`/mes-produits`} />}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Paper className="product-form">
                            { toEdit && <Button variant="outlined" color="secondary" className="delete-product-btn" onClick={ deleteProduct }> Delete Product </Button> }
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
                                onChange={(e) => setProductName(e.target.value)}
                            />
                            <TextField
                                id="product-description"
                                label="Product Description"
                                className="default-wysiwyg" 
                                margin="normal"
                                variant="outlined"
                                multiline
                                rows="8"
                                value={productDescription} 
                                onChange={(e) => setProductDescription(e.target.value)}
                            />
                            <TextField
                                id="regular-price"
                                label="Regular Price"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                                value={regularPrice} 
                                onChange={(e) => setRegularPrice(e.target.value)}
                            />
                            <TextField
                                id="sales-price"
                                label="Sales Price"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                                value={salePrice} 
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
                                    <TextField
                                        id="product-description"
                                        label="Product Short Description"
                                        className="default-wysiwyg" 
                                        margin="normal"
                                        variant="outlined"
                                        multiline
                                        rows="8"
                                        value={shortProductDescription} 
                                        onChange={(e) => setShortProductDescription(e.target.value)}
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
                                    id="panel1a-header3"
                                >
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
                            <Button variant="contained" onClick={()=>productPayLoadData('Add Product')} color="primary">
                                { (toEdit === true)  ? 'Save Porduct' : 'Add Porduct' }
                            </Button>
                        </Paper>
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
                            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                Product Image 
                            </Typography>
                            <Divider className="paper-divider" />
                            <div className="featured-image">
                                { productImage  ? <EditableImage imageObject={productImage} removeImageFunc={() =>deleteThumbnailImage(productImage)} />  
                                                : <ButtonUploadImage typeImage="thumbnail" onChange ={ (thumbnail) => handleThumbnailProduct(thumbnail.target.files[0]) } /> }
                            </div>    
                        </Paper>
                        { isEditedProductLoaded && <FormGallery toEdit={toEdit} currentGallery={productGallery} saveProductGallery={(gallery)=> setProductGallery(gallery)}/> }
                        { isEditedProductLoaded && <FormCategories toEdit={toEdit} currentCategories={getProductCategories} updateSelectedCategories={(selectedCategories) => setWooStoreCategories([...selectedCategories])} /> }
                        { isEditedProductLoaded && <FormTags toEdit={toEdit} currentTags={productTags} updateSelectedTags={(selectedTags)=>setProductTags(selectedTags)} /> }
                    </Grid>
                </Grid>
            </Container>
    ); 
}

const mapStateToProps = ({ USER }) => ({ USER });

export default   connect(mapStateToProps)(ProductForm) ;
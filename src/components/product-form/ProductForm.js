import React , {useState , useRef , useEffect } from 'react';
import {connect} from 'react-redux';
import {    
        Container, 
        Grid , 
        Paper , Input ,
        TextField , Select ,
        FormControlLabel , FormControl ,
        Switch , Typography , Checkbox ,
        Divider , Chip , Button ,
        ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails} from '@material-ui/core';

import Icon from '@material-ui/core/Icon';
import ProductsAutoComplete from '../../components/input-autocomplete/InputAutocomplete';
import ButtonUploadImage from '../../components/button-upload/ButtonUpload';
import EditableImage from '../../components/editable-image/EditableImage';
import { loading , storeWooTags} from '../../store/actions/';
import API from '../../API/'; 
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ProductForm = ({dispatch , USER , WOO_CATEGORIES , WOO_TAGS ,  toEdit=false , productData=null , saveProductAction}) =>  {

    const tagInput = useRef(null);

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
    const [wooStoreTags, setWooStoreTags]                                   = useState([]);
    const [productTags, setProductTags]                                     = useState([]);
    const [wooStoreCategories, setWooStoreCategories]                       = useState([]);
    const [getProductCategories, setGetProductCategories]                   = useState([]);
    const [isThumbnailUploade,setIsThumbnailUploade]                        = useState(false);
    const [tmpUploadedImageUrl,setTmpUploadedImageUrl]                      = useState("");
    const [productDeletedImages, setProductDeletedImages]                   = useState([]);
    const [crossSellsProductsDataReady, setCrossSellsProductsDataReady]     = useState(true);
    const [upSellsProductsDataReady, setUpSellsProductsDataReady]           = useState(true);

    useEffect(()=>{
        setWooStoreCategories(WOO_CATEGORIES);
        setWooStoreTags(WOO_TAGS);

        // WOO_TAGS.map(name => (console.log(name))) 

        if(toEdit === true){
            const isPublished   = (productData.status === "publish") ? true : false;
            let galleryImages   = productData.images.map(img => ({sourceUrl : img.src , id : img.id}));
            if(productData.upsell_ids.length > 0)
                setCrossSellsProductsDataReady(false);
            if(productData.upsell_ids.length > 0)
                setUpSellsProductsDataReady(false);

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
            setProductTags(productData.tags)
            setGetProductCategories(productData.categories);

            // Remove First Element For Featured Image :) 
            setProductImage(galleryImages.shift());
            setProductGallery(galleryImages);
            setPublished(isPublished);

        }
    },[]);

    useEffect(()=>{
        if(upSellsProductsIds.length > 0) 
            getRelatedProductData(upSellsProductsIds,'upSellsProducts')
        if (crossSellsProductsIds.length > 0)
            getRelatedProductData(crossSellsProductsIds,'crossSellsProducts')
    },[upSellsProductsIds, crossSellsProductsIds]);

    useEffect(()=>{
        if(upSellsProducts.length > 0){
            setUpSellsProductsDataReady(true)
        }
        if(crossSellsProducts.length > 0){
            setCrossSellsProductsDataReady(true)
        }

    },[upSellsProducts, crossSellsProducts]);

    

    const getRelatedProductData = async (relatedProducts,relatedType) => {
        const listProductsData = [];
        for(let i = 0; i < relatedProducts.length ; i++){
            let id = relatedProducts[i];
            await API.WC_getWooProductById(USER.token, id)
            .then((result)=>{
                if( result !== undefined ){
                    // HIDE LOADER
                    let productItem = {id:result.id, name:result.name};
                    listProductsData.push(productItem)
                    dispatch(loading(false, "header-loader"));
                }
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error
                })
                // HIDE LOADING
                dispatch(loading(false, "header-loader"));
            })
        }
        if(relatedType === "upSellsProducts")
            setUpSellsProducts(listProductsData);
        if(relatedType === "crossSellsProducts")
            setCrossSellsProducts(listProductsData);
    }

    useEffect(() => {
        if(toEdit === true ){
            if(getProductCategories.length > 0 && wooStoreCategories.length > 0){
                const tmpCats = getProductCategories.map(category => ({
                    ...category,
                    selected: true
                }));
                const selectedCategories = [...WOO_CATEGORIES.filter(item1 => !tmpCats.find(item2 => item1.id === item2.id)), ...tmpCats];
                setWooStoreCategories(selectedCategories);
            }
        }
    }, [getProductCategories ]);

    useEffect(()=>{
        tagInput.current.value = "";
        // console.log(productTags)
    },[productTags])

    useEffect(()=>{
        if(isThumbnailUploade && tmpUploadedImageUrl !== ""){
            const productGalleryObj = productGallery.map(a => a.isUloading === true ? { ...a, isUloading : false , sourceUrl : tmpUploadedImageUrl} : a);
            setProductGallery(productGalleryObj);
            setTmpUploadedImageUrl(""); 
            setIsThumbnailUploade(false);
        }
    },[productGallery,isThumbnailUploade])

    const uploadProductImage = (file,imgType="gallery") => {
        let imageObject = file.imageObject;
        let formData    = new FormData();

        formData.append( 'file', imageObject );
        if(productID !== false)
            formData.append( 'post', productID);
        
        dispatch(loading(true, "header-loader"));
        return API.WP_uploadImage(USER.token, formData).then((data)=>{ 
            if(imgType == 'thumbnail'){
                setProductImage(data.source_url);
                setIsThumbnailUploade(true);
                dispatch(loading(false, "header-loader"));
            }else{
                return data;
            }
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

    const handleThumbnailProduct = (file) =>{
        let imageObj = {id : file.name, name : file.name, isUloading : true, imageObject : file};
        setProductImage(imageObj);
        uploadProductImage(imageObj,'thumbnail');
    }

    const handleProductGallery = async (gallery) => {
        const selectedImages = gallery.target.files;
        for(let i = 0; i < selectedImages.length ; i++){
            let productImage = selectedImages[i];
            let id = i+productImage.name;
            let imageObj = {id, name : productImage.name, isUloading : true, imageObject : productImage};
            setIsThumbnailUploade(false);
            setProductGallery( currentGallery => [...currentGallery,  imageObj]);
            
            await uploadProductImage(imageObj).then((data)=>{
                setTmpUploadedImageUrl(data.source_url); 
                setIsThumbnailUploade(true);
            })
        }
        dispatch(loading(false, "header-loader"));
    }

    const removeGallery = (imageToDelete) => {
        setProductGallery(imagesGallery => imagesGallery.filter(image => image !== imageToDelete));
        if(typeof imgObject !== "string"){
            setProductDeletedImages(currentDeletedImages => [...currentDeletedImages, imageToDelete])
        }
    }
    
    const deleteThumbnailImage = (imgObject) => {
        setProductImage(false);
        if(typeof imgObject !== "string"){
            setProductDeletedImages(currentDeletedImages => [...currentDeletedImages, imgObject])
        }
    }
    
    const addTagToWoo = (payload) => {
        API.WC_createWooTags(USER.token,payload).then((data)=>{ 
            setProductTags(currentTags => [...currentTags, data])
            dispatch(storeWooTags([...WOO_TAGS, data]));
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

    const handleAddTag = (e) => {
        if(tagInput.current.value.trim() !== '' && e.keyCode === 13){
            let wooStoreTags    = WOO_TAGS.filter(tag => tag.name === tagInput.current.value.trim() ).map(t => ({id : t.id , name : t.name}));
            let isTagExist      = productTags.filter(tag => tag.name === tagInput.current.value.trim() )
            if(isTagExist.length > 0){
                tagInput.current.value = "";
                return;
            }
            if(wooStoreTags.length > 0)
                setProductTags(currentTags => [...currentTags, ...wooStoreTags])
            else {
                addTagToWoo({name : tagInput.current.value.trim()});
            }

        }
    }

    const handleDeleteTag = chipToDelete => () => {
        setProductTags(productTags => productTags.filter(tag => tag.name !== chipToDelete.name));
    }

    const checkCategory = index => {
        const newCategoryList = [...wooStoreCategories]; 
        newCategoryList[index].selected = ! newCategoryList[index].selected;
        setWooStoreCategories(newCategoryList);
    }

    const renderCategoriesList = () => {
        return(
            wooStoreCategories.map((category,i)=>(
                <FormControlLabel
                    control={ <Checkbox checked={category.selected} 
                    onChange={() => checkCategory(i) } value={category.selected} /> }
                    label={category.name}
                    key={i}
                />)
            )  
        )
    }

    
    const productPayLoadData = () => {
        
        dispatch(loading(true, "header-loader"));
        
        let galleryImages       = productGallery.map(img => ({src : img.sourceUrl}));
        let productCategories   = wooStoreCategories.filter(cat => cat.selected ).map(c => ({id : c.id}));
        let productUpSells      = upSellsProducts.map(ups =>  ups.id );
        let productCrossSells   = crossSellsProducts.map(ups =>  ups.id );

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
            categories          : productCategories,
            tags                : productTags,
            virtual             : virtual,
            downloadable        : downloadable,
            upsell_ids          : productUpSells,
            cross_sell_ids      : productCrossSells,
            // related_ids      : 'EMPTY',
        };

        payload = {...payload, regular_price : regularPrice.toString()};
        payload = {...payload, name          : productName};
        payload = {...payload, description   : productDescription};
        payload = {...payload, images        : galleryImages};

        // If new product
        (toEdit === true) ? saveProductAction({ productId : productID , payload }) : saveProductAction(payload);
    }

    return (
        <Container maxWidth="lg" id="product-form-container">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Paper className="product-form">
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
                                        { upSellsProductsDataReady      && <ProductsAutoComplete fieldLabel="UpSells" currentProduct={upSellsProducts} onChangeAuto={(upsellsvalue) => setUpSellsProducts(upsellsvalue)}/> }
                                    </div>
                                    <div className="autocomplete-container">
                                        { crossSellsProductsDataReady   && <ProductsAutoComplete fieldLabel="Cross-Sells"  currentProduct={crossSellsProducts} onChangeAuto={(crosssellsvalue) => setCrossSellsProducts(crosssellsvalue)} /> }
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
                                                : <ButtonUploadImage typeImage="thumbnail" onChange ={ (thumbnail) => handleThumbnailProduct(thumbnail.target.files[0],'thumbnail') } /> }
                            </div>    
                        </Paper>
                        <Paper className="product-form" elevation={2}>
                            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                Product Gallery 
                            </Typography>
                            <Divider className="paper-divider" />
                            <ul className="product-gallery">
                                { productGallery.map((image,i)=> (<li key={i}><EditableImage imageObject={image} removeImageFunc={() => removeGallery(image)} /></li>) ) }
                                <li>
                                    <ButtonUploadImage typeImage="gallery"  onChange ={ (var2) => handleProductGallery(var2) } />
                                </li>
                            </ul>    
                        </Paper>
                        <Paper className="product-form">
                            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                Categories
                            </Typography>
                            <Divider className="paper-divider" />
                            { renderCategoriesList() }
                            
                        </Paper>
                        <Paper id="product-tags" className="product-form">
                            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                Product Tags
                            </Typography>
                            <Divider className="paper-divider" />
                            {/* <div>
                                {productTags.length > 0 && productTags.map((data,i) => {
                                    return (
                                    <Chip
                                        key={i}
                                        label={data.name}
                                        onDelete={handleDeleteTag(data)}
                                        color="primary"
                                        className="product-tag"
                                    />
                                    );
                                })}
                            </div> */}
                            <div>
                                <FormControl className="form-control">
                                    <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
                                    <Select
                                        labelid="demo-mutiple-chip-label"
                                        id="demo-mutiple-chip"
                                        multiple
                                        value={productTags}
                                        onChange={(event) => setProductTags(event.target.value)}
                                        input={<Input id="select-multiple-chip" />}
                                        renderValue={productTags => (
                                            <div className="chips">
                                                {productTags.map(tag => (
                                                    <Chip key={tag.id} label={tag.name}  className="product-tag" color="primary"  />
                                                ))}
                                            </div>
                                        )}
                                        MenuProps={MenuProps}
                                        >
                                        { WOO_TAGS.map(tag => (
                                            <MenuItem key={tag.id} value={tag} >
                                                {tag.name}
                                            </MenuItem>
                                        )) }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="add-tag">
                                <TextField
                                    id="product-name"
                                    inputRef={tagInput}
                                    onKeyDown={(e)=>handleAddTag(e)}
                                    label="Add New Tag"
                                    fullWidth={true}
                                />
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
    ); 
}

const mapStateToProps = ({ USER , WOO_CATEGORIES , WOO_TAGS }) => ({ USER , WOO_CATEGORIES , WOO_TAGS });

export default   connect(mapStateToProps)(ProductForm) ;
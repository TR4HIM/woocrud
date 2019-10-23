import React , {useState , useRef , useEffect } from 'react';
import {connect} from 'react-redux';
import {    
        Container, 
        Grid , 
        Paper , 
        TextField , 
        FormControlLabel , 
        Switch , Typography , Checkbox ,
        Divider , Chip , Button ,
        ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails} from '@material-ui/core';

import Icon from '@material-ui/core/Icon';
import ProductsAutoComplete from '../../components/input-autocomplete/InputAutocomplete';
import ButtonUploadImage from '../../components/button-upload/ButtonUpload';
import EditableImage from '../../components/editable-image/EditableImage';

const ProductForm = ({dispatch , USER , WOO_CATEGORIES , WOO_TAGS,  toEdit=false , productData=null}) =>  {

    const tagInput = useRef(null);

    const [productName,setProductName]                      = useState("");
    const [productDescription,setProductDescription]        = useState("");
    const [shortProductDescription,setShortProductDescription]        = useState("");
    const [regularPrice,setRegularPrice]                    = useState(0);
    const [salePrice,setSalePrice]                          = useState(0);
    const [sku,setSku]                                      = useState("");
    const [published,setPublished]                          = useState(false);
    const [virtual,setVirtual]                              = useState(false);
    const [downloadable,setDownloadable]                    = useState(false);
    const [upSellsProducts,setUpSellsProducts]              = useState([]);
    const [crossSellsProducts,setCrossSellsProducts]        = useState([]);
    const [productImage,setProductImage]                    = useState(false);
    const [productGallery,setProductGallery]                = useState([]);
    const [productTags, setProductTags]                     = useState(WOO_TAGS);
    const [productCategories, setProductCategories]                 = useState(WOO_CATEGORIES);
    const [getProductCategories, setGetProductCategories]           = useState([]);

    useEffect(()=>{
        if(toEdit === true){
            const isPublished = (productData.status == "publish") ? true : false;
            let galleryImages = productData.images.map(img => img.src);
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
            setProductGallery(galleryImages);
            setPublished(isPublished);
        }
    },[]);

    useEffect(() => {
        if(toEdit === true){
            if(getProductCategories.length > 0){
                const tmpCats = getProductCategories.map(category => ({
                    ...category,
                    selected: true
                }));
                const selectedCategories = [...WOO_CATEGORIES.filter(item1 => !tmpCats.find(item2 => item1.id === item2.id)), ...tmpCats]
                setProductCategories(selectedCategories);
            }
        }
    }, [getProductCategories]);

    useEffect(()=>{
        tagInput.current.value = "";
    },[productTags]);

    const handleAddTag = (e) => {
        if(tagInput.current.value.trim() != '' && e.keyCode === 13){
            setProductTags(currentTags => [...currentTags, {name: tagInput.current.value }]);
        }
    }

    const handleDeleteTag = chipToDelete => () => {
        setProductTags(chips => chips.filter(chip => chip.name !== chipToDelete.name));
    };

    const checkCategory = index => {
        const newCategoryList = [...productCategories]; 
        newCategoryList[index].selected = ! newCategoryList[index].selected;
        setProductCategories(newCategoryList);
    };

    const renderCategoriesList = () => {
        return(
            productCategories.map((category,i)=>(
                <FormControlLabel
                    control={ <Checkbox checked={category.selected} 
                    onChange={() => checkCategory(i) } value={category.selected} /> }
                    label={category.name}
                    key={i}
                />)
            )  
        )
    }

    const handleUploadThumbnail = (thumbnail) => {
        setProductImage(thumbnail.target.files[0]);
    }

    const handleProductGallery = (gallery) => {
        const selectedImages = gallery.target.files;
        setProductGallery( currentGallery => [...currentGallery,  ...selectedImages ]);
    }

    const removeGallery = (imageToDelete) => {
        setProductGallery(imagesGallery => imagesGallery.filter(image => image.name !== imageToDelete.name));
    }

    return (
        <Container maxWidth="lg">
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
                                margin="normal"
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
                                        <ProductsAutoComplete fieldLabel="UpSells" onChangeAuto={(upsellsvalue) => setUpSellsProducts(upsellsvalue)}/>
                                    </div>
                                    <div className="autocomplete-container">
                                        <ProductsAutoComplete fieldLabel="Cross-Sells"  onChangeAuto={(crosssellsvalue) => setCrossSellsProducts(crosssellsvalue)} />
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <Paper className="product-form">
                            <Button variant="contained" color="primary">
                                { (toEdit === true) ? "Save Porduct" : "Add Product" } 
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
                                {/* To be diccussed with MEhdi */}
                                { productImage  ? <EditableImage imageObject={productImage} removeImageFunc={() => setProductImage(false)} /> 
                                                : <ButtonUploadImage typeImage="thumbnail" onChange ={ (var1) => handleUploadThumbnail(var1) } /> }
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
                            <div>
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
                            </div>
                            <div className="add-tag">
                                <TextField
                                    id="product-name"
                                    inputRef={tagInput}
                                    onKeyDown={(e)=>handleAddTag(e)}
                                    label="Add Tag"
                                    fullWidth={true}
                                />
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
    ); 
}

const mapStateToProps = ({ USER , WOO_CATEGORIES , WOO_TAGS  }) => ({ USER , WOO_CATEGORIES , WOO_TAGS });

export default   connect(mapStateToProps)(ProductForm) ;
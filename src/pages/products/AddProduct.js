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

import {loading } from '../../store/actions/';

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer'; 
import ProductsAutoComplete from '../../components/input-autocomplete/InputAutocomplete'; 
import ButtonUploadImage from '../../components/button-upload/ButtonUpload'; 
import EditableImage from '../../components/editable-image/EditableImage'; 


const AddProduct = ({dispatch , USER}) =>  {

    const tagInput = useRef(null);

    const [published,setPublished]                          = useState(false);
    const [virtual,setVirtual]                              = useState(false);
    const [downloadable,setDownloadable]                    = useState(false);
    const [upSellsProducts,setUpSellsProducts]              = useState([]);
    const [crossSellsProducts,setCrossSellsProducts]        = useState([]);
    const [productImage,setProductImage]                    = useState(false);
    const [productGallery,setProductGallery]                = useState([]);
    const [productTags, setProductTags]                     = useState([
        { label: 'Angular' },
        { label: 'jQuery' },
        { label: 'Polymer'},
        { label: 'React' },
        { label: 'Vue.js' },
    ]);
    const [productCategories, setProductCategories]         = useState([
        { label: 'Angular', selected : true },
        { label: 'jQuery', selected : false },
        { label: 'Polymer', selected : true },
        { label: 'React', selected : false },
        { label: 'Vue.js', selected : false },
    ]);

    useEffect(()=>{
        tagInput.current.value = "";
    },[productTags]);
    
    const handleUploadThumbnail = (thumbnail) => {
        setProductImage(thumbnail.target.files[0]);
    }

    const handleProductGallery = (gallery) => {
        const selectedImages = gallery.target.files;
        setProductGallery( currentGallery => [...currentGallery,  ...selectedImages ]);
    }

    const handleAddTag = (e) => {
        if(tagInput.current.value.trim() != '' && e.keyCode === 13){
            setProductTags(currentTags => [...currentTags, {label: tagInput.current.value }]);

        }
    }

    const handleDelete = chipToDelete => () => {
        setProductTags(chips => chips.filter(chip => chip.label !== chipToDelete.label));
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
                    label={category.label}
                    key={i}
                />)
            )  
        )
    }

    const removeGallery = (imageToDelete) => {
        setProductGallery(imagesGallery => imagesGallery.filter(image => image.name !== imageToDelete.name));
    }

    return (
        <div id="add-product-page">
            <Header />
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
                            />
                            <TextField
                                id="regular-price"
                                label="Regular Price"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                id="sales-price"
                                label="Sales Price"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                id="product-sku"
                                label="SKU"
                                className="default-input"
                                variant="outlined"
                                margin="normal"
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
                                        label="Product Description"
                                        className="default-wysiwyg" 
                                        margin="normal"
                                        variant="outlined"
                                        multiline
                                        rows="8"
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
                                Add Product
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
                                {productTags.map((data,i) => {
                                    return (
                                    <Chip
                                        key={i}
                                        label={data.label}
                                        onDelete={handleDelete(data)}
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
            <Footer />
        </div>
    ); 
}

const mapStateToProps = ({ USER  }) => ({ USER });

export default   connect(mapStateToProps)(AddProduct) ;
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
import ProductsAutoComplete from '../../components/products-autocomplete/ProductAutocomplete'; 


const AddProduct = ({dispatch , USER}) =>  {

    const tagInput = useRef(null);

    const [published,setPublished]           = useState(true);
    const [upSellsProducts,setUpSellsProducts]           = useState([]);
    const [crossSellsProducts,setCrossSellsProducts]     = useState([]);
    const [productImage,setProductImage]     = useState(false);
    const [productGallery,setProductGallery] = useState([1,2,3,4,5]);
    const [chipData, setChipData] = useState([
        { label: 'Angular' },
        { label: 'jQuery' },
        { label: 'Polymer' },
        { label: 'React' },
        { label: 'Vue.js' },
    ]);

    const handleDelete = chipToDelete => () => {
        setChipData(chips => chips.filter(chip => chip.label !== chipToDelete.label));
    };
    
    const handleUpload = (e) => {
        console.log(URL.createObjectURL(e.target.files[0]));
        setProductImage(URL.createObjectURL(e.target.files[0]));
    }
    const addImageHolder = () => {
        return(
            <div className="upload-image-holder">
                <input accept="image/*"  id="outlined-button-file" multiple type="file" className="hide-upload-input" onChange={ handleUpload }/>
                <span>
                    <label htmlFor="outlined-button-file">
                        <Icon fontSize="large" color="primary">add_circle</Icon>
                    </label>
                </span>
            </div>
        );
    }

    const productImageContainer = () => {
        return(
            <div className="product-image">
                <div>
                    <span className="remove-image" onClick={removeImage}>
                        <Icon>remove_circle</Icon>
                    </span>
                    <img src={ productImage ? productImage : `${process.env.PUBLIC_URL}/img/logo.png` } />
                </div>
            </div>
        );
    }

    const removeImage = () => {
        setProductImage(false);
    }

    useEffect(()=>{
        console.log('Go');
        tagInput.current.value = "";
    },[chipData])

    const keyPressHandler = (e) => {
        // console.log(tagInput.current.value)
        if(tagInput.current.value.trim() != '' && e.keyCode === 13){
            // dispatch(loading(true, "header-loader"));
            setChipData(oldArray => [...oldArray, {label: tagInput.current.value }]);
        }
    }

    return (
        <div id="add-product-page">

            <Header />
            
            <Container maxWidth="lg" >
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
                                        Product Advanced Details
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={published} onChange={() => setPublished(!published)} value="checkedA" />
                                        }
                                        label="Virtual"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={published} onChange={() => setPublished(!published)} value="checkedA" />
                                        }
                                        label="Downloadable"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={published} onChange={() => setPublished(!published)} value="checkedA" />
                                        }
                                        label="Virtual"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={published} onChange={() => setPublished(!published)} value="checkedA" />
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
                            <div className="feathured-image">
                                { productImage ? productImageContainer() : addImageHolder() }
                            </div>    
                        </Paper>
                        <Paper className="product-form" elevation={2}>
                            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                Product Gallery 
                            </Typography>
                            <Divider className="paper-divider" />
                            <ul className="product-gallery">
                                { productGallery.map((i)=> (<li key={i}> { productImageContainer() } </li>) ) }
                                <li>
                                    { addImageHolder() }
                                </li>
                            </ul>    
                        </Paper>
                        <Paper className="product-form">
                            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                Categories
                            </Typography>
                            <Divider className="paper-divider" />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={published} onChange={() => setPublished(!published)} value="checkedA" />
                                }
                                label="Action"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={published} onChange={() => setPublished(!published)} value="checkedA" />
                                }
                                label="Comedy"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={published} onChange={() => setPublished(!published)} value="checkedA" />
                                }
                                label="Drama"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={published} onChange={() => setPublished(!published)} value="checkedA" />
                                }
                                label="Love"
                            />
                        </Paper>
                        <Paper id="product-tags" className="product-form">
                            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                                Product Tags
                            </Typography>
                            <Divider className="paper-divider" />
                            <div>
                                {chipData.map((data,i) => {
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
                                    onKeyDown={(e)=>keyPressHandler(e)}
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
import React , {useState , useRef , useEffect } from 'react';
import {connect} from 'react-redux';
import {    
        Container, 
        Grid , 
        Paper , 
        TextField , 
        FormControlLabel , 
        Switch , Typography , Checkbox ,
        Divider , Chip , 
        ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer'; 

const AddProduct = ({dispatch , USER}) =>  {

    const tagInput = useRef(null);

    const [published,setPublished]           = useState(true);
    const [productImage,setProductImage]     = useState(false);
    const [productGallery,setProductGallery] = useState([1,2,3,4,5]);
    const [chipData, setChipData] = useState([
        { label: 'Angular' },
        { label: 'jQuery' },
        { label: 'Polymer' },
        { label: 'React' },
        { label: 'Vue.js' },
    ]);

    useEffect(() => {
        tagInput.current.value = null;
    }, [chipData]);

    const handleDelete = chipToDelete => () => {
        setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
    };
    
    const addImageHolder = () => {
        return(
            <div className="upload-image-holder">
                <span onClick={() => setProductImage(!productImage)}>
                    <Icon fontSize="large" color="primary">add_circle</Icon>
                </span>
            </div>
        );
    }

    const productImageContainer = () => {
        return(
            <div className="product-image">
                <div>
                    <span className="remove-image">
                        <Icon>remove_circle</Icon>
                    </span>
                    <img src={`${process.env.PUBLIC_URL}/img/logo.png`} />
                </div>
            </div>
        );
    }

    const keyPressHandler = (e) => {
        // console.log(tagInput)
        if(e.keyCode === 13){
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
                            />
                            <TextField
                                id="product-description"
                                label="Product Description"
                                className="default-wysiwyg" 
                                margin="normal"
                                variant="outlined"
                                multiline
                                rows="8"
                            />
                        </Paper>
                        <div>
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
                        </div>
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
                        <Paper className="product-form">
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
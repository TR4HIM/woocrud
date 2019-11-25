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
import { loading , storeWooTags , storeWooCategories , deleteWooProudct} from '../../store/actions/';
import API from '../../API/'; 
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect } from 'react-router';

const FormTags = ({dispatch , USER , WOO_TAGS ,  toEdit=false , updateSelectedTags , currentTags }) =>  {

    const tagInput = useRef(null);
    const categoryInput = useRef(null);

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

    const [addNewTagActive, setAddNewTagActive]                             = useState(false);
    const [addNewCategoryActive, setAddNewCategoryActive]                   = useState(false);
    const [isProductDeleted, setIsProductDeleted]                           = useState(false);

    const [ isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
    const [ isTagsLoaded,setIsTagsLoaded] = useState(false);

    
 
    useEffect(()=>{
        if(toEdit){
            setProductTags([...currentTags.map((tg)=>tg.id)]);
        }
    },[])
    
    useEffect(()=>{
        if(WOO_TAGS.length > 0)
            setWooStoreTags(JSON.parse(JSON.stringify(WOO_TAGS)));
        
    },[WOO_TAGS])

    useEffect(()=>{
        console.log(productTags)
        const seleTags = wooStoreTags.filter(item1 => productTags.find(item2 => item1.id === item2)); 
        console.log(seleTags)
        updateSelectedTags(seleTags);
    },[productTags])
    
    useEffect(() => {
        if(WOO_TAGS.length <= 0){
            API.WC_getWooTags(USER.token)
            .then((result)=>{
                if( result !== undefined ){
                    dispatch(storeWooTags(result));
                    setWooStoreTags(JSON.parse(JSON.stringify(result)));
                }
                dispatch(loading(false, "header-loader"));

            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
                dispatch(loading(false, "header-loader"));
            })
        }
        else
            setIsTagsLoaded(true);
    }, []);

    useEffect(()=>{
        if(addNewTagActive)
            tagInput.current.value = "";
    },[productTags])
    
    const addTagToWoo = (payload) => {
        API.WC_createWooTags(USER.token,payload).then((data)=>{ 
            console.log(data);
            setWooStoreTags([...wooStoreTags,data]);
            setProductTags(currentTags => [...currentTags, data.id]);
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
            if(wooStoreTags.length > 0 && productTags.indexOf(wooStoreTags[0].id) !== -1){
                tagInput.current.value = "";
                console.log('Here')
                return;
            }
            if(wooStoreTags.length > 0){
                setProductTags(currentTags => [...currentTags, wooStoreTags[0].id])
                console.log('Here2')
                tagInput.current.value = "";
            }
            else {
                addTagToWoo({name : tagInput.current.value.trim()});
            }

        }
    }

    const handleOnChangeTag = (event) => {
        let newValue = event.target.value;
        setProductTags([...newValue])
    }

    const tagChips = () => {
        const seleTags = wooStoreTags.filter(item1 => productTags.find(item2 => item1.id === item2)); 
        return seleTags.map(tag => (<Chip key={tag.id} label={tag.name}  className="product-tag" color="primary"  />))
    }
    return (
        <Paper id="product-tags" className="product-form">
            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                Product Tags
            </Typography>
            <Divider className="paper-divider" />
            <div>
                <FormControl className="form-control">
                    <InputLabel id="demo-mutiple-chip-label">
                        Select Product Tags
                    </InputLabel>
                    <Select
                        labelid="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={[...productTags]}
                        onChange={(event) => handleOnChangeTag(event)}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={productTagsValue => (
                            <div className="chips">
                                {tagChips()}
                            </div>
                        )}
                        >
                        { wooStoreTags.length && wooStoreTags.map(tag => (
                            <MenuItem key={tag.id} value={tag.id} >
                                {tag.name}
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
            </div>
            <div className="add-tag">
                {(addNewTagActive) ? <TextField id="tag-name" inputRef={tagInput} onKeyDown={(e)=>handleAddTag(e)} label="Create New Tag" fullWidth={true} />
                                    : <Button variant="outlined" color="secondary" onClick={()=>setAddNewTagActive(true)}>Create New Tag</Button>}
            </div>
        </Paper>
    ); 
}

const mapStateToProps = ({ USER , WOO_TAGS }) => ({ USER , WOO_TAGS });

export default   connect(mapStateToProps)(FormTags) ;
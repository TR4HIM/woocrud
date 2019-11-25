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
import FormTags from '../../components/form-tags/FormTags';
import { loading , storeWooTags , storeWooCategories , deleteWooProudct} from '../../store/actions/';
import API from '../../API/'; 
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect } from 'react-router';

const FormCategories = ({dispatch , USER , WOO_CATEGORIES  ,  toEdit=false , currentCategories=null , updateSelectedCategories}) =>  {

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
    const [ isCurrentCategories, setIsCurrentCategories] = useState(false);
    const [ isTagsLoaded,setIsTagsLoaded] = useState(false);

    
    useEffect(()=>{
        if(WOO_CATEGORIES.length > 0)
            setWooStoreCategories(JSON.parse(JSON.stringify(WOO_CATEGORIES)));
    },[WOO_CATEGORIES])

   

    useEffect(()=>{
        if(currentCategories.length > 0){
            setGetProductCategories(currentCategories);
        }
    },[])

    useEffect(() => {
        if(toEdit === true ){
            if(getProductCategories.length > 0 && WOO_CATEGORIES.length > 0 ){
                const tmpCats = getProductCategories.map(category => ({
                    ...category,
                    selected: true
                }));
                const selectedCategories = [...WOO_CATEGORIES.filter(item1 => !tmpCats.find(item2 => item1.id === item2.id)), ...tmpCats];
                setWooStoreCategories([...selectedCategories]);
            }
        }
        if(addNewCategoryActive)
            categoryInput.current.value = "";
    }, [getProductCategories, WOO_CATEGORIES]);

    useEffect(()=>{
        // const seleTags = wooStoreTags.filter(item1 => productTags.find(item2 => item1.id === item2)); 
        if(wooStoreCategories.length > 0 && WOO_CATEGORIES.length > 0){
            const payloadCategories = wooStoreCategories.filter(cat => cat.selected ).map(c => ({id : c.id}));
            updateSelectedCategories(payloadCategories);
        }
    },[wooStoreCategories , WOO_CATEGORIES])

    useEffect(() => {
        if(WOO_CATEGORIES.length <= 0){
            API.WC_getWooCategories(USER.token)
            .then((result)=>{
                if( result !== undefined ){
                    const productCategories = result.map(category => ({
                        ...category,
                        selected: false
                    }));
                    dispatch(storeWooCategories(productCategories));
                    setIsCategoriesLoaded(true)
                }
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
            })
        }
        else
            setIsCategoriesLoaded(true)
    }, []);

    const addCategoryToWoo = (payload) => {
        API.WC_createWooCategories(USER.token,payload).then((data)=>{ 
            setGetProductCategories(currentTags => [...currentTags, {...data,selected:true}]);
            dispatch(storeWooCategories([...wooStoreCategories, {...data,selected:false}]));
            dispatch(loading(false, "header-loader"));
            categoryInput.current.value = "";
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

    const handleAddCategory = (e) => {
        if(categoryInput.current.value.trim() !== '' && e.keyCode === 13){
            let cat    = wooStoreCategories.filter(cat => cat.name.toLowerCase() === categoryInput.current.value.trim().toLowerCase() ).map(t => ({...t}));

            if(cat.length > 0){
                categoryInput.current.value = "";
                let  newCategoryList = wooStoreCategories.map(function(category) {
                    if (category.id === cat[0].id) category.selected = true;
                    return category;
                });
                setWooStoreCategories(newCategoryList);
            }
            else 
                addCategoryToWoo({name : categoryInput.current.value.trim()});

        }
    }

    const checkCategory = cat => {
        let  newCategoryList = wooStoreCategories.map(function(category) {
            if (category.id === cat.id) category.selected = !category.selected;
            return category;
        });
        setWooStoreCategories([...newCategoryList]);
    }

    const renderCategoriesList = () => {
        return(
            wooStoreCategories.map((category,i)=>(
                <FormControlLabel
                    control={ <Checkbox checked={category.selected} 
                    onChange={() => checkCategory(category) } value={category.selected} /> }
                    label={category.name}
                    key={category.id}
                />)
            )  
        )
    }

    return (
        <Paper className="product-form">
            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                Categories
            </Typography>
            <Divider className="paper-divider" />
            { wooStoreCategories.length && renderCategoriesList() }
            <div className="add-tag">
                {(addNewCategoryActive) ? 
                    <TextField id="product-name" inputRef={categoryInput} onKeyDown={(e)=>handleAddCategory(e)} label="Create New Category" fullWidth={true} />
                    : <Button variant="outlined" color="secondary" onClick={()=>setAddNewCategoryActive(true)}>Create New Category</Button>}
            </div>
        </Paper>
    ); 
}

const mapStateToProps = ({ USER , WOO_CATEGORIES }) => ({ USER , WOO_CATEGORIES });

export default   connect(mapStateToProps)(FormCategories) ;
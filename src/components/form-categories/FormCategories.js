import React , {useState , useRef , useEffect } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {    
        Paper , 
        TextField , 
        FormControlLabel , 
        Typography , Checkbox ,
        Divider , Button } from '@material-ui/core';
import { loading  , storeWooCategories } from '../../store/actions/';
import { store as notifStore} from 'react-notifications-component';
import API from '../../API/'; 
import Loader from '../loader/loader';

const FormCategories = ({dispatch , USER , WOO_CATEGORIES  ,  toEdit=false , currentCategories=null , updateSelectedCategories}) =>  {

    const categoryInput = useRef(null);

    const [wooStoreCategories, setWooStoreCategories]                       = useState([]);
    const [getProductCategories, setGetProductCategories]                   = useState([]);
    const [addNewCategoryActive, setAddNewCategoryActive]                   = useState(false);
    
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
                }
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
            })
        }
    }, []);

    const addCategoryToWoo = (payload) => {
        dispatch(loading(true, "add-category-loading"));
        API.WC_createWooCategories(USER.token,payload).then((data)=>{ 
            setGetProductCategories(currentTags => [...currentTags, {...data,selected:true}]);
            dispatch(storeWooCategories([...wooStoreCategories, {...data,selected:false}]));
            dispatch(loading(false, "add-category-loading"));
            categoryInput.current.value = "";
            notifStore.addNotification({
                message: "New category has been added" ,
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
            dispatch({
                type : "ERROR",
                payload : error
            });
            // HIDE LOADING
            dispatch(loading(false, "add-category-loading"));
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
        <Paper id="add-category-form" className="product-form">
            <Loader id="add-category-loading"  type="linear" />
            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                Categories
            </Typography>
            <Divider className="paper-divider" />
            { wooStoreCategories.length > 0 && renderCategoriesList() }
            <div className="add-tag">
                {(addNewCategoryActive) ? 
                    <TextField id="product-name" inputRef={categoryInput} onKeyDown={(e)=>handleAddCategory(e)} label="Create New Category" fullWidth={true} />
                    : <Button variant="outlined" color="secondary" onClick={()=>setAddNewCategoryActive(true)}>Create New Category</Button>}
            </div>
        </Paper>
    ); 
}

FormCategories.propTypes = {
    toEdit : PropTypes.bool,
    currentCategories : PropTypes.array,
    updateSelectedCategories : PropTypes.func
}

const mapStateToProps = ({ USER , WOO_CATEGORIES }) => ({ USER , WOO_CATEGORIES });

export default   connect(mapStateToProps)(FormCategories) ;
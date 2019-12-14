import React , {useState , useRef , useEffect } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {    
        Paper , Input ,
        TextField , Select , FormControl ,
        Typography , Divider , Chip , Button } from '@material-ui/core';
import { loading , storeWooTags} from '../../store/actions/';
import API from '../../API/'; 
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { store as notifStore} from 'react-notifications-component';
import Loader from '../loader/loader';

const FormTags = ({dispatch , USER , WOO_TAGS ,  toEdit=false , currentTags , updateSelectedTags }) =>  {

    const tagInput = useRef(null);
    const [wooStoreTags, setWooStoreTags]                                   = useState([]);
    const [productTags, setProductTags]                                     = useState([]);
    const [addNewTagActive, setAddNewTagActive]                             = useState(false);
    const [isTagsLoaded,setIsTagsLoaded] = useState(false);
    const [chipsSelectedTags,setChipsSelectedTags] = useState(false);
 
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
        if(wooStoreTags.length > 0 && productTags.length > 0){
            const seleTags = wooStoreTags.filter(item1 => productTags.find(item2 => item1.id === item2)); 
            updateSelectedTags(seleTags);
        }
    },[productTags , wooStoreTags])
    
    useEffect(() => {
        if(WOO_TAGS.length <= 0){
            API.WC_getWooTags(USER.token)
            .then((result)=>{
                if( result !== undefined ){
                    dispatch(storeWooTags(result));
                    setWooStoreTags(JSON.parse(JSON.stringify(result)));
                }
                dispatch(loading(false, "add-tag-loading"));

            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
                dispatch(loading(false, "add-tag-loading"));
            })
        }
    }, []);

    useEffect(()=>{
        if(addNewTagActive)
            tagInput.current.value = "";
    },[productTags])
    
    useEffect(()=>{
        if(wooStoreTags.length > 0 && productTags.length > 0){
            const seleTags = wooStoreTags.filter(item1 => productTags.find(item2 => item1.id === item2)); 
            setChipsSelectedTags(seleTags)
            setIsTagsLoaded(true);
        }
        
    },[wooStoreTags,productTags])

    const addTagToWoo = (payload) => {
        dispatch(loading(true, "add-tag-loading"));
        API.WC_createWooTags(USER.token,payload).then((data)=>{ 
            setProductTags(currentTags => [...currentTags, data.id]);
            setWooStoreTags([...wooStoreTags,data]);
            dispatch(storeWooTags([...WOO_TAGS, data]));
            dispatch(loading(false, "add-tag-loading"));
            notifStore.addNotification({
                message: "New tag has been added" ,
                container: "top-right",
                type: "success",
                width: 400,
                dismiss: {
                  duration: 2000,
                  onScreen: true
                }
            });
        })
        .catch((error)=>{
            console.log(error)
            dispatch({
                type : "ERROR",
                payload : error
            });
            dispatch(loading(false, "add-tag-loading"));
        })
    }

    const handleAddTag = (e) => {
        if(tagInput.current.value.trim() !== '' && e.keyCode === 13){
            let wooStoreTags    = WOO_TAGS.filter(tag => tag.name === tagInput.current.value.trim() ).map(t => ({id : t.id , name : t.name}));
            if(wooStoreTags.length > 0 && productTags.indexOf(wooStoreTags[0].id) !== -1){
                tagInput.current.value = "";
                return;
            }
            if(wooStoreTags.length > 0){
                setProductTags(currentTags => [...currentTags, wooStoreTags[0].id])
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
        return chipsSelectedTags.map(tag => (<Chip key={tag.id} label={tag.name}  className="product-tag" color="primary"  />))
    }
    return (
        <Paper id="product-tags" className="product-form">
            <Loader id="add-tag-loading"  type="linear" />
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
                                { isTagsLoaded && tagChips()}
                            </div>
                        )}
                        >
                        { wooStoreTags.length > 0 && wooStoreTags.map(tag => (
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

FormTags.propTypes = {
    toEdit : PropTypes.bool,
    currentTags : PropTypes.array,
    updateSelectedTags : PropTypes.func
}

const mapStateToProps = ({ USER , WOO_TAGS }) => ({ USER , WOO_TAGS });

export default   connect(mapStateToProps)(FormTags) ;
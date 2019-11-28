import React , {useState , useRef , useEffect } from 'react';
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

import Icon from '@material-ui/core/Icon';
import ProductsAutoComplete from '../../components/input-autocomplete/InputAutocomplete';
import ButtonUploadImage from '../../components/button-upload/ButtonUpload';
import EditableImage from '../../components/editable-image/EditableImage';
import FormTags from '../../components/form-tags/FormTags';
import FormCategories from '../../components/form-categories/FormCategories';
import { loading , deleteWooProudct} from '../../store/actions/';
import API from '../../API/'; 
import { Redirect } from 'react-router';

const FormGallery = ({dispatch , USER ,  toEdit=false , currentGallery=null , updateProductGallery}) =>  {

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
    const [productTags, setProductTags]                                     = useState([]);
    const [wooStoreCategories, setWooStoreCategories]                       = useState([]);
    const [getProductCategories, setGetProductCategories]                   = useState([]);
    const [isThumbnailUploade,setIsThumbnailUploade]                        = useState(false);
    const [tmpUploadedImageUrl,setTmpUploadedImageUrl]                      = useState("");
    const [productDeletedImages, setProductDeletedImages]                   = useState([]);
    const [isProductDeleted, setIsProductDeleted]                           = useState(false);
    const [ isEditedProductLoaded,setIsEditedProductLoaded]                 = useState(false);

    const [uploadingProductImage,setUploadingProductImage]                        = useState(false);


    useEffect(()=>{
        if(toEdit){
            setProductGallery([...currentGallery]);
        }
    },[])

    useEffect(()=>{
        if(isThumbnailUploade && tmpUploadedImageUrl !== ""){
            const productGalleryObj = productGallery.map(a => a.isUloading === true ? { ...a, isUloading : false , sourceUrl : tmpUploadedImageUrl} : a);
            setProductGallery(productGalleryObj);
            setTmpUploadedImageUrl(""); 
            setIsThumbnailUploade(false);
        }
    },[productGallery,isThumbnailUploade])

    useEffect(()=>{
        if(productGallery.length > 0)
            updateProductGallery(productGallery)
    },[productGallery]);

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
            dispatch(loading(false, "header-loader"));
        })
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

    return (
        <Paper className="product-form" elevation={2}>
            <Typography variant="subtitle2" className="paper-title" gutterBottom>
                Product Gallery 
            </Typography>
            <Divider className="paper-divider" />
            <ul className="product-gallery">
                { productGallery.map((image,i)=> (<li key={i}><EditableImage multiple={true} imageObject={image} removeImageFunc={() => removeGallery(image)} /></li>) ) }
                <li>
                    <ButtonUploadImage multiple={true} onChange ={ (thumbnail) => setUploadingProductImage(thumbnail.target.files) }  />
                </li>
            </ul>    
        </Paper>
    ); 
}

const mapStateToProps = ({ USER }) => ({ USER });

export default   connect(mapStateToProps)(FormGallery) ;
import React , { useState , useEffect } from 'react';
import {connect} from 'react-redux';
import {    
        Paper , 
        Typography,
        Divider
    } from '@material-ui/core';

import ButtonUploadImage from '../../components/button-upload/ButtonUpload';
import EditableImage from '../../components/editable-image/EditableImage';
import { loading } from '../../store/actions/';
import API from '../../API/'; 

const FormGallery = ({dispatch , USER ,  toEdit=false , currentGallery=null , saveProductGallery}) =>  {

    const [productGallery,setProductGallery]                = useState([]);
    const [isThumbnailUploade,setIsThumbnailUploade]        = useState(false);
    const [tmpUploadedImageUrl,setTmpUploadedImageUrl]      = useState("");
    const [productDeletedImages, setProductDeletedImages]   = useState([]);
    const [isEditedProductLoaded,setIsEditedProductLoaded]  = useState(false);


    useEffect(()=>{
        if(toEdit === true){
            let galleryImages   = currentGallery.map(img => ({sourceUrl : img.src , id : img.id}));
            // Remove First Element For Featured Image :) 
            galleryImages.shift();
            setProductGallery(galleryImages);
        }
        setIsEditedProductLoaded(true);
    },[]);

    useEffect(()=>{
        if(isThumbnailUploade && tmpUploadedImageUrl !== ""){
            const productGalleryObj = productGallery.map(a => a.isUloading === true ? { ...a, isUloading : false , sourceUrl : tmpUploadedImageUrl} : a);
            setProductGallery(productGalleryObj);
            setTmpUploadedImageUrl(""); 
            setIsThumbnailUploade(false);
            saveProductGallery(productGallery);
        }
    },[productGallery,isThumbnailUploade])

    useEffect(()=>{
        if(productGallery.length > 0) 
            saveProductGallery(productGallery);
    },[productGallery])

    const uploadProductImage = (file) => {
        let imageObject = file.imageObject;
        let formData    = new FormData();

        formData.append( 'file', imageObject );
        
        dispatch(loading(true, "header-loader"));
        return API.WP_uploadImage(USER.token, formData).then((data)=>{ 
            return data;
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
                { isEditedProductLoaded && productGallery.map((image,i)=> (<li key={i}><EditableImage imageObject={image} removeImageFunc={() => removeGallery(image)} /></li>) ) }
                <li>
                    <ButtonUploadImage typeImage="gallery"  onChange ={ (var2) => handleProductGallery(var2) } />
                </li>
            </ul>    
        </Paper>
    ); 
}

const mapStateToProps = ({ USER }) => ({ USER });

export default   connect(mapStateToProps)(FormGallery) ;
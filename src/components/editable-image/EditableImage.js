import React from 'react';
import Icon from '@material-ui/core/Icon';

const EditableImage = ( { imageObject , removeImageFunc } ) => { 
    let imagePreview;
    if(typeof imageObject === "string"){
        imagePreview = imageObject;
    }else{
        if('imageObject' in imageObject) 
            imagePreview = URL.createObjectURL(imageObject.imageObject);
        else if('sourceUrl' in imageObject)
            imagePreview = imageObject.sourceUrl;
    }
    let imgUrl = imageObject ? imagePreview : `${process.env.PUBLIC_URL}/img/logo.png`;
    return(
        <div id="product-editable-image">
            <div className={`product-image ${(imageObject.isUloading === false) ? 'image-uploaded' : ''}`} >
                <div className='product-img-container' style={{backgroundImage: `url(${imgUrl})`}}>
                    <span className="remove-image" onClick={removeImageFunc}>
                        <Icon>remove_circle</Icon>
                    </span>
                    <img    className={`${(imageObject.isUloading) ? 'image-loading' : ''}`}  
                            src={ imgUrl } alt="" />
                </div>
            </div> 
        </div>
    );
}

export default EditableImage; 
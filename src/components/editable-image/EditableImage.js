import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';

const EditableImage = ( { imageObject , removeImageFunc } ) => { 
    let imagePreview;
    if(typeof imageObject === "string"){
        imagePreview = imageObject;
    }else{
        if('sourceUrl' in imageObject)
            imagePreview = imageObject.sourceUrl;
        else  if('imageObject' in imageObject) 
            imagePreview = URL.createObjectURL(imageObject.imageObject);
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

EditableImage.propTypes = {
    imageObject : PropTypes.object,
    removeImageFunc : PropTypes.func,
}

export default EditableImage; 
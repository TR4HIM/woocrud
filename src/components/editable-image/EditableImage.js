import React from 'react';
import Icon from '@material-ui/core/Icon';

const EditableImage = ( { imageObject , removeImageFunc } ) => { 
    const imagePreview = (typeof imageObject === "string") ? imageObject :  URL.createObjectURL(imageObject.imageObject);
    return(
        <div id="product-editable-image">
            <div className={`product-image ${(!imageObject.isUloading) ? 'image-uploaded' : ''}`}>
                <div>
                    <span className="remove-image" onClick={removeImageFunc}>
                        <Icon>remove_circle</Icon>
                    </span>
                    <img    className={`${(imageObject.isUloading) ? 'image-loading' : ''}`}  
                            src={ imageObject ? imagePreview : `${process.env.PUBLIC_URL}/img/logo.png` } alt="" />
                </div>
            </div> 
        </div>
    );
}

export default EditableImage; 
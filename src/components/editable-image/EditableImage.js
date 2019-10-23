import React from 'react';
import Icon from '@material-ui/core/Icon';

const EditableImage = ( { imageObject,removeImageFunc } ) => {
    const imagePreview = (typeof imageObject === "string") ? imageObject :  URL.createObjectURL(imageObject);
    return(
        <div className="product-image">
            <div>
                <span className="remove-image" onClick={removeImageFunc}>
                    <Icon>remove_circle</Icon>
                </span>
                <img src={ imageObject ? imagePreview : `${process.env.PUBLIC_URL}/img/logo.png` } />
            </div>
        </div>
    );
}

export default EditableImage; 
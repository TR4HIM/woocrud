import React from 'react';
import Icon from '@material-ui/core/Icon';

const ButtonUploadImage = ({ typeImage , onChange }) => {
  
  const inputKey = 'upload-product-image-' + typeImage;

  return (
    <div className="upload-image-holder">
        <input accept="image/*" id={inputKey} multiple={typeImage !== "thumbnail"} type="file" className="hide-upload-input" onChange={ (e) => onChange && onChange(e)   }/>
        <span>
            <label htmlFor={inputKey}>
                <Icon fontSize="large" color="primary">add_circle</Icon>
            </label>
        </span>
    </div>
  );
}

export default ButtonUploadImage; 
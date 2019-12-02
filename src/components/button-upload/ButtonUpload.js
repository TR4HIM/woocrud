import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';

const ButtonUploadImage = ({ typeImage , onChange }) => {
  
  const inputKey = 'upload-product-image-' + typeImage;

  return (
    <div className="upload-image-holder">
        <input accept="image/*" id={inputKey} multiple={typeImage !== "thumbnail"} type="file" className="hide-upload-input" onChange={ (e) => onChange && onChange(e)   }/>
        <span className="add-icon">
            <label htmlFor={inputKey}>
                <Icon fontSize="large" color="primary">add_circle</Icon>
            </label>
        </span>
    </div>
  );
}

ButtonUploadImage.propTypes = {
  typeImage : PropTypes.string,
  onChange : PropTypes.func,
}

export default ButtonUploadImage; 
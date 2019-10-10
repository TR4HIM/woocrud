import React , {useState , useRef , useEffect } from 'react';
import {connect} from 'react-redux';
import {    
        Container, 
        Grid , 
        Paper , 
        TextField , 
        FormControlLabel , 
        Switch , Typography , Checkbox ,
        Divider , Chip , 
        ExpansionPanel , ExpansionPanelSummary , ExpansionPanelDetails} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';


import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
 
const ButtonUploadImage = ({ typeImage , onChange }) => {
  
  const [selectedImage,setSelectedImage] = useState(null);
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
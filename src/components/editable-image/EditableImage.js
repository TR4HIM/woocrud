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

const EditableImage = ( { imageObject,removeImageFunc } ) => {
    const imagePreview = URL.createObjectURL(imageObject);
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
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


const suggestions = [
    { label: 'Afghanistan' },
    { label: 'Aland Islands' },
    { label: 'Albania' },
    { label: 'Algeria' },
    { label: 'American Samoa' },
    { label: 'Andorra' },
    { label: 'Angola' },
    { label: 'Anguilla' },
    { label: 'Antarctica' },
    { label: 'Antigua and Barbuda' },
    { label: 'Argentina' },
    { label: 'Armenia' },
    { label: 'Aruba' },
    { label: 'Australia' },
    { label: 'Austria' },
    { label: 'Azerbaijan' },
    { label: 'Bahamas' },
    { label: 'Bahrain' },
    { label: 'Bangladesh' },
    { label: 'Barbados' },
    { label: 'Belarus' },
    { label: 'Belgium' },
    { label: 'Belize' },
    { label: 'Benin' },
    { label: 'Bermuda' },
    { label: 'Bhutan' },
    { label: 'Bolivia, Plurinational State of' },
    { label: 'Bonaire, Sint Eustatius and Saba' },
    { label: 'Bosnia and Herzegovina' },
    { label: 'Botswana' },
    { label: 'Bouvet Island' },
    { label: 'Brazil' },
    { label: 'British Indian Ocean Territory' },
    { label: 'Brunei Darussalam' },
];


function renderSuggestion(suggestionProps) {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(value, { showEmpty = false } = {}) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;
  
    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput,
          },
          ...InputProps,
        }}
        {...other}
        
      />
    );
}

const classes = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 10,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    width:'100%'
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

const ProductsAutoComplete = ({fieldLabel , onChangeAuto}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState([]);
  

  useEffect(() => {
    if( selectedItem.length  >=   0){
      onChangeAuto(selectedItem);
    }
  }, [selectedItem]);


  const handleKeyDown = event => {
    if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
    }
  };

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };

  const handleChange = item => {
    let newSelectedItem = [...selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue('');
    setSelectedItem(newSelectedItem);
  };

  const handleDelete = item => () => {
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setSelectedItem(newSelectedItem);
  };
  return (
    <div className={classes.root}>
        <Downshift
          id="downshift-multiple"
          inputValue={inputValue}
          onChange={handleChange}
          selectedItem={selectedItem}
        >
          {({
            getInputProps,
            getItemProps,
            getLabelProps,
            isOpen,
            inputValue: inputValue2,
            selectedItem: selectedItem2,
            highlightedIndex,
          }) => {
            const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
              onKeyDown: handleKeyDown,
              placeholder: 'Select multiple countries',
            });
    
            return (
              <div className={classes.container}>
                {renderInput({
                  fullWidth: true,
                  classes,
                  label:  fieldLabel ,
                  InputLabelProps: getLabelProps(),
                  InputProps: {
                    startAdornment: selectedItem.map(item => (
                      <Chip
                        key={item}
                        tabIndex={-1}
                        label={item}
                        className={classes.chip}
                        onDelete={handleDelete(item)}
                      />
                    )),
                    onBlur,
                    onChange: event => {
                      handleInputChange(event);
                      onChange(event);
                    },
                    onFocus,
                  },
                  inputProps,
                })}
    
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {getSuggestions(inputValue2).map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.label }),
                        highlightedIndex,
                        selectedItem: selectedItem2,
                      }),
                    )}
                  </Paper>
                ) : null}
              </div>
            );
          }}
        </Downshift>
    </div>
  );
}



export default ProductsAutoComplete;  
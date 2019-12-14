import React , {useState , useEffect } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {    
        Paper , 
        TextField ,Chip} from '@material-ui/core';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import MenuItem from '@material-ui/core/MenuItem';
import { loading } from '../../store/actions/';
import API from '../../API/'; 

// API Search with Cancel
const SEARCH  = API.WC_getWooProductByName();

const renderSuggestion = (suggestionProps) => {
  const { suggestion, itemProps } = suggestionProps;
  return (
    <MenuItem
      {...itemProps}
      key={suggestion.name}
      component="div"
    >
      {suggestion.name}
    </MenuItem>
  );
}

const renderInput = (inputProps) => {
    const { InputProps,   ref, ...other } = inputProps;
  
    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: {
            root: 'page-root',
            input: 'auto-complete-input',
          },
          ...InputProps,
        }}
        {...other}
        
      />
    );
}

const ProductsAutoComplete = ({dispatch , USER , fieldLabel , onChangeAuto , currentProduct = []}) => {

    const [inputValue, setInputValue]               = useState('');
    const [selectedItem, setSelectedItem]           = useState([]);
    const [suggestionProduct, setSuggestionProduct] = useState([]);

    useEffect(() => {
      if(currentProduct.length > 0){
        getRelatedProductData(currentProduct)
      }
    }, []);

    useEffect(() => {
      if( selectedItem.length  >=   0){
        onChangeAuto(selectedItem.map(ups =>  ups.id ));
      }
    }, [selectedItem]);

    useEffect(()=>{
      if(inputValue.length > 0 ){
        getSuggestions(inputValue);
      }
    },[inputValue]);

    const getRelatedProductData = async (relatedProducts) => {
        const listProductsData = [];
        for(let i = 0; i < relatedProducts.length ; i++){
            let id = relatedProducts[i];
            await API.WC_getWooProductById(USER.token, id)
            .then((result)=>{
                if( result !== undefined && !('response' in result) ){
                  // HIDE LOADER
                  let productItem = {id:result.id, name:result.name};
                  listProductsData.push(productItem)
                }
                dispatch(loading(false, "auto-complete-loading"));
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error
                })
                // HIDE LOADING
                dispatch(loading(false, "auto-complete-loading"));
            })
        }

        setSelectedItem(listProductsData)
    }

    const getSuggestions = (value) => {
      const inputValue = deburr(value.trim()).toLowerCase();

      dispatch(loading(true, "auto-complete-loading"));

      // TO ADD : Show only unselected products
      SEARCH(USER.token,inputValue).then((result)=>{ 
        if((result !== undefined)){
          setSuggestionProduct(result);
          // HIDE LOADING
          dispatch(loading(false, "auto-complete-loading"));
        }
      })
      .catch((error)=>{
          dispatch({
              type : "ERROR",
              payload : error
          });
          // HIDE LOADING
          dispatch(loading(false, "auto-complete-loading"));
      })
    }

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
      const checkIfAdded = (element) => element.id === item.id;
      if(newSelectedItem.some(checkIfAdded) !== true){
        newSelectedItem = [...newSelectedItem, item];
      }
      setInputValue('');
      setSelectedItem(newSelectedItem);
    };

    const handleDelete = item => () => {
      const newSelectedItem = selectedItem.filter(itm => itm.id !== parseInt(item));
      setSelectedItem(newSelectedItem);
    };

  return (
    <div className="page-root">
        <Downshift
          id="product-auto-complete"
          inputValue={inputValue}
          onChange={handleChange}
          selectedItem={selectedItem}
          itemToString={item => (item ? item.name : '')}
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
              placeholder: 'Select multiple products',
            });
    
            return (
              <div className="page-container">
                {renderInput({
                  fullWidth: true,
                  label:  fieldLabel ,
                  InputLabelProps: getLabelProps(),
                  InputProps: {
                    startAdornment: selectedItem.map(item => (
                      <Chip
                        key={item.id}
                        tabIndex={-1}
                        label={item.name}
                        className="auto-complete-chip"
                        onDelete={handleDelete(item.id)}
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
                  <Paper className="auto-complete-paper" square>
                    {suggestionProduct.length > 0 && suggestionProduct.map((suggestion, index) =>{
                        const checkIfAdded = (element) => element.id === suggestion.id;
                        if(selectedItem.some(checkIfAdded) !== true){
                          return renderSuggestion({
                            suggestion,
                            index : suggestion.id,
                            itemProps: getItemProps({ item: {'id' : suggestion.id, 'name' : suggestion.name} }),
                            highlightedIndex : suggestion.id,
                            selectedItem: selectedItem2,
                          })
                        }
                      }
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

ProductsAutoComplete.propTypes = {
  fieldLabel      : PropTypes.string,
  onChangeAuto    : PropTypes.func,
  currentProduct  : PropTypes.array
}

const mapStateToProps = ({ USER }) => ({ USER });

export default connect(mapStateToProps)(ProductsAutoComplete);
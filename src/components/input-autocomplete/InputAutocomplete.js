import React , {useState , useEffect } from 'react';
import {connect} from 'react-redux';
import {    
        Paper , 
        TextField ,Chip} from '@material-ui/core';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { loading , editWooProduct, updateWooProudct} from '../../store/actions/';
import API from '../../API/'; 
import Loader from '../loader/loader';


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


  // API Search with Cancel
  const SEARCH  = API.WC_getWooProductByName();

  const renderSuggestion = (suggestionProps) => {
    const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
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

const ProductsAutoComplete = ({dispatch , USER , fieldLabel , onChangeAuto}) => {

    const [inputValue, setInputValue] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);
    const [suggestionProduct, setSuggestionProduct] = useState([]);

    useEffect(() => {
      if( selectedItem.length  >=   0){
        onChangeAuto(selectedItem);
      }
    }, [selectedItem]);

    useEffect(()=>{
      if(inputValue.length > 0 ){
        getSuggestions(inputValue);
      }
    },[inputValue]);

    const getSuggestions = (value) => {
      const inputValue = deburr(value.trim()).toLowerCase();

      dispatch(loading(true, "header-loader"));

      // TO ADD : Show only unselected products
      SEARCH(USER.token,inputValue).then((result)=>{ 
        if((result !== undefined)){
          setSuggestionProduct(result);
          // HIDE LOADING
          dispatch(loading(false, "header-loader"));
        }
      })
      .catch((error)=>{
          dispatch({
              type : "ERROR",
              payload : error
          });
          // HIDE LOADING
          dispatch(loading(false, "header-loader"));
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
      const newSelectedItem = selectedItem.filter(itm => itm[0] !== parseInt(item));
      setSelectedItem(newSelectedItem);
    };

  return (
    <div className={classes.root}>
        <Downshift
          id="downshift-multiple"
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
              <div className={classes.container}>
                {renderInput({
                  fullWidth: true,
                  classes,
                  label:  fieldLabel ,
                  InputLabelProps: getLabelProps(),
                  InputProps: {
                    startAdornment: selectedItem.map(item => (
                      <Chip
                        key={item.id}
                        tabIndex={-1}
                        label={item.name}
                        className={classes.chip}
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
                  <Paper className={classes.paper} square>
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

const mapStateToProps = ({ USER }) => ({ USER});

export default connect(mapStateToProps)(ProductsAutoComplete);
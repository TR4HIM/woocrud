import React, { useState, useEffect , Fragment } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

import {  Paper, Typography, TextField, Button, FormControl, 
          InputLabel, Select, FilledInput, MenuItem } from '@material-ui/core';

import API from '../../API/'; 

import {loading , updateUser , storeUserProfile} from '../../store/actions/';

import ToggleDisplay from 'react-toggle-display';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Slide from '@material-ui/core/Slide';

const Transition = (props) =>{
    return <Slide direction="up" {...props} />;
}

const UserSettings = ({ dispatch , USER , USER_PROFILE}) => {


        
    const [readyToLoad,setReadyToLoad]                  = useState( false)
    const [showOldPasswordField,setShowOldPasswordField]         = useState( false)
    const [oldPassword,setOldPassword]                  = useState( "")
    const [confirmationNewPassword,setConfirmationNewPassword]       = useState( "")
    const [newPassword,setNewPassword]                  = useState( "")
    const [showSubmitButton,setShowSubmitButton]             = useState( false)
    const [validEmail,setValidEmail]                   = useState( false)
    const [userEmail,setUserEmail]                   = useState(false)
    const [successPasswordChange,setSuccessPasswordChange]        = useState( false)
    const [uploading,setUploading]                    = useState( false)
    const [uploadingCover,setUploadingCover]               = useState( false)
    const [uploadingProfile,setUploadingProfile]              = useState( false)
    const [srcCover,setSrcCover]                     = useState( "")
    const [srcProfile, setSrcProfile]                    = useState( "")
    const [src,setSrc]                          = useState( null)
    const [open,setOpen]                         = useState( false)
    const [isLoaded,setIsLoaded]                         = useState(false)
            

    const t = (msg) => {
      return msg;
    }

    function componentWillMount() {
        
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            return (value !== newPassword) ? false : true;
        });
        
        ValidatorForm.addValidationRule('minChars', (value) => {
            return (value.length < 8) ? false : true;
        });
        
        ValidatorForm.addValidationRule('maxChars', (value) => {
            return (value.length > 25) ? false : true;
        });
        
        ValidatorForm.addValidationRule('isCustomEmail', (value) => {
            var regex = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
            return regex.test(value);
        });
        
    }

    useEffect(()=>{
      // SHOW LOADER
      loading(true, "header-loader");

      API.WP_getProfileInfo(USER.token, USER.id)
          .then((result)=>{
              // HIDE LOADER
              loading(false, "header-loader");
              dispatch(storeUserProfile(result));
          })
          .catch((error)=>{

              dispatch(({
                  type    : 'ERROR',
                  payload : error
              }))

              // HIDE LOADER
              loading(false, "header-loader");
          })
    },[])

    useEffect(()=>{
      if(USER_PROFILE){
        setUserEmail(USER_PROFILE.email)
        setIsLoaded(true)
      }
    },[USER_PROFILE])

    function updateProfile(property){   
        
        // IF THE EMAIL IS NOT VALID GO AWAY
        if( (property === 'userEmail') && !validEmail ) return;

        // IF THE VALUE DOESN'T CHANGED GO AWAY
        if( USER_PROFILE[property] === this.state[property] ) return;

        // SHOW LOADER
        loading(true, "header-loader");

        let data = { 
            ...USER_PROFILE,
            [property] : this.state[property]
        };

        API.WCV_updateProfileInfo(USER.token, data )
            .then((result)=>{

                storeUserProfile({
                    ...USER_PROFILE,
                    ...result
                });

                // UPDATE SHOP CATEGORIES ON REDUX STORE
                updateUser({
                    shop_categories : result.shop_categories
                });
        
                // HIDE LOADER
                loading(false, "header-loader");

            })
            .catch((error)=>{
                dispatch(({
                    type    : 'ERROR',
                    payload : error
                }))

                // HIDE LOADER
                loading(false, "header-loader");
            })
       
    }

    const handleChange = (name) => {

        

    };

    function keyPressHandler(e){

        if(e.keyCode === 13)
            e.target.blur();

    }

    function submitChangePassword(){

        loading(true, "header-loader");

        let payload = {
            id              : USER.id,
            old_password    : oldPassword,
            new_password    : newPassword
        }
        API.WCV_change_password(USER.token, payload)
            .then((result)=>{
                loading(false, "header-loader");

                this.setState({
                    successPasswordChange   : true,
                    oldPassword             : "",
                    newPassword             : "",
                    confirmationNewPassword  : "",
                    showOldPasswordField    : false 
                });
            })
            .catch((error)=>{

                dispatch(({
                    type    : 'ERROR',
                    payload : error
                }))

                // HIDE LOADER
                loading(false, "header-loader");
            })
    }
    
    function renderShopHeader(){
        let  
            croppedImageUrlProfile,
            shop_cover,
            shop_logo ;
         

        return (
            <Fragment  >
                <Paper id="shop-header-container" className="container-inner shop shop-header"  elevation={1}>
            
                    <div className="profile-cover-image">
                        <FormControl className="edit-upload-cover">
                            <input
                                accept="image/*"
                                className='hide-default-upload'
                                id="contained-cover-image"
                                type="file"
                                onChange={console.log('Trest')}
                            />
                            <label htmlFor="contained-cover-image">
                                <Button variant="outlined" color="secondary"   component="span"  className="button edit-cover-button">
                                    {t('EDIT_COVER')}
                                </Button>
                            </label>
                        </FormControl>
                        <div className="image-bl" style={{backgroundImage:`url(${shop_cover})`}}>
                            <img alt="Shop Cover" src={shop_cover} />
                        </div>
                    </div>

                    <div className="shop-brand" style={{ backgroundImage: `url(${(croppedImageUrlProfile == null) ? shop_logo : croppedImageUrlProfile})`}} >
                        <div className="shop-brand-edit" onClick={() => console.log('profile')}>
                            {t('EDIT')}
                        </div>
                    </div>
                    
                </Paper>
            </Fragment> 
        );
    }

    function renderContent(){
        
        return (
            <Fragment>
                <Paper className="container-inner user"  elevation={1}>
                    <Typography variant="h5" component="h4">{t('USER')}</Typography>
                    <TextField
                        label={t('USER_NAME')}
                        value={USER_PROFILE.user_login}
                        className="field"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="filled"
                        fullWidth
                        disabled
                    />

                    <ValidatorForm
                        forwardRef="form-email"
                        onSubmit={()=>{}}
                        onError={errors => console.log(errors)}
                    >   
                        <TextValidator
                            label={t('EMAIL')}
                            onBlur={(e)=>updateProfile('userEmail')}
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={handleChange('userEmail')}
                            name="email"
                            value={userEmail}
                            validatorListener={(valid)=>this.setState({ validEmail : valid })}
                            validators={[
                                'required', 
                                'isCustomEmail'
                            ]}
                            errorMessages={[ 
                                t('FIELD_REQUIRED'), 
                                t('EMAIL_NOT_CORRECT')
                            ]}
                            className="field"
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                    </ValidatorForm>
                            

           

                    <ValidatorForm
                        forwardRef="form"
                        onSubmit={submitChangePassword.bind(this)}
                        onError={errors => console.log(errors)}
                    >
                        <Button 
                            id="change-password" 
                            color="primary" 
                            onClick={()=>this.setState((prevState)=>({ 
                                showOldPasswordField : !prevState.showOldPasswordField, 
                                successPasswordChange : false
                            }))}
                        >
                            { !showOldPasswordField ? t('CHANGE_PASSWORD') : t('CANCEL') }
                        </Button>
                        
                        {successPasswordChange ? <p id="success-password-change">{t('PASSWORD_HAS_CHANGED')} </p> : null}

                        <ToggleDisplay show={true}>
                            <p id="helper-text">{t('MANDATORY_PASSWORD_FIELD')}</p>

                            <TextValidator
                                label={t('YOUR_OLD_PASSWORD')}
                                value={oldPassword}
                                className="field"
                                onChange={(e)=>this.setState({ oldPassword : e.target.value })}
                                type="password"
                                name="oldPassword"
                                validators={[
                                    'required'
                                ]}
                                errorMessages={[
                                    t('FIELD_REQUIRED')
                                ]}
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                        
                            <TextValidator
                                label={t('YOUR_NEW_PASSWORD')}
                                value={newPassword}
                                className="field"
                                onChange={(e)=>this.setState({ newPassword : e.target.value })}
                                type="password"
                                name="password"
                                validators={[
                                    'required', 
                                    'minChars', 
                                    'maxChars'
                                ]}
                                errorMessages={[
                                    t('FIELD_REQUIRED'),
                                    t('CHAR_MIN_LIMIT'),
                                    t('CHAR_MAX_LIMIT')
                                ]}
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextValidator
                                label={t('CONFIRME_PASSWORD')}
                                value={confirmationNewPassword}
                                className="field"
                                type="password"
                                name="repeatPassword"
                                onChange={(e)=>this.setState({ confirmationNewPassword : e.target.value })}
                                validators={[
                                    'isPasswordMatch', 
                                    'required', 
                                    'minChars', 
                                    'maxChars'
                                ]}
                                errorMessages={[
                                    t('PASSWORD_NOT_MATCH'),
                                    t('FIELD_REQUIRED'),
                                    t('CHAR_MIN_LIMIT'),
                                    t('CHAR_MAX_LIMIT')
                                ]}
                                validatorListener={(valid)=>this.setState({ showSubmitButton : valid })}
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <Button id="submit-change-password" disabled={!(showSubmitButton && oldPassword.length)} type="submit" variant="contained"  color="primary" >{t('CHANGE_PASSWORD')}</Button>                             

                        </ToggleDisplay>

                    </ValidatorForm>

                </Paper>

            </Fragment>
        )
    }
    
    return (
        <div id="profile-page">
            <Header />
            <div id="container">
                { isLoaded && renderShopHeader() }
                { isLoaded && renderContent() }
            </div>
        </div>
        
    );
}


const mapStateToProps = ({ USER , USER_PROFILE  }) => ({ USER , USER_PROFILE });

export default connect(mapStateToProps)(UserSettings);
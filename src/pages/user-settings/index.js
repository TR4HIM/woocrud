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

    const [newPassword,setNewPassword]                  = useState("")
    const [confirmationNewPassword,setConfirmationNewPassword]       = useState("")

    const [showSubmitButton,setShowSubmitButton]             = useState( false)
    const [validEmail,setValidEmail]                   = useState( false)
    const [userEmail,setUserEmail]                   = useState(false)
    const [userName,setUserName]                   = useState("")
    const [firstName,setFirstName]                   = useState("")
    const [lastName,setLastName]                   = useState("")
    const [userUrl,setUserUrl]                   = useState("")
    const [userAvatar,setUserAvatar]                   = useState("")
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

    useEffect(()=>{
      // SHOW LOADER
      dispatch(loading(true, "header-loader"));

      API.WP_getProfileInfo(USER.token, USER.id)
          .then((result)=>{
              // HIDE LOADER
              setUserName(result.username);
              setUserEmail(result.email);
              setFirstName(result.first_name);
              setLastName(result.last_name);
              setUserUrl(result.url);
              setUserAvatar(result.avatar_urls['96']);
              console.log(result)
              setIsLoaded(true)
              dispatch(loading(false, "header-loader"));
          })
          .catch((error)=>{

              dispatch(({
                  type    : 'ERROR',
                  payload : error
              }))

              // HIDE LOADER
              dispatch(loading(false, "header-loader"));
          })
    },[])

    function updateProfile(property){   
        
        // IF THE EMAIL IS NOT VALID GO AWAY
        if( (property === 'userEmail') && !validEmail ) return;

        // IF THE VALUE DOESN'T CHANGED GO AWAY
        if( USER_PROFILE[property] === this.state[property] ) return;

        // SHOW LOADER
        dispatch(loading(true, "header-loader"));

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
        
                // HIDE LOADER
                dispatch(loading(false, "header-loader"));

            })
            .catch((error)=>{
                dispatch(({
                    type    : 'ERROR',
                    payload : error
                }))

                // HIDE LOADER
                dispatch(loading(false, "header-loader"));
            })
       
    }

    function keyPressHandler(e){
        if(e.keyCode === 13)
            e.target.blur();
    }

    function submitChangePassword(){

        dispatch(loading(true, "header-loader"));

        let payload = {
            id              : USER.id,
            old_password    : oldPassword,
            new_password    : newPassword
        }
        API.WCV_change_password(USER.token, payload)
            .then((result)=>{
                dispatch(loading(false, "header-loader"));

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
                dispatch(loading(false, "header-loader"));
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
                    <div className="shop-brand" style={{ backgroundImage: `url(${userAvatar})`}} >
                        <div className="shop-brand-edit" onClick={() => console.log('Go To Gravatar.com')}>
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
                        label="User Name"
                        value={userName}
                        className="field"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        variant="filled"
                        fullWidth
                        disabled
                    />

                    <ValidatorForm
                        // forwardRef="form-email"
                        onSubmit={()=>{}}
                        onError={errors => console.log(errors)}
                    >   
                        <TextValidator
                            label={t('EMAIL')}
                            onBlur={(e)=>updateProfile('userEmail')}
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={(e) => setUserEmail(e.target.value)}
                            name="email"
                            value={userEmail}
                            validatorListener={(valid)=>setValidEmail(valid)}
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
                        <TextValidator
                            label="First Name"
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={(e) => setFirstName(e.target.value)}
                            name="first-name"
                            value={firstName}
                            className="field"
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <TextValidator
                            label="Last Name"
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={(e) => setLastName(e.target.value)}
                            name="last-name"
                            value={lastName}
                            className="field"
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <TextValidator
                            label="Website"
                            onKeyDown={(e)=>keyPressHandler(e)}
                            onChange={(e) => setUserUrl(e.target.value)}
                            name="last-name"
                            value={userUrl}
                            className="field"
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                    </ValidatorForm>
                    <ValidatorForm
                        // forwardRef="form"
                        onSubmit={submitChangePassword.bind(this)}
                        onError={errors => console.log(errors)}
                    >
                        <Button 
                            id="change-password" 
                            color="primary" 
                            onClick={()=> setShowOldPasswordField(!showOldPasswordField)}
                        >
                            { !showOldPasswordField ? "CHANGE PASSWORD" : "CANCEL" }
                        </Button>
                        
                        {successPasswordChange ? <p id="success-password-change">{t('PASSWORD_HAS_CHANGED')} </p> : null}

                        <ToggleDisplay show={showOldPasswordField}>
                            <p id="helper-text">{t('MANDATORY_PASSWORD_FIELD')}</p>

                            <TextValidator
                                label={t('YOUR_OLD_PASSWORD')}
                                value={oldPassword}
                                className="field"
                                onChange={(e)=>setOldPassword(e.target.value)}
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
                                onChange={(e)=>setNewPassword(e.target.value)}
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
                                onChange={(e)=>setConfirmationNewPassword(e.target.value)}
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
                                validatorListener={(valid)=>setShowSubmitButton(valid)}
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
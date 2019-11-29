import React from 'react';
import {connect} from 'react-redux';
import Routing from '../Routing';
import Loader from '../components/loader/loader';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Layout = ( {dispatch,ERROR}) => {

    const snackbarHandleClose = () => {
        dispatch({ type : 'HIDE_ERROR' })
    }

    const transitionRight = (props) => {
        return <Slide {...props} direction="top" />;
    }

    const renderSnackbarMessage = () => {

        let message = ((process.env.NODE_ENV !== 'production')) ? `${ERROR.code} : ${ERROR.message}` : `${ERROR.message}`;
        
        return ( <span id="message-id">{ message }</span> );
    }

    return (
        <div id="layout"> 
            {/* LOADER */}
            <Loader id="root-loader" />             
            
            {/* APP ROUTING */}
            <Routing />

            {/* SNACKBAR */}
            <Snackbar
                    id="snackbar"
                    key={new Date()}
                    anchorOrigin={{
                        vertical    : 'top',
                        horizontal  : 'center',
                    }}
                    open={ERROR.show}
                    onClose={snackbarHandleClose}
                    TransitionComponent={(props)=><Slide {...props} direction="down" />}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={renderSnackbarMessage() }
                    action={[
                        <IconButton
                          key="close"
                          aria-label="Close"
                          color="inherit"
                          onClick={snackbarHandleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                    style={{top : 10}}
                />
        </div>
    )
};

const mapStateToProps = ({ ERROR }) => ({ ERROR })

export default connect(mapStateToProps)(Layout);
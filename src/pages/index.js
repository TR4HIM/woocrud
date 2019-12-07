import React from 'react';
import {connect} from 'react-redux';
import Routing from '../Routing';
import Loader from '../components/loader/loader';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'


const Layout = ( { dispatch , ERROR }) => {

    const snackbarHandleClose = () => {
        dispatch({ type : 'HIDE_ERROR' })
    }

    const renderSnackbarMessage = () => {
        return ( <span id="message-id">{ ERROR.message }</span> );
    }

    return (
        <div id="layout"> 
            {/* Notifivation */}
            <ReactNotification />
             
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
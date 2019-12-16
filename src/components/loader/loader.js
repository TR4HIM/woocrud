import React, { useState , useEffect } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ToggleDisplay from 'react-toggle-display';
import { CircularProgress, LinearProgress } from '@material-ui/core';

const Loader = ({LOADER, type , id , size , classes}) => {

    const [show,setShow] = useState(false);

    useEffect(()=>{
        let currentLoader =  LOADER.find((loader)=> loader.id === id);

        if( currentLoader )
            setShow(currentLoader.status);
    },[LOADER]);

    return (
        <ToggleDisplay id={id || ''} show={show} className={`loader ${ (type === 'linear') ? 'linear' : ''}`}>
            {
                (type !== 'linear') ? 

                <CircularProgress
                    variant="indeterminate"
                    disableShrink
                    className={classes.loader}
                    size={size || 28}
                    thickness={4}
                /> 
                :
                <LinearProgress 
                    variant="query" 
                    className="linear-loader"
                    classes={{
                        colorPrimary    : classes.linearColorPrimary,
                        barColorPrimary : classes.linearBarColorPrimary,
                    }}
                />

            }
            
        </ToggleDisplay>
    );
}

const styles = (theme)=> ({
    loader: {
        color : '#d35400', 
        animationDuration: '550ms'
    },
    linearColorPrimary: {
        backgroundColor: '#FF5C4A',
    },
    linearBarColorPrimary: {
        backgroundColor: '#242e3e',
    }
});

Loader.propTypes = {
    type : PropTypes.string,
    id : PropTypes.string,
    size : PropTypes.string,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = ({LOADER}) => ({LOADER});

export default withStyles(styles)(connect(mapStateToProps)(Loader))
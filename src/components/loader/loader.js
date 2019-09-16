import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ToggleDisplay from 'react-toggle-display';
import { CircularProgress, LinearProgress } from '@material-ui/core';

class Loader extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            show : false
        }
    }
    
    componentWillReceiveProps(nextProps) {

        let currentLoader =  nextProps.LOADER.find((loader)=> loader.id === this.props.id);

        if( currentLoader )
            this.setState({
                show : currentLoader.status
            })
        
    }
    
    render() {
        const { classes } = this.props;
        return (
            <ToggleDisplay id={this.props.id || ''} show={this.state.show} className={`loader ${ (this.props.type === 'linear') ? 'linear' : ''}`}>
                {
                    (this.props.type !== 'linear') ? 

                    <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        className={classes.loader}
                        size={this.props.size || 28}
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
}

Loader.propTypes = {
    classes: PropTypes.object.isRequired,
};


const styles = (theme)=> ({
    loader: {
        color : '#333',
        animationDuration: '550ms'
    },
    linearColorPrimary: {
        backgroundColor: '#fad843',
    },
    linearBarColorPrimary: {
        backgroundColor: '#333333',
    }
});


const mapStateToProps = (state) => {
    return {
        LOADER : state.LOADER
    }
}



export default withStyles(styles)(connect(mapStateToProps, null)(Loader))
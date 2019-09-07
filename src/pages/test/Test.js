import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {loading} from '../../layout/actions'
import {login} from './actions'
import { APP_ROUTES } from '../../config';
import SiteLoader from '../../components/SiteLoader';
import { protocol, endPoint } from '../../API';
import Header from '../../layout/header/Header';

class Test extends Component {

    constructor(props){
        super(props);

        this.state = {
            username : "",
            password : ""
        }
    }

    render() {
        return (
            <div id="login-page">
                <Header />
                <SiteLoader id="login-loader" />
                <div id="hel-test">
                    Hello Broda
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        AUTHORIZED : state.AUTHORIZED
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({
            loading,
            login
        }, dispatch ),

        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Test);
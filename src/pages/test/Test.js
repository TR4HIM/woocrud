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

    componentWillMount() {
        
        if(this.props.AUTHORIZED){
            // REDIRECT TO PRODUCTS PAGE
            this.props.history.push(APP_ROUTES.MY_PRODUCTS);
        }
    }

    keyPressHandler(e){
        if(e.keyCode === 13)
            this.login();
    }

    login(){

        // SHOW LOADER
        this.props.loading( true, 'login-loader' );

        let payload = {
            username : this.username.props.value,
            password : this.password.props.value
        };

        console.log('Here');
        return;
    }
    
    handleChange = name => event => {
        this.setState({
            [name] : event.target.value
        });
    };

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
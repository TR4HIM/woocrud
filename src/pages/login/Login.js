import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Paper from '@material-ui/core/Paper';
import { TextField , MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {loading} from '../../layout/actions';
import {login , storeUserData} from './actions';
import { APP_ROUTES , APP_PATHS } from '../../config';
import SiteLoader from '../../components/SiteLoader';
import Header from '../../layout/header/Header';
import { NavLink } from "react-router-dom";
import API from './server-effect';

class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            username : "admin",
            password : "admin"
        }
    } 

    static getDerivedStateFromProps(props,state) {
        
        if(props.AUTHORIZED){
            // REDIRECT TO PRODUCTS PAGE
            props.history.push(APP_ROUTES.PARAMETERS);
        }
        return null;
    }

    keyPressHandler(e){
        if(e.keyCode === 13)
            this.login();
    }

    login(){

        // SHOW LOADER
        this.props.loading( true, 'login-loader' );

        let payload = {
            username : this.username.value,
            password : this.password.value
        };


         

        API.LOGIN(payload)
            .then((data)=>{
                //Store User Category

                localStorage.setItem('woo-app', JSON.stringify(data));

                
                this.props.login(true);

                //Store User Category
                this.props.storeUserData(data);

                // HIDE LOADER
                this.props.loading( false , 'login-loader');

                // REDIRECT TO PRODUCTS PAGE
                this.props.history.push(APP_ROUTES.MY_PRODUCTS);
                
            })
            .catch((error)=>{

                this.props.dispatch({
                    type : 'ERROR',
                    payload : error
                });

                // HIDE LOADING
                this.props.loading( false, 'login-loader' );
            })
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
                <div id="login-form" elevation={1}>

                    <img id="logo" src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="kibo" />

                    <Paper id="paper" elevation={1}>
                        <form  className="form" >
                            <TextField
                                inputRef={(username) => this.username = username}
                                label="User name"
                                value={this.state.username}
                                onChange={this.handleChange('username')}
                                onKeyDown={(e)=>this.keyPressHandler(e)}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                inputRef={(password)=>this.password = password}
                                label="Password"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                onKeyDown={(e)=>this.keyPressHandler(e)}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                type="password"
                                InputLabelProps={{ shrink: true }}
                            />
                            <div className="action">
                                <Button variant="contained" color="primary" size="large" onClick={this.login.bind(this)} >
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </Paper>
                    <MenuItem>
						<NavLink activeClassName='selected' to={APP_PATHS.MY_PRODUCTS} >
							Products List
						</NavLink>
					</MenuItem>

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
            login,
            storeUserData
        }, dispatch ),

        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);
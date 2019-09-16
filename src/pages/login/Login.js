import React, {  useState , useEffect } from 'react';
import {connect} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {loading , login , storeUserData} from '../../store/actions/';
import { APP_ROUTES } from '../../config';
import Loader from '../../components/loader/loader';
import API from '../../API/';
import { withRouter } from 'react-router-dom';

const Login = ({dispatch, AUTHORIZED , history }) => {
     
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
   
    useEffect(() => {
        if(AUTHORIZED){
            // REDIRECT TO PRODUCTS PAGE
            history.push(APP_ROUTES.MY_PRODUCTS);
        }
    }, []);

    const keyPressHandler = (e) => {
        if(e.keyCode === 13)
        submitFormLogin();
    }

    const submitFormLogin = (e) => {
        e.preventDefault();
        dispatch(loading( true, 'login-loader' ));
        let payload = {
            username , password 
        };
        API.LOGIN(payload)
            .then((data)=>{
                localStorage.setItem('woo-app', JSON.stringify(data));
                dispatch(login(true));
                dispatch(storeUserData(data));
                dispatch(loading( false, 'login-loader' ));
                history.push(APP_ROUTES.MY_PRODUCTS);
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error
                });
                // HIDE LOADING
                loading( false, 'login-loader' );
            })
    }

    return (
        <div id="login-page">
            <Loader id="login-loader" />
            <div id="login-form" elevation={1}>
                <img id="logo" src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="kibo" />
                <Paper id="paper" elevation={1}>
                    <form  className="form" >
                        <TextField
                            label="Username"
                            value={username}
                            onChange    ={(e) => setUsername(e.target.value)}
                            onKeyDown   ={(e) => keyPressHandler(e)}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Password"
                            value={password}
                            onChange    ={(e) => setPassword(e.target.value)}
                            onKeyDown   ={(e) => keyPressHandler(e)}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            type="password"
                            InputLabelProps={{ shrink: true }}
                        />
                        <div className="action">
                            <Button variant="contained" color="primary" size="large" onClick={ submitFormLogin } >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </Paper>
            </div>
        </div>
    );
}

const mapStateToProps = ({ AUTHORIZED }) => ({ AUTHORIZED });

export default  connect(mapStateToProps)(Login); 
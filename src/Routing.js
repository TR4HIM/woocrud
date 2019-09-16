import React, { Component, Fragment , useState , useEffect } from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter,
    Route,
    withRouter,
    Switch
} from 'react-router-dom';
import { Redirect } from 'react-router';

import {login, loading} from './store/actions/';

// PAGES 
import Login from './pages/login/Login';
import Products from './pages/products/Products';
import Page404 from './pages/not-found/';

import API from './API/';

import {APP_PATHS} from './config';

const Routing = ( {dispatch , AUTHORIZED} ) => {
    
    const [readyToRender,setReadyToRender] = useState(false);
    
    useEffect(()=>{
        // CHECK IF USER IS ALREADY CONNECTED
        if(localStorage.getItem('woo-app')){
            // SHOW ROOT LOADING
            dispatch(loading(true, 'root-loader'));
    
            let token = JSON.parse(localStorage.getItem('woo-app')).token;
            
            API.TOKEN_VALIDATE(token)
                .then((result)=>{
                    dispatch(login(result.data.status === 200));
                    // HIDE ROOT LOADING
                    dispatch(loading(false, 'root-loader'));
    
                    setReadyToRender(true);
                })
                .catch((error)=>{
                    
                    dispatch({
                        type : 'ERROR',
                        payload : error
                    });
    
                    // HIDE ROOT LOADING
                    dispatch(loading(false, 'root-loader'));
                    setReadyToRender(true);
                })
        }else{
            setReadyToRender(true);
        }
        
    },[]);

    const renderRoutes = () => {
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path={APP_PATHS.HOME} component={Login} />

                    <PrivateRoute exact authed={AUTHORIZED}  path={APP_PATHS.MY_PRODUCTS}  component={Products}/>

                    <Route component={withRouter(Page404)} />
                </Switch>
            </BrowserRouter>
        )
    }

    return (
        <Fragment>
            {readyToRender ? renderRoutes() : null }
        </Fragment>
    )
};

const mapStateToProps = ({AUTHORIZED}) => ({AUTHORIZED});

const PrivateRoute = ({component: Component, authed, ...rest})=>{
    return (
        <Route
            {...rest}
            render={(props) => (authed === true) ? <Component {...props} /> : <Redirect to={APP_PATHS.HOME} />}
        />
    )
};

export default withRouter(connect(mapStateToProps)(Routing));
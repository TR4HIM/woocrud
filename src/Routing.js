import React, { Fragment , useState , useEffect } from 'react';
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
import Login from './pages/login';
import Products from './pages/products';
import AddProduct from './pages/add-product';
import EditProductPage from './pages/edit-product';
import Page404 from './pages/not-found';
import UserProfile from './pages/user-settings';

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
                    <Route exact component={withRouter(Login)} path={APP_PATHS.HOME} />
                    
                    <PrivateRoute exact authed={AUTHORIZED} component={withRouter(Products)} path={APP_PATHS.MY_PRODUCTS} />
                    <PrivateRoute exact authed={AUTHORIZED} component={withRouter(AddProduct)} path={APP_PATHS.ADD_PRODUCTS} />
                    <PrivateRoute exact authed={AUTHORIZED} component={withRouter(UserProfile)} path={APP_PATHS.PARAMETERS} />
                    <PrivateRoute exact authed={AUTHORIZED} component={withRouter(EditProductPage)} path={APP_PATHS.EDIT_PRODUCT} />
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
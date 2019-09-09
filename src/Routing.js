import React, { Component, Fragment } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    BrowserRouter,
    Route,
    withRouter,
    Switch
} from 'react-router-dom';
import { Redirect } from 'react-router';

import {login} from './pages/login/actions';
import {loading} from './layout/actions';

// PAGES 
import Login from './pages/login/Login';
import Products from './pages/products/Products';
import Page404 from './layout/NotFound';
import API from './pages/login/server-effect';

import {APP_PATHS} from './config';

class Routing extends Component {

    constructor(props){
        super(props);
        this.state = {
            readyToRender   : false
        }
    }
    
    componentDidMount (){
        // CHECK IF USER IS ALREADY CONNECTED
        if(localStorage.getItem('woo-app')){
            // SHOW ROOT LOADING
            this.props.loading(true, 'root-loader');
    
            let token = JSON.parse(localStorage.getItem('woo-app')).token;
            
            API.TOKEN_VALIDATE(token)
                .then((result)=>{
                    this.props.login(result.data.status === 200);
                    // HIDE ROOT LOADING
                    this.props.loading(false, 'root-loader');

                    this.setState({ readyToRender   : true });
                })
                .catch((error)=>{
                    
                    this.props.dispatch({
                        type : 'ERROR',
                        payload : error
                    });
    
                    // HIDE ROOT LOADING
                    this.props.loading(false, 'root-loader');
                    this.setState({ readyToRender   : true });
                })
        }else{
            this.setState({ readyToRender   : true });
        }
    }
  
    renderRoutes(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path={APP_PATHS.HOME} component={withRouter(Login)} />

                    <PrivateRoute exact authed={this.props.AUTHORIZED}  path={APP_PATHS.MY_PRODUCTS}  component={withRouter(Products)}/>

                    <Route component={withRouter(Page404)} />
                </Switch>
            </BrowserRouter>
        )
    }

    render() {
        return (
            <Fragment>
                {this.state.readyToRender ? this.renderRoutes() : null }
            </Fragment>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        AUTHORIZED  : state.AUTHORIZED
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({
            login,
            loading
        }, dispatch ),

        dispatch
    }
}

const PrivateRoute = ({component: Component, authed, ...rest})=>{
    return (
        <Route
            {...rest}
            render={(props) => (authed === true) ? <Component {...props} /> : <Redirect to={APP_PATHS.HOME} />}
        />
    )
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routing));
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
import Test from './pages/test/Test';


import {APP_PATHS} from './config';

class Routing extends Component {

    constructor(props){
        super(props);

        this.state = {
            readyToRender   : false
        }
    }

    
    // componentWillReceiveProps(nextProps){

    //     this.setState({
    //         readyToRender : true
    //     });

    // }

    // componentWillMount() {
    //     this.setState({
    //         readyToRender : true
    //     })
    // }

    static getDerivedStateFromProps(props,state) {
        
        // if(props.AUTHORIZED){
        //     // REDIRECT TO PRODUCTS PAGE
        //     props.history.push(APP_ROUTES.MY_PRODUCTS);
        // }
        return { readyToRender : true }
    }
    renderRoutes(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path={APP_PATHS.HOME} component={withRouter(Login)} />
                    <Route exact path="/test" component={withRouter(Test)} />

                    <PrivateRoute exact authed={this.props.AUTHORIZED}  path={APP_PATHS.ADD_PRODUCTS}  component={withRouter(Login)}/>


                    {/* <Route component={withRouter(Page404)} /> */}
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
            render={(props) => (authed === true) ? <Component {...props} /> : <Redirect to={APP_PATHS.LOGIN} />}
        />
    )
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routing));
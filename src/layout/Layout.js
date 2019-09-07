import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Routing from '../Routing';
import SiteLoader from '../components/SiteLoader';
import { loading } from './actions';


class Layout extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            moldLoaded : false
        }

    }

    render() {
        return (
            <div id="layout"> 
                {/* LOADER */}
                <SiteLoader id="root-loader" />             
                
                {/* APP ROUTING */}
                <Routing />

            </div>
        )
    }
    
};




const mapStateToProps = (state) => {
    return {
        ERROR           : state.ERROR
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({
            loading
        }, dispatch ),

        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Layout);
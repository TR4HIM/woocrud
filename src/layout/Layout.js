import React, { useState } from 'react';
import {connect} from 'react-redux';
import Routing from '../Routing';
import SiteLoader from '../components/SiteLoader';


const Layout = (dispatch,ERROR) => {

    const [moldLoaded, setMoldLoaded] = useState(false);

    return (
        <div id="layout"> 
            {/* LOADER */}
            <SiteLoader id="root-loader" />             
            
            {/* APP ROUTING */}
            <Routing />

        </div>
    )
    
};

const mapStateToProps = ({ ERROR }) => ({ ERROR })

export default connect(mapStateToProps)(Layout);
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {
    storeCheckedProducts
} from './actions';

class WooProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checked         : false,
            visualLoaded    : false
        }
    }

    

    handleClick(){

        this.setState((prevProps)=>({
            checked : !prevProps.checked
        }));

        // STORE PRODUCT
        this.props.storeCheckedProducts(this.props.data);

    }

    render() {

        return (
            <li 
                onClick={this.handleClick.bind(this)}
                ref={(ref)=>this.product = ref} 
                className={`product ${this.state.checked ? 'checked' : ''} checkable`} 
                id={this.props.data.id} 
            >
                <div className={`thumbnail ${this.state.visualLoaded ? 'visual-loaded' : ''}`}>
                    <img className="visual" src={this.props.data.thumbnail} alt="" onLoad={()=>this.setState({ visualLoaded : true })} />
                    <img className="mold" src={`${process.env.PUBLIC_URL}/img/product-image-mold.png`} alt="" />
                </div>
                <h3 className="title">{this.props.data.name}</h3>
                { this.state.checked ? <CheckCircleIcon color="primary" style={{ fontSize: 28 }} className="check-icon" /> : null }
            </li>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        KIBO_PRODUCTS        : state.KIBO_PRODUCTS,
        CHECKED_PRODUCTS     : state.CHECKED_PRODUCTS
    }
}

const mapDispatchToProps = (dispatch) =>{ 
    return {
        ...bindActionCreators({
            storeCheckedProducts
        }, dispatch ),

        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WooProduct);
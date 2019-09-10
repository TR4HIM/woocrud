import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    storeCheckedProducts,
    editWooProduct
} from './actions';
import ToggleDisplay from 'react-toggle-display';

class WooProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checked         : false,
            visualLoaded    : false
        }
    }


    handleClick(){
        // EDIT PRODUCT
        this.props.editWooProduct(true, this.props.data);
    }

    render() {

        return (
            <li onClick={this.handleClick.bind(this)}
                ref={(ref)=>this.product = ref} 
                className={`product ${(this.props.data.status === 'private') ? 'private' : ''} ${(this.props.data.bargain) ? 'bargain' : ''} `} 
                id={this.props.data.id} 
            >
            <div className={`thumbnail ${this.state.visualLoaded ? 'visual-loaded' : ''}`}>
                <img className="visual" src={this.props.data.images[0].src} alt="" onLoad={()=>this.setState({ visualLoaded : true })} />
                <img className="mold" src={`${process.env.PUBLIC_URL}/img/product-image-mold.png`} alt="" />
            </div>
            <h3 className="title">{this.props.data.name}</h3>

            <ToggleDisplay show={Boolean(this.props.data.regular_price.length) || Boolean(this.props.data.sale_price.length) } className={`details ${ ( this.props.data.sale_price && (this.props.data.regular_price !== this.props.data.sale_price ) )  ? 'in-promo' : ''}`}>
                { this.props.data.regular_price ? <span className="price regular">{this.props.data.regular_price}<small> Dh</small></span> : null }
                { ( this.props.data.sale_price && (this.props.data.regular_price !== this.props.data.sale_price ) ) ? <span className="price promo">{this.props.data.sale_price}<small> Dh</small></span> : null }
            </ToggleDisplay>

            {/* LABELS */}
            { (this.props.data.status === 'private') ? <small className="private-icon" >PRIVATE_TEXT</small> : null }
            <div className="extra-fields-label">
                { (this.props.data.bargain) ? <small className="bargain-icon" >BARGAIN_TEXT</small> : null }
                { (this.props.data.fake) ? <small className="fake-icon" >FAKE_TEXT</small> : null }
            </div>

            <span className="edit-btn">EDIT</span>
            </li>
        );
    }

}



const mapDispatchToProps = (dispatch) =>{ 
    return {
        ...bindActionCreators({
            storeCheckedProducts,
            editWooProduct
        }, dispatch ),

        dispatch
    }
}

export default connect(null, mapDispatchToProps)(WooProduct);
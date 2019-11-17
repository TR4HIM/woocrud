import React, {  useState , useEffect  } from 'react';
import {connect} from 'react-redux';
import { Link} from "react-router-dom";
import { editWooProduct } from '../../store/actions/';
import ToggleDisplay from 'react-toggle-display';

const WooProduct = ({dispatch , data }) => {

    const [visualLoaded,setVisualLoaded]    = useState(false);


    const openModalEdit = () => {
        dispatch(editWooProduct(true,data));
    }
    
    return (
        <li 
            className={`product ${(data.isUpdated) ? 'product-item-updated' : ''}`} 
            id={data.id} 
        >
            <div className={`thumbnail ${visualLoaded ? 'visual-loaded' : ''}`}>
                { (data.images.length>0) ? <img className="visual" src={data.images[0].src} alt="" onLoad={()=>setVisualLoaded(true)} /> : "" }
                <img className="mold" src={`${process.env.PUBLIC_URL}/img/product-image-mold.png`} alt="" />
            </div>
            <h3 className="title">{data.name}</h3>

            <ToggleDisplay show={Boolean(data.regular_price.length) || Boolean(data.sale_price.length) } className={`details ${ ( data.sale_price && (data.regular_price !== data.sale_price ) )  ? 'in-promo' : ''}`}>
                { data.regular_price ? <span className="price regular">{data.regular_price}<small> Dh</small></span> : null }
                { ( data.sale_price && (data.regular_price !== data.sale_price ) ) ? <span className="price promo">{data.sale_price}<small> Dh</small></span> : null }
            </ToggleDisplay>

            {/* LABELS */}
            { (data.status === 'private') ? <small className="private-icon" >PRIVATE_TEXT</small> : null }
            <div className="extra-fields-label">
                { (data.bargain) ? <small className="bargain-icon" >BARGAIN_TEXT</small> : null }
                { (data.fake) ? <small className="fake-icon" >FAKE_TEXT</small> : null }
            </div>
            <span className="edit-btn" onClick={openModalEdit}>
                EDIT
            </span>
            <span className="edit-btn">
                <Link to={`/edit-produit/${data.id}`}>
                    ADV EDIT 
                </Link>
            </span>
        </li>
    );

}

export default connect()(WooProduct);
import React, {  useState } from 'react';
import {connect} from 'react-redux';
import { Link} from "react-router-dom";
import { editWooProduct } from '../../store/actions/';
import ToggleDisplay from 'react-toggle-display';

const WooProduct = ({dispatch , data }) => {

    const [visualLoaded,setVisualLoaded]    = useState(false);

    const openModalEdit = () => {
        dispatch(editWooProduct(true,data)); 
    }
    
    let imgUrl = (data.images.length>0 && data.images[0].src !== false) ? data.images[0].src : `${process.env.PUBLIC_URL}/img/product-image-mold.png`;

    return (
        <li 
            className={`product ${(data.isUpdated) ? 'product-item-updated' : ''}`} 
            id={data.id} 
        >
            <div className={`thumbnail ${visualLoaded ? 'visual-loaded' : ''}`} style={{backgroundImage: `url(${imgUrl})`}}>
                { (data.images.length>0 && data.images[0].src !== false) ? <img className="visual" src={data.images[0].src} alt="" onLoad={()=>setVisualLoaded(true)} /> : "" }
                <img className="mold" src={`${process.env.PUBLIC_URL}/img/product-image-mold.png`} alt="" />
                <div className="product-edit-btns">
                    <span className="edit-btn" onClick={openModalEdit}>
                        Quick Edit
                    </span>
                    <span className="edit-btn">
                        <Link to={`/edit-produit/${data.id}`}>
                            Advanced Edit
                        </Link>
                    </span>
                </div>
            </div>
            <h3 className="title">{data.name}</h3>
            <ToggleDisplay show={Boolean(data.regular_price.length) || Boolean(data.sale_price.length) } className={`details ${ ( data.sale_price && (data.regular_price !== data.sale_price ) )  ? 'in-promo' : ''}`}>
                { data.regular_price ? <span className="price regular">{data.regular_price}<small> Dh</small></span> : null }
                { ( data.sale_price && (data.regular_price !== data.sale_price ) ) ? <span className="price promo">{data.sale_price}<small> Dh</small></span> : null }
            </ToggleDisplay>
        </li>
    );

}

export default connect()(WooProduct);
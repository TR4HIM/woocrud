import React, {  useState } from 'react';
import PropTypes from 'prop-types';
import { Link} from "react-router-dom";
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ToggleDisplay from 'react-toggle-display';
import EditIcon from '@material-ui/icons/Edit';
import ModalConfirmation from '../../components/modal-confirmation/ModalConfirmation';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {APP_PATHS} from '../../config';

const WooProduct = ({data , deleteFunc , openModalEdit , liveUrl}) => {

    const [anchorEl, setAnchorEl]                       =  useState(null);
    const [isImageLoading, setIsImageLoading]           = useState(false);
    const [showConfirmation, setShowConfirmation]        = useState(false);
    const openModal = () => {
        setAnchorEl(null);
        openModalEdit(data)
    }

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const deleteProduct = (action) => {
        setAnchorEl(null);
        setShowConfirmation(false);
        if(action === true) {
            deleteFunc(data.id);
        }
    }

    return (
        <li 
            className={`product-item ${(data.isUpdated) ? 'product-item-updated' : ''}`} 
            id={data.id} 
        >   
            <div className="product">
                <ModalConfirmation product={data.name} openModalConfirmation={showConfirmation} validateAction={(val)=>deleteProduct(val)}/>
                <div className="product-img-container">
                    {(data.images.length>0 && data.images[0].src !== false) ?
                        <div className="thumbnail" style={{backgroundImage: `url(${data.images[0].src})`}}>
                        { !isImageLoading && <div className="loading-animation"></div> }
                            <img className="visual" src={data.images[0].src} alt="" onLoad={()=>setIsImageLoading(true)} /> 
                        </div> :
                        <div className="no-thumbnail">
                            <span>No Image</span>
                        </div> 
                    }
                    <div className={`product-action ${(anchorEl !== null) ? 'active' : ''} `}>
                        <div className="action-icon action-icon-more">
                            <Button aria-describedby={Boolean(anchorEl) ? 'simple-popover' : undefined} onClick={handleClick} className="btn-popover">
                                <MoreHoriz />
                            </Button>
                        </div>
                        <div className="action-icon action-icon-edit">
                            <Button aria-describedby={Boolean(anchorEl) ? 'simple-popover' : undefined}  onClick={()=>openModal(data)} className="btn-popover">
                                <EditIcon />
                            </Button>
                        </div>
                        <div className={`action-icon action-icon-preview action-icon-private`}>
                            {
                                (data.status === 'publish') ? (
                                    <a href={`${liveUrl}/?post_type=product&p=${data.id}`} 
                                    target="_blank" rel="noopener noreferrer">
                                        <OpenInNewIcon />
                                    </a>
                                ) : (
                                    <span className="text-private">
                                        Private
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="product-info">
                    <h3 className="title">
                        {data.name}
                    </h3>
                    <ToggleDisplay show={Boolean(data.regular_price.length)} className={`details ${ ( data.sale_price && (data.regular_price !== data.sale_price ) )  ? 'in-promo' : ''}`}>
                        { ( data.sale_price && (data.regular_price !== data.sale_price ) ) ? <span className="price promo">${data.sale_price} </span> : null }
                        { data.regular_price ? <span className="price regular">${data.regular_price} </span> : null }
                    </ToggleDisplay>
                </div>
                
                <Popover
                    id={Boolean(anchorEl) ? 'simple-popover' : undefined}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                >   
                    <ul className="popover-links">
                        <li>
                            <Link to={ APP_PATHS.EDIT_PRODUCT.replace(':productId', data.id ) }>
                                Advanced Edit
                            </Link>
                        </li>
                        <li>
                            <a id="product-item-delete-button" onClick={() => setShowConfirmation(true)} className="danger">
                                Delete Product
                            </a>
                        </li>
                    </ul>
                </Popover>
            </div>
        </li>
    );
}

WooProduct.propTypes = {
    data : PropTypes.object,
    deleteFunc : PropTypes.func,
    openModalEdit : PropTypes.func,
}

export default WooProduct;
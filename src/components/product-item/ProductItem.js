import React, {  useState } from 'react';
import PropTypes from 'prop-types';
import { Link} from "react-router-dom";
import MoreVert from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ToggleDisplay from 'react-toggle-display';
import EditIcon from '@material-ui/icons/Edit';
import ModalConfirmation from '../../components/modal-confirmation/ModalConfirmation';

const WooProduct = ({data , deleteFunc , openModalEdit , liveUrl}) => {

    const [anchorEl, setAnchorEl]                       =  useState(null);
    const [isImageLoading, setIsImageLoading]           = useState(false);
    const [showConfirmation,setShowConfirmation]        = useState(false);
    
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
            className={`product ${(data.isUpdated) ? 'product-item-updated' : ''}`} 
            id={data.id} 
        >   
            <ModalConfirmation product={data.name} openModalConfirmation={showConfirmation} validateAction={(val)=>deleteProduct(val)}/>
            <div className="product-info">
                <h3 className="title">
                    {data.name}
                </h3>
                <ToggleDisplay show={Boolean(data.regular_price.length)} className={`details ${ ( data.sale_price && (data.regular_price !== data.sale_price ) )  ? 'in-promo' : ''}`}>
                    { ( data.sale_price && (data.regular_price !== data.sale_price ) ) ? <span className="price promo">{data.sale_price}<small> Dh</small></span> : null }
                    { data.regular_price ? <span className="price regular"> {data.regular_price}<small> Dh</small></span> : null }
                </ToggleDisplay>
                <div className="product-popover">
                    <Button aria-describedby={Boolean(anchorEl) ? 'simple-popover' : undefined} onClick={handleClick} className="btn-popover">
                        <MoreVert />
                    </Button>
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
                                <a href={`${liveUrl}/?post_type=product&p=${data.id}`} target="_blank" rel="noopener noreferrer">
                                    View Product ...
                                </a>
                            </li>
                            <li>
                                <Link to={`/edit-produit/${data.id}`}>
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
            </div>
            <div className="product-img-container" onClick={()=>openModal(data)}>
                {(data.images.length>0 && data.images[0].src !== false) ?
                    <div className="thumbnail" style={{backgroundImage: `url(${data.images[0].src})`}}>
                    { !isImageLoading && <div className="loading-animation"></div> }
                        <img className="visual" src={data.images[0].src} alt="" onLoad={()=>setIsImageLoading(true)} /> 
                    </div> :
                    <div className="no-thumbnail">
                        <span>No Image</span>
                    </div> 
                }
                <Button className="btn-edit-modal">
                        <EditIcon />
                </Button>
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
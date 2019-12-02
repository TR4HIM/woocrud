import React, {  useState } from 'react';
import PropTypes from 'prop-types';
import { Link} from "react-router-dom";
import MoreVert from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

const WooProduct = ({data , deleteFunc , openModalEdit}) => {

    const [visualLoaded,setVisualLoaded]    = useState(false);
    const [anchorEl, setAnchorEl] =  useState(null);

    const openModal = () => {
        handleClose();
        openModalEdit(data)
    }

    let imgUrl = (data.images.length>0 && data.images[0].src !== false) ? data.images[0].src : `${process.env.PUBLIC_URL}/img/product-image-mold.png`;


    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const deleteProduct = () => {
        deleteFunc(data.id)
    }

    return (
        <li 
            className={`product ${(data.isUpdated) ? 'product-item-updated' : ''}`} 
            id={data.id} 
        >
            <div className="product-info">
                <h3 className="title">
                    {data.name}
                </h3>
                <div className="product-popover">
                    <Button aria-describedby={id} onClick={handleClick} className="btn-popover">
                        <MoreVert />
                    </Button>
                    <Popover
                        id={id}
                        open={open}
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
                            <a onClick={()=>openModal(data)}>
                                Quick Edit
                            </a>
                        </li>
                        <li>
                            <Link to={`/edit-produit/${data.id}`}>
                                Advanced Edit
                            </Link>
                        </li>
                        <li>
                            <a onClick={deleteProduct} className="danger">
                                Delete Product
                            </a>
                        </li>
                    </ul>
                    </Popover>
                </div>
            </div>
            <div className={`thumbnail ${visualLoaded ? 'visual-loaded' : ''}`} style={{backgroundImage: `url(${imgUrl})`}}>
                { (data.images.length>0 && data.images[0].src !== false) ? <img className="visual" src={data.images[0].src} alt="" onLoad={()=>setVisualLoaded(true)} /> : "" }
                <img className="mold" src={`${process.env.PUBLIC_URL}/img/product-image-mold.png`} alt="" />
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
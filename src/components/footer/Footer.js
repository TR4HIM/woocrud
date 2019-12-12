import React  from 'react';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const Footer = () => {
    return (
        <footer id="main-footer">
            {(new Date().getFullYear())} © WooCrud. All Rights Reserved. Crafted with { <FavoriteBorderIcon /> } By <a href="#"> <strong>Us</strong> </a>
        </footer>
    )
};

export default  Footer;